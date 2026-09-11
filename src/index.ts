import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { GenreRoutes } from "./routes/routes.genre";
import { AuthRoutes } from "./routes/routes.auth";
import { FolderRoutes } from "./routes/routes.folder";
import { imageApp as ImageRoutes } from "./routes/routes.image";
import { AppError, sendError } from "./utils/response";

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

app.onError((err, c) => {
  if (err instanceof AppError) {
    return sendError(c, err.message, err.statusCode, err.errorCode, err.details);
  }

  if (err instanceof HTTPException) {
    const errorCode =
      err.status === 401
        ? "UNAUTHORIZED"
        : err.status === 403
          ? "FORBIDDEN"
          : "HTTP_EXCEPTION";
    return sendError(c, err.message, err.status, errorCode);
  }

  console.error("Unhandled application error:", err);
  const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
  return sendError(c, errorMessage, 500, "INTERNAL_SERVER_ERROR");
});

app.notFound((c) => {
  return sendError(
    c,
    `Route not found: ${c.req.method} ${c.req.path}`,
    404,
    "NOT_FOUND",
  );
});

export default app;

