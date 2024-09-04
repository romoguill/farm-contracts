'use server';

import { contract, contractToParcel } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { CreateContract } from '@/lib/validation';

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
