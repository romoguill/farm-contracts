'use server';

import { contract, contractToParcel, uploadedFile } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { contractPDFSchema, CreateContract } from '@/lib/validation';
import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { and, asc, eq } from 'drizzle-orm';
import crypto from 'node:crypto';
import { ZodError } from 'zod';

// GET ALL
export async function createContract({
  data,
  filesSerialized,
}: {
  data: Omit<CreateContract, 'files'>;
  filesSerialized: FormData;
}) {
  const { user } = await validateRequest();

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  try {
    await db.transaction(
      async (tx) => {
        const [insertedContract] = await tx
          .insert(contract)
          .values({
            title: data.title,
            tenantId: data.tenantId,
            startDate: data.startDate,
            endDate: data.endDate,
            soyKgs: data.soyKgs,
            userId: user.id,
          })
          .returning();

        await tx.insert(contractToParcel).values(
          data.parcelIds.map((parcelId) => ({
            parcelId: parcelId,
            contractId: insertedContract.id,
          }))
        );

        const { error: fileUploadError, files } = await uploadContractPdf(
          filesSerialized
        );

        // If an error occured in S3 I can't create entry in uploadFile, so I rollback the whole transaction.
        if (fileUploadError !== null) {
          tx.rollback();
          return;
        }

        await tx.insert(uploadedFile).values(
          files.map((file) => ({
            contractId: insertedContract.id,
            name: file.fileName,
            s3Id: file.s3Id,
          }))
        );
      },
      {
        isolationLevel: 'read committed',
        accessMode: 'read write',
        deferrable: true,
      }
    );
  } catch (error) {
    console.error(error);
    return { error: 'Error creating contract' };
  }

  return { error: null };
}

export async function getContracts() {
  const { user } = await validateRequest();

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  const contracts = await db.query.contract.findMany({
    where: eq(contract.userId, user.id),
    with: {
      files: true,
    },
  });

  contracts.forEach((contract) =>
    getContractPdfUrls(contract.files.map((file) => file.s3Id))
  );

  // await getContractPdfUrls(contracts.map(contract => contract.))

  return { data: contracts };
}

// CONTRACT PDF FILE
const s3Config: S3ClientConfig = {
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
};

const s3 = new S3Client(s3Config);

export async function uploadContractPdf(formData: FormData) {
  const files = formData.getAll('files');

  try {
    // Validate file (size and type)
    const parsedFiles = contractPDFSchema.parse(files);

    let s3Ids: string[] = [];
    const uploadPromises = parsedFiles.map(async (file) => {
      const uploadId = crypto.randomBytes(32).toString('hex');
      s3Ids.push(uploadId);
      // Get contents of the file in a node buffer
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      // Setup S3 command for uploading object
      const params: PutObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: uploadId,
        Body: fileBuffer,
        ContentType: 'application/pdf',
      };

      const command = new PutObjectCommand(params);
      // Upload pdf file
      return s3.send(command);
    });

    await Promise.all(uploadPromises);

    return {
      files: parsedFiles.map((file, i) => ({
        fileName: file.name,
        s3Id: s3Ids[i],
      })),
      error: null,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      return { error: 'Invalid upload' };
    }

    return { error: 'File upload failed' };
  }
}

export async function getContractPdfUrls(fileIds: string[]) {
  try {
    for (const fileId of fileIds) {
      const params: GetObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileId,
      };
      const command = new GetObjectCommand(params);
      // Since it's a private bucket, create a url to download file that lasts for 20min
      const url = await getSignedUrl(s3, command, { expiresIn: 60 * 20 });
    }
  } catch (error) {}
}

// Getter with all relations, used for dashboard viewer
export async function getContractsForDashboard() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const contracts = await db.query.contract.findMany({
      where: eq(contract.userId, user.id),
      with: {
        contractToParcel: {
          with: {
            parcel: true,
          },
        },
      },
    });

    return contracts;
  } catch (error) {
    throw error;
  }
}

export async function getContractForDashboard(contractId: string) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const contracts = await db.query.contract.findFirst({
      where: and(eq(contract.userId, user.id), eq(contract.id, contractId)),
      with: {
        contractToParcel: {
          with: {
            parcel: true,
          },
        },
        tenant: true,
      },
    });

    return contracts;
  } catch (error) {
    throw error;
  }
}

export async function getOldestContract() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return db.query.contract.findFirst({
      where: eq(contract.userId, user.id),
      orderBy: asc(contract.startDate),
      with: {
        contractToParcel: {
          with: {
            parcel: true,
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}
