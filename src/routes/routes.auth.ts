import { Hono } from "hono";
import { sign } from "hono/jwt";
import * as AuthServices from "../services/services.auth";
import { sendError, sendSuccess } from "../utils/response";

export const AuthRoutes = new Hono<{ Bindings: Env }>();

AuthRoutes.post("/auth/login", async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return sendError(c, "Invalid JSON body provided.", 400, "BAD_REQUEST");
  }

  if (!body || !body.username || !body.password) {
    return sendError(
      c,
      "Username and password are required.",
      400,
      "BAD_REQUEST",
    );
  }

  const result = await AuthServices.login(
    body.username,
    body.password,
    c.env.ravin_db,
  );

  if (!result.success) {
    return sendError(
      c,
      result.error || "Invalid username or password.",
      401,
      "INVALID_CREDENTIALS",
    );
  }

  const expirationDate = 60 * 60 * 24 * 30;
  const token = await sign(
    {
      id: result.user?.id,
      username: result.user?.username,
      exp: Math.floor(Date.now() / 1000 + expirationDate),
    },
    c.env.JWT_SECRET,
  );

  return sendSuccess(
    c,
    {
      token,
      user: result.user,
    },
    200,
    "Login successful.",
  );
});