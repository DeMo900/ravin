-- Migration number: 0002 	 2026-09-02T07:46:07.038Z
CREATE INDEX IF NOT EXISTS idx_folders_genre_id ON folders(genre_id);
CREATE INDEX IF NOT EXISTS idx_images_folder_id ON images(folder_id);