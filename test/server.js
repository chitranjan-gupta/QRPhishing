import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join } from "path";

const host = "localhost";
const port = 8000;
const requestListener = async function (req, res) {
  if (req.method === "GET" || req.method === "POST") {
    if (req.url === "/" || req.url === "/index.html") {
      const data = readFileSync(join("index.html"));
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(data);
    } else if (req.url === "/test" || req.url === "/test.html") {
      const data = readFileSync(join("index.html"));
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(data);
    } else if (req.url === "/index.js") {
      const data = readFileSync(join("index.js"));
      res.setHeader("Content-Type", "text/js");
      res.writeHead(200);
      res.end(data);
    } else if (req.url === "/qrcode_localhost.png") {
      const data = readFileSync(join("../template/static/qrcode_localhost.png"));
      res.setHeader("Content-Type", "image/png");
      res.writeHead(200);
      res.end(data);
    } else {
      res.writeHead(404);
      res.end();
    }
  } else {
    res.writeHead(405);
    res.end("Method Not Supported");
  }
};
const server = createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
