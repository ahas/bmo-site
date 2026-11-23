import { existsSync, statSync } from "node:fs";
import { join, normalize } from "node:path";

// Serves the built site from dist/ the way a static host does: a folder's index.html for a folder's address,
// and the built 404 page for anything else.

export const DIST = new URL("../dist/", import.meta.url).pathname;

export function serveDist(): { origin: string; stop: () => void } {
  const server = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch(request) {
      const path = decodeURIComponent(new URL(request.url).pathname);
      const file = normalize(join(DIST, path));

      if (!file.startsWith(DIST)) return new Response("", { status: 403 });

      const candidate = existsSync(file) && statSync(file).isDirectory() ? join(file, "index.html") : file;

      if (existsSync(candidate)) return new Response(Bun.file(candidate));

      return new Response(Bun.file(join(DIST, "404.html")), { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
    },
  });

  return { origin: `http://127.0.0.1:${server.port}`, stop: () => server.stop(true) };
}
