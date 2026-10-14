import { defineMiddleware } from "astro:middleware";
import { auth } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  context.locals.user = null;

  if (pathname.startsWith("/api/auth/")) return next();

  const session = await auth.api.getSession({ headers: context.request.headers });
  context.locals.user = session?.user ?? null;

  if (context.locals.user || pathname === "/login" || pathname === "/login/") {
    return next();
  }

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return new Response("Non authentifié", { status: 401 });
  }

  return context.redirect("/login");
});
