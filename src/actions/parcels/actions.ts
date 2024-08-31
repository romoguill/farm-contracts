'use server';

import { Parcel, parcel } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { eq } from 'drizzle-orm';

export async function getParcels(): Promise<Parcel[]> {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const parcels = await db.query.parcel.findMany({
    where: eq(parcel.userId, user.id),
  });

  return parcels;
}
