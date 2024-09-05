'use server';

import { contract, contractToParcel } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { contractPDFSchema, CreateContract } from '@/lib/validation';
import { S3Client, PutObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { ZodError } from 'zod';

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
    const parsedFile = contractPDFSchema.parse(file);

    const fileBuffer = Buffer.from(await parsedFile.arrayBuffer());
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: parsedFile.name,
      Body: fileBuffer,
      ContentType: 'application/pdf',
    };

    const command = new PutObjectCommand(params);

    const response = await s3.send(command);
    console.log(response);
  } catch (error) {
    console.error(error);
    if (error instanceof ZodError) {
      return { error: 'Invalid upload' };
    }

    return { error: 'Something went wrong' };
  }
}
