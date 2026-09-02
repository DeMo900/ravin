import type { User } from "../types/db";

export const findByUsername = async (
  username: string,
  db: D1Database,
): Promise<User | null> => {
  return await db
    .prepare("SELECT * FROM users WHERE username = ?")
    .bind(username)
    .first<User>();
};

export const create = async (
  username: string,
  hashedPassword: string,
  db: D1Database,
) => {
  return await db
    .prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
    .bind(username, hashedPassword)
    .run();
};
