/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
// import 'server-only';

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text, numeric, timestamp, varchar } from "drizzle-orm/pg-core";
import { eq, ilike } from "drizzle-orm";

import { create } from "domain";

export const db = drizzle(
  neon(process.env.POSTGRES_URL!, {
    fetchOptions: {
      cache: "no-store",
    },
  })
);

// Users table
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }),
  username: varchar("username", { length: 50 }),
  email: varchar("email", { length: 50 }),
});

export type SelectUser = typeof users.$inferSelect;

export async function getUsers(
  search: string,
  offset: number
): Promise<{
  users: SelectUser[];
  newOffset: number | null;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      users: await db
        .select()
        .from(users)
        .where(ilike(users.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
    };
  }

  if (offset === null) {
    return { users: [], newOffset: null };
  }

  const moreUsers = await db.select().from(users).limit(20).offset(offset);
  const newOffset = moreUsers.length >= 20 ? offset + 20 : null;

  return { users: moreUsers, newOffset };
}

export async function deleteUserById(id: number) {
  await db.delete(users).where(eq(users.id, id));
}

// Menus table
const menus = pgTable("menus", {
  id: serial("id"),
  name: text("name").notNull(),
  price: numeric("price", { precision: 5, scale: 2 }).notNull(),
  organization: text("organization").notNull(),
  img: text("img"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SelectMenu = typeof menus.$inferSelect;

export async function getMenus() {
  const menuData = await db.select().from(menus);
  console.log("DB API Response", menuData);

  return menuData;
}
