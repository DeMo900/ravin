import { Image } from "../types/db";
export const insertImage = async(image:Image,db:D1Database)=>{
const result = db.prepare
("INSERT INTO images (url,folder_id) VALUES (?,?)")
.bind(image.url,image.folder_id)
.run()
return result
}
export const getImagesByFolderId = async(id:Number,db:D1Database)=>{
const result = db.prepare
("SELECT FROM images WHERE folder_id = ?")
.bind(id)
.run()
return result
}
export const getImageById = async(id:Number,db:D1Database)=>{
const result = db.prepare
("SELECT FROM images WHERE id = ?")
.bind(id)
.run()
return result
}