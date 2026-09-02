import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.use("/cms/*");

export default app;
