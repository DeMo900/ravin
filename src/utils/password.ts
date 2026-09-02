import { compare, hash } from "bcryptjs";

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10);
}
