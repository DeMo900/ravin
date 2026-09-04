import { Hono } from "hono";
import * as FolderModel from "../models/models.folder";

const folderApp = new Hono<{ Bindings: Env }>();

folderApp
  .get("/folders", async (c) => {
    const result = await FolderModel.getFolders(c.env.ravin_db);
    return c.json(result);
  }).get("/folders/count",async(c)=>{
    const result = await FolderModel.foldersCount(c.env.ravin_db);
    return c.json(result);
  })
  .post("/cms/folders", async (c) => {
    const body = await c.req.json();
    const result = await FolderModel.createFolder(body, c.env.ravin_db);
    return c.json(result);
  })
  .delete("/cms/folders/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const result = await FolderModel.deleteFolder(id, c.env.ravin_db);
    return c.json(result);
  });

  export default folderApp;

