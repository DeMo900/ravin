import { Hono } from "hono";
import * as GenreModel from "../models/models.genre";
import { sendError, sendSuccess } from "../utils/response";

export const GenreRoutes = new Hono<{ Bindings: Env }>();

GenreRoutes.get("/genres", async (c) => {
  const result = await GenreModel.getGenres(c.env.ravin_db);
  return sendSuccess(c, result);
})
  .get("/genre/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return sendError(c, "Invalid genre ID format.", 400, "BAD_REQUEST");
    }

    const result = await GenreModel.getGenreWithFolders(id, c.env.ravin_db);
    if (!result) {
      return sendError(c, "Genre not found.", 404, "NOT_FOUND");
    }

    return sendSuccess(c, result);
  })
  .get("/genres/count", async (c) => {
    const result = await GenreModel.genresCount(c.env.ravin_db);
    return sendSuccess(c, result);
  })
  .post("/cms/genre", async (c) => {
    let body: any;
    try {
      body = await c.req.json();
    } catch {
      return sendError(c, "Invalid JSON body provided.", 400, "BAD_REQUEST");
    }

    if (!body || !body.name) {
      return sendError(c, "Genre name is required.", 400, "BAD_REQUEST");
    }

    const result = await GenreModel.createGenre(body, c.env.ravin_db);
    return sendSuccess(
      c,
      { id: result.meta.last_row_id, name: body.name },
      201,
      "Genre created successfully.",
    );
  })
  .delete("/cms/genre/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return sendError(c, "Invalid genre ID format.", 400, "BAD_REQUEST");
    }

    const changes = await GenreModel.deleteGenre(id, c.env.ravin_db);
    if (!changes) {
      return sendError(c, "Genre not found.", 404, "NOT_FOUND");
    }

    return sendSuccess(
      c,
      { id, deleted: true },
      200,
      "Genre deleted successfully.",
    );
  });

