import "dotenv/config";

import express from "express";
import routes from "./routes";
import path from "path";

import "./database";

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();

    return this;
  }

  middlewares() {
    this.server.set("PORT", process.env.PORT);
    this.server.use(
      "/public",
      express.static(path.resolve(__dirname, "public"))
    );
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
