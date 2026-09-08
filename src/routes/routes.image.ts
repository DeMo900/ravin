import { Hono } from "hono";
import * as imageModel from "../models/models.image"
export const imageApp = new Hono<{ Bindings: Env }>();

imageApp.get("/image/:id", async (c) => {
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
}).get("/images/:folderId", async (c) => {
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
}).get("/images/count",async(c)=>{
     try {
    const count = await imageModel.countImages(c.env.ravin_db);
    if (!count) {
      return c.json({ error: "Images count not found" }, 404);
    }

    return c.json({ count });
  } catch (err) {
    return c.json({ error: "Failed to fetch images count " }, 500);
  }
}).get("/images/count/:genreId",async(c)=>{
     try {
    const id = Number(c.req.param("genreId"));

    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid id" }, 400);
    }

    const count = await imageModel.countImagesInGenre(id, c.env.ravin_db);
    if (!count) {
      return c.json({ error: "Images count not found in a genre" }, 404);
    }

    return c.json({ count });
  } catch (err) {
    return c.json({ error: "Failed to fetch images count in genre" }, 500);
  }
}).get("/images/count/:folderId",async(c)=>{
     try {
    const id = Number(c.req.param("folderId"));

    if (Number.isNaN(id)) {
      return c.json({ error: "Invalid id" }, 400);
    }

    const count = await imageModel.countImagesInFolder(id, c.env.ravin_db);
    if (!count) {
      return c.json({ error: "Images count not found in folder" }, 404);
    }

    return c.json({ count });
  } catch (err) {
    return c.json({ error: "Failed to fetch images count in folder" }, 500);
  }
})