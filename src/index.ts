import { Hono } from "hono";
import { jwt } from "hono/jwt";
import GenreRoutes from "./routes/routes.genre";
import AuthRoutes from "./routes/routes.auth";
const app = new Hono<{ Bindings: Env }>();
app.use("/cms/*", async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: 'HS256',
  })
  return jwtMiddleware(c, next)
})
app.route("/", GenreRoutes);
app.route("/", AuthRoutes);

export default app;
