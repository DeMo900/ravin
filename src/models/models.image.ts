import { Image } from "../types/db";

export const insertImage = async (
  url: string,
  folder_id: number,
  db: D1Database,
) => {
  try {
    const result = await db
      .prepare("INSERT INTO images (url, folder_id) VALUES (?, ?)")
      .bind(url, folder_id)
      .run();
    return {
      success: true,
      data: {
        id: result.meta.last_row_id,
        url,
        folder_id,
      },
    };
  } catch (error: any) {
    if (error.message?.includes("FOREIGN KEY constraint failed")) {
      return { success: false, error: "Folder does not exist" };
    }
    return { success: false, error: "Failed to create image" };
  }
};

export const getImagesByFolderId = async (id: number, db: D1Database) => {
  const result = await db
    .prepare("SELECT * FROM images WHERE folder_id = ?")
    .bind(id)
    .all<Image>();
  return result.results;
};

export const getImageById = async (id: number, db: D1Database) => {
  const result = await db
    .prepare("SELECT * FROM images WHERE id = ?")
    .bind(id)
    .first<Image>();
  return result;
};

export const countImages = async (db: D1Database) => {
  const result = await db
    .prepare("SELECT COUNT(id) AS count FROM images")
    .first<{ count: number }>();
  return result;
};

export const countImagesByGenreId = async (
  id: number,
  db: D1Database,
) => {
  const result = await db
    .prepare(
      `SELECT COUNT(images.id) AS count 
       FROM images 
       INNER JOIN folders ON images.folder_id = folders.id
       WHERE folders.genre_id = ?`
    )
    .bind(id)
    .first<{ count: number }>();
  return result;
};

export const countImagesByFolderId = async (
  id: number,
  db: D1Database,
) => {
  const result = await db
    .prepare("SELECT COUNT(id) AS count FROM images WHERE folder_id = ?")
    .bind(id)
    .first<{ count: number }>();
  return result;
};
export const updateImageFolder = async (id: number, folder_id: number, db: D1Database) => {
  try {
    const { meta } = await db
      .prepare("UPDATE images SET folder_id = ? WHERE id = ?")
      .bind(folder_id, id)
      .run();

    if (meta.changes === 0) {
      return { success: false, error: "Image not found or folder unchanged" };
    }
    return { success: true, data: { changes: meta.changes } };
  } catch (err: any) {
    if (err.message?.includes("FOREIGN KEY constraint failed")) {
      return { success: false, error: "Folder does not exist" };
    }
    return { success: false, error: "Failed to update image folder" };
  }
};

export const deleteImage = async (
  id: number,
  db: D1Database,
) => {
  const { meta } = await db
    .prepare("DELETE FROM images WHERE id = ?")
    .bind(id)
    .run();
  return meta.changes;
};


