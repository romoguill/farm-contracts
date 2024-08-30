import { sql } from 'drizzle-orm';
import {
  boolean,
  char,
  decimal,
  doublePrecision,
  numeric,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  username: text('username'),
  email: text('email').notNull().unique(),
  passwordHashed: text('passwordHashed'),
  role: text('role').$type<'admin' | 'customer'>(),
  googleId: text('google_id'),
  emailVerified: boolean('email_verified').default(false),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export const emailVerificationCode = pgTable('email_verification_code', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  code: text('code').notNull(),
  userId: text('userId').references(() => user.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const contract = pgTable('contract', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  soyKgs: smallint('soy_kgs').notNull(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  parcelId: uuid('parcel_id')
    .references(() => parcel.id)
    .notNull(),
});

export const parcel = pgTable(
  'parcel',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    label: char('label', { length: 2 }).unique(),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    coordinates: doublePrecision('coordinates').array(2).array().notNull(),
    area: decimal('area').notNull(),
  },
  (t) => ({
    unq: unique().on(t.label, t.userId),
  })
);
