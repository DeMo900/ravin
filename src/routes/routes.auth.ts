import { Hono } from "hono";
import { verify } from "hono/jwt";
import * as AuthServices from "../services/services.auth";

const authApp = new Hono<{ Bindings: Env }>();

authApp
  .post("/auth/login", async (c) => {
    try {
      const body = await c.req.json();

      if (!body || !body.username || !body.password) {
        return c.json({ error: "Bad Request", message: "Username and password are required." }, 400);
      }

      const result = await AuthServices.login(body.username, body.password, c.env.ravin_db);
      return c.json(result);
    } catch (error) {
      console.error("Login failed:", error);
      return c.json({ error: "Internal Server Error", message: "An error occurred during login." }, 500);
    }
  })
  .post("/auth/sign-up", async (c) => {
    const body = await c.req.json();
    const result = await AuthServices.signUp(body.username, body.password, c.env.ravin_db);
    return c.json(result);
  });

export default authApp;
