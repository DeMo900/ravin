import { type Context, Hono } from "hono";
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

const handleSignup = async (c: Context<{ Bindings: Env }>) => {
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

  const user = await AuthServices.signUp(
    body.username,
    body.password,
    c.env.ravin_db,
  );

  if (!user) {
    return sendError(
      c,
      "Username already exists or failed to create user.",
      400,
      "USER_CREATION_FAILED",
    );
  }

  const expirationDate = 60 * 60 * 24 * 30;
  const token = await sign(
    {
      id: user.id,
      username: user.username,
      exp: Math.floor(Date.now() / 1000 + expirationDate),
    },
    c.env.JWT_SECRET,
  );

  return sendSuccess(
    c,
    {
      token,
      user,
    },
    201,
    "Admin user created successfully.",
  );
};

AuthRoutes.post("/auth/signup", handleSignup);
AuthRoutes.post("/signup", handleSignup);


