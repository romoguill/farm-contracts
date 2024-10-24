'use server';

import {
  contract,
  contractToParcel,
  marketData,
  UploadedFile,
  uploadedFile,
} from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { Optional } from '@/lib/utils';
import { contractPDFSchema, CreateContract, Months } from '@/lib/validation';
import {
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
  waitUntilObjectNotExists,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { and, asc, desc, eq, gte, inArray, lte } from 'drizzle-orm';
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

export async function editContract({
  id,
  data,
  filesSerialized,
  s3IdsToDelete,
}: {
  id: string;
  data: Omit<CreateContract, 'files'>;
  filesSerialized: FormData;
  s3IdsToDelete: string[];
}) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const { parcelIds, ...contractValues } = data;

  try {
    await db.transaction(
      async (tx) => {
        // Update Contract table
        const [updatedContract] = await tx
          .update(contract)
          .set({ ...contractValues })
          .where(eq(contract.id, id))
          .returning();

        // Delete old relations in join table
        await tx
          .delete(contractToParcel)
          .where(eq(contractToParcel.contractId, id));

        // Update join table
        await tx.insert(contractToParcel).values(
          data.parcelIds.map((parcelId) => ({
            parcelId: parcelId,
            contractId: updatedContract.id,
          }))
        );

        if (filesSerialized.getAll('files').length !== 0) {
          const { error: fileUploadError, files } = await uploadContractPdf(
            filesSerialized
          );

          // If an error occured in S3 I can't create entry in uploadFile, so I rollback the whole transaction.
          if (fileUploadError !== null) {
            tx.rollback();
            return;
          }

          // Add new files
          await tx.insert(uploadedFile).values(
            files.map((file) => ({
              contractId: updatedContract.id,
              name: file.fileName,
              s3Id: file.s3Id,
            }))
          );
        }

        // Delete removed files that where already stored from DB
        await tx
          .delete(uploadedFile)
          .where(inArray(uploadedFile.s3Id, s3IdsToDelete));
      },
      {
        isolationLevel: 'read committed',
        accessMode: 'read write',
        deferrable: true,
      }
    );

    // Delete removed files that where already stored from S3
    await deleteContractPdfs(s3IdsToDelete);
  } catch (error) {
    console.error(error);
    throw error;
  }
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

  contracts.forEach((contract) => getContractPdfUrls(contract.files));

  // await getContractPdfUrls(contracts.map(contract => contract.))

  return { data: contracts };
}

export async function getContractById(id: string) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const response = await db.query.contract.findFirst({
      where: and(eq(contract.userId, user.id), eq(contract.id, id)),
      with: {
        files: true,
        contractToParcel: {
          with: {
            parcel: true,
          },
        },
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
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
    const { user } = await validateRequest();

    if (!user) {
      throw new Error('Invalid credentials');
    }

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

export type FileWithUrl = Optional<UploadedFile, 'id' | 's3Id'> & {
  url: string;
};

// Get urls are only going to work for already uploaded files.
// When using optimistic update, the values of id and s3Id will not be present
export async function getContractPdfUrls(
  files: Optional<UploadedFile, 'id' | 's3Id'>[]
) {
  const urls: FileWithUrl[] = [];

  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error('Invalid credentials');
    }

    for (const file of files) {
      if (!file.id || !file.s3Id) continue;
      const params: GetObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: file.s3Id,
      };
      const command = new GetObjectCommand(params);
      // Since it's a private bucket, create a url to download file that lasts for 20min
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 20 });
      urls.push({ ...file, url: signedUrl });
    }

    return urls;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function deleteContractPdfs(fileS3Ids: string[]) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const params: DeleteObjectsCommandInput = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Delete: {
        Objects: fileS3Ids.map((k) => ({ Key: k })),
      },
    };

    await s3.send(new DeleteObjectsCommand(params));

    // Decided not to use code below. User shouldn't care aboute s3 removal. Only, db removal

    // // Not sure if wait for confirmation of delete or just use the promise above to resolve.
    // // Need to be at least 6 seconds the wait due to library restrictions. It's too long....
    // for (const file in fileS3Ids) {
    //   await waitUntilObjectNotExists(
    //     { client: s3, maxWaitTime: 6 },
    //     { Bucket: process.env.AWS_BUCKET_NAME!, Key: file }
    //   );
    // }
  } catch (error) {
    console.error(error);
  }
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

export async function getNewestContract() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return db.query.contract.findFirst({
      where: eq(contract.userId, user.id),
      orderBy: desc(contract.endDate),
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

type GraphData = {
  month: Months;
  contractsCount: number;
  contractsValue: number;
}[];

export async function getContractsGraphData(year: number): Promise<GraphData> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const startDate = new Date(`${year}/01/01`);
    const endDate = new Date(`${year}/12/31`);

    const contracts = await db
      .select()
      .from(contract)
      .where(
        and(
          eq(contract.userId, user.id),
          and(
            lte(contract.startDate, endDate),
            gte(contract.endDate, startDate)
          )
        )
      );

    const soyPrice = await db.query.marketData.findFirst({
      orderBy: desc(marketData.date),
    });

    const months: Months[] = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    const monthData: GraphData = new Array(12)
      .fill(undefined)
      .map((_item, i) => ({
        month: months[i],
        contractsCount: 0,
        contractsValue: 0,
      }));

    monthData.forEach((item, i) => {
      contracts.forEach((contract) => {
        if (
          (contract.startDate.getMonth() <= i ||
            contract.startDate.getFullYear() < year) &&
          (contract.endDate.getMonth() >= i ||
            contract.endDate.getFullYear() > year)
        ) {
          item.contractsCount++;
          item.contractsValue += contract.soyKgs * (soyPrice?.price || 0);
        }
      });
    });

    return monthData;
  } catch (error) {
    throw error;
  }
}

export async function getActiveContractsAndParcels() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const contracts = await db.query.contract.findMany({
      where: and(
        eq(contract.userId, user.id),
        and(
          lte(contract.startDate, new Date()),
          gte(contract.endDate, new Date())
        )
      ),
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
