import { Hono } from "hono";
import * as FolderModel from "../models/models.folder";

const folderApp = new Hono<{ Bindings: Env }>();

folderApp
  .get("/folders", async (c) => {
    try {
      const result = await FolderModel.getFolders(c.env.ravin_db); 
      return c.json(result); 
    } catch (error) {
      console.error("Failed to fetch folders:", error);
      return c.json({ error: "Internal Server Error", message: "Could not retrieve folders." }, 500);
    }
  })
  .get("/folders/count", async (c) => {
    try {
      const result = await FolderModel.foldersCount(c.env.ravin_db);
      return c.json(result); 
    } catch (error) {
      console.error("Failed to count folders:", error);
      return c.json({ error: "Internal Server Error", message: "Could not retrieve folder count." }, 500);
    }
  })
  .post("/cms/folders", async (c) => {
    try {
      const body = await c.req.json();
      if (!body || !body.name) {
        return c.json({ error: "Bad Request", message: "Folder name is required." }, 400);
      }

      const result = await FolderModel.createFolder(body, c.env.ravin_db);
      return c.json(result, 201); 
    } catch (error) {
      console.error("Failed to create folder:", error);
      return c.json({ error: "Internal Server Error", message: "Could not create folder." }, 500);
    }
  })
  .delete("/cms/folders/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ error: "Bad Request", message: "Invalid folder ID format." }, 400);
      }

      const result = await FolderModel.deleteFolder(id, c.env.ravin_db);
      return c.json(result); 
    } catch (error) {
      console.error(`Failed to delete folder with ID ${c.req.param("id")}:`, error);
      return c.json({ error: "Internal Server Error", message: "Could not delete folder." }, 500);
    }
  });

export default folderApp;
