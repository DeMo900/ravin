import { Folder } from "../types/db";

export const createFolder = async (folder: Folder, db: D1Database) => {
  const { name, genre_id } = folder;
  try {
    const result = await db
      .prepare("INSERT INTO folders (name, genre_id) VALUES (?, ?)")
      .bind(name, genre_id)
      .run();
    return { success: true, data: result };
  } catch (err: any) {
    if (err.message?.includes("FOREIGN KEY constraint failed")) {
      return { success: false, error: "Genre does not exist" };
    }
    return { success: false, error: "Failed to create folder" };
  }
};
export const getFolders = async (db: D1Database) => {
  const result = await db.prepare("SELECT * FROM folders").all();
  return result.results;
};
export const getFolderById = async (id: number, db: D1Database) => {
  const result = await db
    .prepare("SELECT * FROM folders WHERE id = ?")
    .bind(id)
    .first();
  return result;
};
export const deleteFolder = async (id: number, db: D1Database) => {
  const { meta } = await db
    .prepare("DELETE FROM folders WHERE id = ?")
    .bind(id)
    .run();
  return meta.changes;
};
export const foldersCount = async (db: D1Database) => {
  const result = await db
    .prepare("SELECT COUNT(*) as count FROM folders")
    .first();
  return result;
};
