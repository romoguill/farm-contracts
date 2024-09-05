'use server';

import { contract, contractToParcel } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { contractPDFSchema, CreateContract } from '@/lib/validation';
import {
  S3Client,
  PutObjectCommand,
  S3ClientConfig,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { ZodError } from 'zod';
import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// GET ALL
export async function createContract(data: CreateContract) {
  const { user } = await validateRequest();

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  try {
    await db.transaction(async (tx) => {
      const [insertedContract] = await db
        .insert(contract)
        .values({
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
    });
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
      contractToParcel: true,
    },
  });

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
  const file = formData.get('pdfUpload');

  try {
    // Validate file (size and type)
    const parsedFile = contractPDFSchema.parse(file);

    const uploadId = crypto.randomBytes(32).toString('hex');
    // Get contents of the file in a node buffer
    const fileBuffer = Buffer.from(await parsedFile.arrayBuffer());

    // Setup S3 command for uploading object
    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: uploadId,
      Body: fileBuffer,
      ContentType: 'application/pdf',
    };
    const command = new PutObjectCommand(params);
    // Upload pdf file
    await s3.send(command);
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
      console.log(url);
    }
  } catch (error) {}
}
