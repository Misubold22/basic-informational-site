import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const pages = {
  "/": {
    file: "home.html",
    contentType: "text/html; charset=utf-8",
  },
  "/about": {
    file: "about.html",
    contentType: "text/html; charset=utf-8",
  },
  "/contact": {
    file: "contact.html",
    contentType: "text/html; charset=utf-8",
  },
  "/styles.css": {
    file: "styles.css",
    contentType: "text/css",
  },
};

const server = http.createServer(async (req, res) => {
  if (req.method !== "GET") {
    res.writeHead(405, {
      Allow: "GET",
      "content-type": "text/plain",
    });
    res.end("Method not allowed");
    return;
  }

  const { pathname } = new URL(req.url, "http://localhost");
  const page = pages[pathname];
  if (!page) {
    try {
      const fileContents = await fs.readFile(
        path.join(import.meta.dirname, "404.html"),
      );

      res.writeHead(404, {
        "content-type": "text/html; charset=utf-8",
      });

      res.end(fileContents);
    } catch (err) {
      console.error(err);
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("404 - Page not found");
    }

    return;
  }
  try {
    const fileContents = await fs.readFile(
      path.join(import.meta.dirname, page.file),
    );

    res.writeHead(200, {
      "content-type": page.contentType,
    });

    res.end(fileContents);
  } catch (err) {
    console.error(err);

    res.writeHead(500, { "content-type": "text/plain" });
    res.end("Server error");
  }
});

server.listen(process.env.PORT || 3000);
