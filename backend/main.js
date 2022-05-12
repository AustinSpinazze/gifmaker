import express from "express";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/");
  response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 3000);