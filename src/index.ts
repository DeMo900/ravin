import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { GenreRoutes } from "./routes/routes.genre";
import { AuthRoutes } from "./routes/routes.auth";
import { FolderRoutes } from "./routes/routes.folder";
import { imageApp as ImageRoutes } from "./routes/routes.image";
const app = new Hono<{ Bindings: Env }>();
app.use("/cms/*", async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: "HS256",
  });
  return jwtMiddleware(c, next);
});
app.route("/", GenreRoutes);
app.route("/", AuthRoutes);
app.route("/", FolderRoutes);
app.route("/", ImageRoutes);
export default app;
