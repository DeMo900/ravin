import { Hono } from "hono";
import { sign } from "hono/jwt";
import * as AuthServices from "../services/services.auth";

export const AuthRoutes = new Hono<{ Bindings: Env }>();

AuthRoutes.post("/auth/login", async (c) => {
  try {
    const body = await c.req.json();

    if (!body || !body.username || !body.password) {
      return c.json(
        {
          error: "Bad Request",
          message: "Username and password are required.",
        },
        400,
      );
    }

    const result = await AuthServices.login(
      body.username,
      body.password,
      c.env.ravin_db,
    );
    if(!result.success){
      return c.json(result, 400);
    }
    const expirationDate = 60*60*24*30
    const token = await sign(
      {
        id: result.user?.id,
        username: result.user?.username,
        exp:Math.floor(Date.now() / 1000 + expirationDate),
      },
      c.env.JWT_SECRET,
    );
    return c.json(token);
  } catch (error) {
    console.error("Login failed:", error);
    return c.json(
      {
        error: "Internal Server Error",
        message: "An error occurred during login.",
      },
      500,
    );
  }
})