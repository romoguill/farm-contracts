import {
  BuildQueryResult,
  ExtractTablesWithRelations,
  relations,
  sql,
} from 'drizzle-orm';
import { BuildAliasTable } from 'drizzle-orm/mysql-core';
import {
  bigint,
  boolean,
  char,
  decimal,
  doublePrecision,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// --------- USER REALTED ---------
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
  tenants: many(tenant),
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

// --------- CONTRACTS AND PARCELS ---------
export const contract = pgTable('contract', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenant.id, { onDelete: 'restrict' }),
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
  tenant: one(tenant, {
    fields: [contract.tenantId],
    references: [tenant.id],
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
    label: char('label', { length: 2 }).unique().notNull(),
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

// --------- TENANTS ---------
export const tenant = pgTable('tenant', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 40 }).notNull(),
  cuit: bigint('cuit', { mode: 'bigint' }).notNull(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
});

export const tenantRelations = relations(tenant, ({ many, one }) => ({
  owner: one(user, {
    fields: [tenant.userId],
    references: [user.id],
  }),
  contracts: many(contract),
}));

// --------- PDF UPLOAD ---------
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

export type UploadedFile = typeof uploadedFile.$inferSelect;

// --------- MARKET DATA ---------
export const crop = pgEnum('crop', ['CORN', 'SOY', 'WHEAT']);

export const marketData = pgTable(
  'market_data',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    crop: crop('crop').notNull(),
    date: timestamp('date').defaultNow().unique().notNull(),
    price: doublePrecision('price').notNull(),
  },
  (table) => ({
    dateIdx: index('date_idx').on(table.date),
  })
);
