import { Hono } from "hono";
import * as AuthServices from "../services/services.aith"
const authApp = new Hono<{ Bindings: Env }>();

authApp.post("/cms/auth/login", async (c) => {
    const body = await c.req.json();
    const result = await AuthServices.login(body.username, body.password, c.env.ravin_db);
    return c.json(result);
  }).post("/cms/auth/sign-up", async (c) => {
    const body = await c.req.json();
    const result = await AuthServices.signUp(body.username, body.password, c.env.ravin_db);
    return c.json(result);
  })

export default authApp;
