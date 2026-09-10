import { Hono } from "hono";
import * as GenreModel from "../models/models.genre";

export const GenreRoutes = new Hono<{ Bindings: Env }>();

GenreRoutes.get("/genres", async (c) => {
  try {
    const result = await GenreModel.getGenres(c.env.ravin_db);
    return c.json(result);
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    return c.json(
      { error: "Internal Server Error", message: "Could not retrieve genres." },
      500,
    );
  }
})
  .get("/genre/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));

      if (isNaN(id)) {
        return c.json(
          { error: "Bad Request", message: "Invalid genre ID format." },
          400,
        );
      }

      const result = await GenreModel.getGenreWithFolders(id, c.env.ravin_db);
      return c.json(result);
    } catch (error) {
      console.error(
        `Failed to fetch genre with ID ${c.req.param("id")}:`,
        error,
      );
      return c.json(
        {
          error: "Internal Server Error",
          message: "Could not retrieve genre details.",
        },
        500,
      );
    }
  })
  .get("/genres/count", async (c) => {
    try {
      const result = await GenreModel.genresCount(c.env.ravin_db);
      return c.json(result);
    } catch (error) {
      console.error("Failed to count genres:", error);
      return c.json(
        {
          error: "Internal Server Error",
          message: "Could not retrieve genre count.",
        },
        500,
      );
    }
  })
  .post("/cms/genre", async (c) => {
    try {
      const body = await c.req.json();

      if (!body || !body.name) {
        return c.json(
          { error: "Bad Request", message: "Genre name is required." },
          400,
        );
      }

      const result = await GenreModel.createGenre(body, c.env.ravin_db);
      return c.json(result, 201);
    } catch (error) {
      console.error("Failed to create genre:", error);
      return c.json(
        { error: "Internal Server Error", message: "Could not create genre." },
        500,
      );
    }
  })
  .delete("/cms/genre/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));

      if (isNaN(id)) {
        return c.json(
          { error: "Bad Request", message: "Invalid genre ID format." },
          400,
        );
      }

      const result = await GenreModel.deleteGenre(id, c.env.ravin_db);
      return c.json(result);
    } catch (error) {
      console.error(
        `Failed to delete genre with ID ${c.req.param("id")}:`,
        error,
      );
      return c.json(
        { error: "Internal Server Error", message: "Could not delete genre." },
        500,
      );
    }
  });
