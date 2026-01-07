import http from "node:http";
import { existsSync, createReadStream, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..", "codepen");
const port = Number(process.env.PORT || 8000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const safeJoin = (base, target) => {
  const targetPath = path.normalize(path.join(base, target));
  if (!targetPath.startsWith(base)) {
    return null;
  }
  return targetPath;
};

const serveFile = (res, filePath) => {
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  createReadStream(filePath).pipe(res);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);
  const filePath = safeJoin(rootDir, pathname.replace(/^\/+/, ""));

  if (!filePath) {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    if (!pathname.endsWith("/")) {
      res.writeHead(302, { Location: `${pathname}/` });
      res.end();
      return;
    }
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    serveFile(res, filePath);
    return;
  }

  const indexPath = path.join(filePath, "index.html");
  if (existsSync(indexPath)) {
    serveFile(res, indexPath);
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(port, () => {
  console.log(`CodePen server running at http://localhost:${port}`);
  console.log(`Serving ${rootDir}`);
});
