import { Hono } from "hono";
import * as imageModel from "../models/models.image";
import * as imageService from "../services/services.image";
export const imageApp = new Hono<{ Bindings: Env }>();

imageApp
  .get("/image/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));

      if (Number.isNaN(id)) {
        return c.json({ error: "Invalid id" }, 400);
      }

      const image = await imageModel.getImageById(id, c.env.ravin_db);

      if (!image) {
        return c.json({ error: "Image not found" }, 404);
      }

      return c.json({ image });
    } catch (err) {
      return c.json({ error: "Failed to fetch image" }, 500);
    }
  })
  .get("/images/:folderId", async (c) => {
    try {
      const id = Number(c.req.param("folderId"));

      if (Number.isNaN(id)) {
        return c.json({ error: "Invalid id" }, 400);
      }

      const image = await imageModel.getImagesByFolderId(id, c.env.ravin_db);

      if (!image) {
        return c.json({ error: "Images not found" }, 404);
      }

      return c.json({ image });
    } catch (err) {
      return c.json({ error: "Failed to fetch images" }, 500);
    }
  })
  .get("/images/count", async (c) => {
    try {
      const count = await imageModel.countImages(c.env.ravin_db);
      if (!count) {
        return c.json({ error: "Images count not found" }, 404);
      }

      return c.json({ count });
    } catch (err) {
      return c.json({ error: "Failed to fetch images count " }, 500);
    }
  })
  .get("/images/count/:folderOrGenreId", async (c) => {
    try {
      const id = Number(c.req.param("folderOrGenreId"));

      if (Number.isNaN(id)) {
        return c.json({ error: "Invalid id" }, 400);
      }

      const count = await imageModel.countImagesInFolderOrGenre(id, c.env.ravin_db);

      return c.json({ count });
    } catch (err) {
      return c.json({ error: "Failed to fetch images count in folder" }, 500);
    }
  })
  .post("/cms/image", async (c) => {
    try {
      const body = await c.req.parseBody();
      const file = body["image"];
      const folder_id = body["folder_id"];
      if (!file || !(file instanceof File)) {
        return c.json({ error: "No valid image file provided" }, 400);
      }

      const parsedFolderId = Number(folder_id);
      if (!folder_id || Number.isNaN(parsedFolderId)) {
        return c.json({ error: "A valid folder_id is required" }, 400);
      }

      const { url } = await imageService.upload(
        file,
        c.env.BUCKET_URL,
        c.env.ravin,
      );
      if (!url) {
        return c.json(
          { error: "Storage driver failed to return asset URL" },
          500,
        );
      }

      const result = await imageModel.insertImage(
        url,
        parsedFolderId,
        c.env.ravin_db,
      );
      if (!result) {
        return c.json(
          { error: "Database execution failed to record entry" },
          500,
        );
      }

      return c.json({ success: true, result });
    } catch (err: any) {
      return c.json(
        { error: "Internal server processing error", details: err.message },
        500,
      );
    }
  });
