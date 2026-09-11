import { Hono } from "hono";
import * as FolderModel from "../models/models.folder";
import { sendError, sendSuccess } from "../utils/response";

export const FolderRoutes = new Hono<{ Bindings: Env }>();

FolderRoutes.get("/folders", async (c) => {
  const result = await FolderModel.getFolders(c.env.ravin_db);
  return sendSuccess(c, result);
})
  .get("/folder/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return sendError(c, "Invalid folder ID format.", 400, "BAD_REQUEST");
    }

    const result = await FolderModel.getFolderById(id, c.env.ravin_db);
    if (!result) {
      return sendError(c, "Folder not found.", 404, "NOT_FOUND");
    }

    return sendSuccess(c, result);
  })
  .get("/folders/count", async (c) => {
    const result = await FolderModel.foldersCount(c.env.ravin_db);
    return sendSuccess(c, result);
  })
  .post("/cms/folder", async (c) => {
    let body: any;
    try {
      body = await c.req.json();
    } catch {
      return sendError(c, "Invalid JSON body provided.", 400, "BAD_REQUEST");
    }

    if (!body || !body.name || !body.genre_id) {
      return sendError(
        c,
        "Folder name and genre_id are required.",
        400,
        "BAD_REQUEST",
      );
    }

    const result = await FolderModel.createFolder(body, c.env.ravin_db);
    if (!result.success) {
      return sendError(
        c,
        result.error || "Failed to create folder.",
        400,
        "BAD_REQUEST",
      );
    }

    return sendSuccess(c, result.data, 201, "Folder created successfully.");
  })
  .delete("/cms/folder/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return sendError(c, "Invalid folder ID format.", 400, "BAD_REQUEST");
    }

    const changes = await FolderModel.deleteFolder(id, c.env.ravin_db);
    if (!changes) {
      return sendError(c, "Folder not found.", 404, "NOT_FOUND");
    }

    return sendSuccess(
      c,
      { id, deleted: true },
      200,
      "Folder deleted successfully.",
    );
  });

