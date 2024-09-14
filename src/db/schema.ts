import {
  BuildQueryResult,
  ExtractTablesWithRelations,
  relations,
  sql,
} from 'drizzle-orm';
import { BuildAliasTable } from 'drizzle-orm/mysql-core';
import {
  boolean,
  char,
  decimal,
  doublePrecision,
  pgTable,
  primaryKey,
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

export const userRelations = relations(user, ({ many }) => ({
  contracts: many(contract),
  parcels: many(parcel),
}));

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
});

export type Contract = typeof contract.$inferSelect;

export const contractRelations = relations(contract, ({ one, many }) => ({
  owner: one(user, {
    fields: [contract.userId],
    references: [user.id],
  }),
  contractToParcel: many(contractToParcel),
  files: many(uploadedFile),
}));

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
    coordinates: doublePrecision('coordinates').array().array().notNull(),
    area: decimal('area').notNull(),
    color: char('color', { length: 3 }).array().notNull(),
  },
  (t) => ({
    unq: unique().on(t.label, t.userId),
  })
);

export type Parcel = typeof parcel.$inferSelect;

export const parcelRelations = relations(parcel, ({ one, many }) => ({
  owner: one(user, {
    fields: [parcel.userId],
    references: [user.id],
  }),
  contractToParcel: many(contractToParcel),
}));

export const contractToParcel = pgTable(
  'contract_to_parcel',
  {
    contractId: uuid('contract_id')
      .notNull()
      .references(() => contract.id),
    parcelId: uuid('parcel_id')
      .notNull()
      .references(() => parcel.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.contractId, t.parcelId] }),
  })
);

export const contractToParcelRelations = relations(
  contractToParcel,
  ({ one }) => ({
    contract: one(contract, {
      fields: [contractToParcel.contractId],
      references: [contract.id],
    }),
    parcel: one(parcel, {
      fields: [contractToParcel.parcelId],
      references: [parcel.id],
    }),
  })
);

export const uploadedFile = pgTable(
  'uploaded_file',

  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    s3Id: text('s3_id').notNull(),
    name: text('name').notNull(),
    contractId: uuid('contract_id')
      .notNull()
      .references(() => contract.id, { onDelete: 'cascade' }),
  }
);

export const uploadedFileRelations = relations(uploadedFile, ({ one }) => ({
  contract: one(contract, {
    fields: [uploadedFile.contractId],
    references: [contract.id],
  }),
}));
