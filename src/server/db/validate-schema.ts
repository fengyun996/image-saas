import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { users } from './schema';

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email(),
  name: (schema) => schema.min(2),
}); // 插入时存在createAt可以不传

export const updateUserSchema = insertUserSchema.pick({
  email: true,
});

export const queryUserSchema = createSelectSchema(users, {
  email: (schema) => schema.email(),
  name: (schema) => schema.min(2),
}); // 请求时要传递createAt
