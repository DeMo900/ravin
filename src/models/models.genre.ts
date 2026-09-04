import { Folder, Genre } from "../types/db";

export const createGenre = async (genre: Genre, db: D1Database) => {
  const { name } = genre;
  const result = await db
    .prepare("INSERT INTO genres (name) VALUES (?)")
    .bind(name)
    .run();
  return result;
};
export const getGenres = async (db: D1Database) => {
  const result = await db.prepare("SELECT * FROM genres").all();
  return result.results;
};
export const getGenreWithFolders = async (id: number, db: D1Database) => {
  const genre = await db
    .prepare("SELECT * FROM genres WHERE id = ?")
    .bind(id)
    .first<Genre>();
  if (!genre) return null;

  const { results: folders } = await db
    .prepare("SELECT * FROM folders WHERE genre_id = ?")
    .bind(id)
    .all<Folder>();

  return { ...genre, folders };
};
export const deleteGenre = async (id: number, db: D1Database) => {
  const { meta } = await db
    .prepare("DELETE FROM genres WHERE id = ?")
    .bind(id)
    .run();
  return meta.changes;
};
export const genresCount = async (db: D1Database) => {
  const result = await db
    .prepare("SELECT COUNT(*) as count FROM genres")
    .first();
  return result;
};
