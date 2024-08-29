import { sql } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  username: text('username'),
  email: text('email').notNull().unique(),
  passwordHashed: text('passwordHashed'),
  role: text('role').$type<'admin' | 'customer'>(),
  googleId: text('google_id'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const emailVerificationCode = pgTable('email_verification_code', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  code: text('code'),
  userId: text('userId').references(() => user.id),
  email: text('email'),
  expiresAt: timestamp('expires_at'),
});
