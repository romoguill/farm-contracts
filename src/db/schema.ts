import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  username: text('username'),
  email: text('email').notNull(),
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
