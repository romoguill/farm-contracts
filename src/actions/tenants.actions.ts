'use server';

import { tenant } from '@/db/schema';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/dbClient';
import { eq } from 'drizzle-orm';

export async function getTenants() {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const tenants = db.query.tenant.findMany({
    where: eq(tenant.userId, user.id),
  });

  return tenants;
}
