import { Hono } from "hono";
import * as GenreModel from "../models/models.genre";

const genreApp = new Hono<{ Bindings: Env }>();

genreApp
  .get("/genres", async (c) => {
    const result = await GenreModel.getGenres(c.env.ravin_db);
    return c.json(result);
  }) .get("/genres/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const result = await GenreModel.getGenreWithFolders(id, c.env.ravin_db);
    return c.json(result);
  }).get("/genres/count",async(c)=>{
    const result = await GenreModel.genresCount(c.env.ravin_db);
    return c.json(result);
  })
  .post("/cms/genres", async (c) => {
    const body = await c.req.json();
    const result = await GenreModel.createGenre(body, c.env.ravin_db);
    return c.json(result);
  }).delete("/cms/genres/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const result = await GenreModel.deleteGenre(id, c.env.ravin_db);
    return c.json(result);
  });
  export default genreApp;
