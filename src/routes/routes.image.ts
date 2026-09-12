import { Hono } from "hono";
import * as imageModel from "../models/models.image";
import * as imageService from "../services/services.image";
import { sendError, sendSuccess , NotFoundError } from "../utils/response";

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
  }).post("/cms/images/:folderId", async (c) => {
  const folderId = Number(c.req.param("folderId"));
  if (Number.isNaN(folderId)) {
    return sendError(c, "Invalid folder ID format.", 400, "BAD_REQUEST");
  }

  const body = await c.req.parseBody({ all: true });
  const rawFiles = body["images"];
  const files = Array.isArray(rawFiles) ? rawFiles : [rawFiles];

  if (files.length === 0 || !files.every((f) => f instanceof File)) {
    return sendError(c, "No valid image files provided.", 400, "BAD_REQUEST");
  }

  const uploadResults = await Promise.all(
    files.map((file) => imageService.upload(file, c.env.BUCKET_URL, c.env.ravin)),
  );

  const failed = uploadResults.find((r) => !r.success);
  if (failed) {
    return sendError(c, failed.error, 400, "UPLOAD_FAILED");
  }

  const successful = uploadResults.filter(
    (r): r is { success: true; url: string } => r.success,
  );
  const uploadedImages = successful.map((r) => ({ url: r.url }));

  const result = await imageModel.uploadImagesByFolderId(uploadedImages, folderId, c.env.ravin_db);
  if (!result.success) {
    return sendError(c, result.error || "Failed to record image entries in database.", 400, "DATABASE_ERROR");
  }

  return sendSuccess(c, result.data, 201, "Images uploaded successfully.");
})
  .post("/cms/image/folder", async (c) => {
    const { id, folder_id } = await c.req.json();
    if (!id || Number.isNaN(Number(id))) {
      return sendError(c, "Invalid image ID format.", 400, "BAD_REQUEST");
    }
    if (!folder_id || Number.isNaN(Number(folder_id))) {
      return sendError(c, "Invalid folder_id format.", 400, "BAD_REQUEST");
    }

    const result = await imageModel.updateImageFolder(Number(id), Number(folder_id), c.env.ravin_db);
    if (!result.success) throw new NotFoundError(result.error);

    return sendSuccess(
      c,
      { id, folder_id, updated: true },
      200,
      "Image folder updated successfully.",
    );
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

