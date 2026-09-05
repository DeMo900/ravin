import { Image } from "../types/db";
export const insertImage = async (url:string,folder_id:number, db: D1Database) => {
  const result = await db.prepare
    ("INSERT INTO images (url,folder_id) VALUES (?,?)")
    .bind(url, folder_id)
    .run();
  return result;
};
export const getImagesByFolderId = async (id: number, db: D1Database) => {
  const result = await db.prepare
    ("SELECT * FROM images WHERE folder_id = ?")
    .bind(id)
    .all<Image>();
  return result;
};

export const getImageById = async (id: number, db: D1Database) => {
  const result = await db.prepare
    ("SELECT * FROM images WHERE id = ?")
    .bind(id)
    .first<Image>();
  return result;
};

export const countImages = async (db: D1Database) => {
  const result = await db.prepare
    ("SELECT COUNT(id) AS count FROM images")
    .first<{ count: number }>();
  return result;
};

export const countImagesInFolder = async (id: number, db: D1Database) => {
  const result = await db.prepare
    ("SELECT COUNT(id) AS count FROM images WHERE folder_id = ?")
    .bind(id)
    .first<{ count: number }>();
  return result;
};

export const countImagesInGenre = async (id: number, db: D1Database) => {
  const result = await db.prepare
    ("SELECT COUNT(*) AS image_count FROM images JOIN folders ON images.folder_id = folders.id WHERE folders.genre_id = ?;")
    .bind(id)
    .first<{ image_count: number }>();
  return result;
};