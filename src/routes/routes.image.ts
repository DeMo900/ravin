import { Hono } from "hono";
import * as imageModel from "../models/models.image";
import * as imageService from "../services/services.image";
import { sendError, sendSuccess } from "../utils/response";

export const imageApp = new Hono<{ Bindings: Env }>();

imageApp
  .get("/image/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return sendError(c, "Invalid image ID format.", 400, "BAD_REQUEST");
    }

    const image = await imageModel.getImageById(id, c.env.ravin_db);
    if (!image) {
      return sendError(c, "Image not found.", 404, "NOT_FOUND");
    }

    return sendSuccess(c, image);
  })
  .get("/images/:folderId", async (c) => {
    const id = Number(c.req.param("folderId"));
    if (Number.isNaN(id)) {
      return sendError(c, "Invalid folder ID format.", 400, "BAD_REQUEST");
    }

    const images = await imageModel.getImagesByFolderId(id, c.env.ravin_db);
    return sendSuccess(c, images);
  })
  .get("/images/count", async (c) => {
    const count = await imageModel.countImages(c.env.ravin_db);
    return sendSuccess(c, count);
  })
  .get("/images/count/genre/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return sendError(c, "Invalid genre ID format.", 400, "BAD_REQUEST");
    }

    const count = await imageModel.countImagesByGenreId(id, c.env.ravin_db);
    return sendSuccess(c, count);
  })
  .get("/images/count/folder/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return sendError(c, "Invalid folder ID format.", 400, "BAD_REQUEST");
    }

    const count = await imageModel.countImagesByFolderId(id, c.env.ravin_db);
    return sendSuccess(c, count);
  })
  .post("/cms/image", async (c) => {
    const body = await c.req.parseBody();
    const file = body["image"];
    const folder_id = body["folder_id"];
    if (!file || !(file instanceof File)) {
      return sendError(c, "No valid image file provided.", 400, "BAD_REQUEST");
    }

    const parsedFolderId = Number(folder_id);
    if (!folder_id || Number.isNaN(parsedFolderId)) {
      return sendError(
        c,
        "A valid folder_id is required.",
        400,
        "BAD_REQUEST",
      );
    }

    const uploadResult = await imageService.upload(
      file,
      c.env.BUCKET_URL,
      c.env.ravin,
    );
    if (!uploadResult.success) {
      return sendError(c, uploadResult.error, 400, "UPLOAD_FAILED");
    }

    const result = await imageModel.insertImage(
      uploadResult.url,
      parsedFolderId,
      c.env.ravin_db,
    );
    if (!result.success) {
      return sendError(
        c,
        result.error || "Failed to record image entry in database.",
        400,
        "DATABASE_ERROR",
      );
    }

    return sendSuccess(c, result.data, 201, "Image uploaded successfully.");
  })
  .delete("/cms/image/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id)) {
      return sendError(c, "Invalid image ID format.", 400, "BAD_REQUEST");
    }

    const changes = await imageModel.deleteImage(id, c.env.ravin_db);
    if (!changes) {
      return sendError(c, "Image not found.", 404, "NOT_FOUND");
    }

    return sendSuccess(
      c,
      { id, deleted: true },
      200,
      "Image deleted successfully.",
    );
  });

