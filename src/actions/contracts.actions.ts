'use server';

import { contract, contractToParcel } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { contractPDFSchema, CreateContract } from '@/lib/validation';
import { S3Client } from '@aws-sdk/client-s3';

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

const s3Config = {
  bucketName: process.env.AWS_BUCKET_NAME!,
  region: process.env.AWS_BUCKET_REGION!,
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
};

export async function uploadContractPdf(formData: FormData) {
  const file = formData.get('pdfUpload');
  console.log(file.type);

  try {
    const parsedFile = contractPDFSchema.parse(file);
    console.log(parsedFile);
  } catch (error) {
    console.error(error);
  }
}
