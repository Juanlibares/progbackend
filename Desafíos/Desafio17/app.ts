import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Handlebars } from "https://deno.land/x/handlebars/mod.ts";

const app = new Application();
const router = new Router();
const handlebars = new Handlebars();
const PORT = 8080;

const colors: string[] = [];

router.get("/", async (ctx) => {
  const template = await handlebars.renderView("index");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.body = template;
});

router.post("/colors", async (ctx) => {
  const body = await ctx.request.body().value;
  if(body.color) colors.push(body.color)
  ctx.response.status = 200;
  ctx.response.headers.set("Content-Type", "application/json");
  ctx.response.body = colors;
  ctx.response.status = 200;
});

router.get("/colors",  (ctx) => {
  ctx.response.status = 200;
  ctx.response.headers.set("Content-Type", "application/json");
  ctx.response.body = colors;
  ctx.response.status = 200;
});

app.use(router.allowedMethods());
app.use(router.routes());
console.log("http://localhost:" + PORT);

await app.listen({ port: PORT, hostname: "127.0.0.1" });
