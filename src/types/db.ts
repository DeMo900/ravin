export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface Genre {
  id: number;
  name: string;
  created_at: string;
}

export interface Folder {
  id: number;
  name: string;
  genre_id: number;
  created_at: string;
}

export interface Image {
  id: number;
  url: string;
  folder_id: number;
  created_at: string;
}
