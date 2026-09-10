import { comparePassword, hashPassword } from "../utils/password";
import * as UserModel from "../models/models.auth";
import type { User } from "../types/db";

export const login = async (
  username: string,
  password: string,
  db: D1Database,
): Promise<{success: boolean, user: User | null, error?: string}> => {
  const user = await UserModel.findByUsername(username, db);
  if (!user) return {success: false, user: null, error: "User not found"};

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) return {success: false, user: null, error: "Invalid password"};

  return {success: true, user};
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
