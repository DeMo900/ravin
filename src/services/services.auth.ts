import { comparePassword, hashPassword } from "../utils/password";
import * as UserModel from "../models/models.auth";
import type { User } from "../types/db";

export const login = async (
  username: string,
  password: string,
  db: D1Database,
): Promise<User | null> => {
  const user = await UserModel.findByUsername(username, db);
  if (!user) return null;

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) return null;

  return user;
};

export const signUp = async (
  username: string,
  password: string,
  db: D1Database,
) => {
  const isUserExists = await UserModel.findByUsername(username, db);
  if (isUserExists) return null;
  const hashedPassword = await hashPassword(password);
  const result = await UserModel.create(username, hashedPassword, db);
  if (!result) return null;
  return {
    id: result.meta.last_row_id,
    username,
  };
};
