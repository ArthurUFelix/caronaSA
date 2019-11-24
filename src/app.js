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
    if (process.env.NODE_ENV === "production") {
      this.server.use((req, res, next) => {
        if (req.header("x-forwarded-proto") !== "https") {
          res.redirect(`https://${req.header("host")}${req.url}`);
        } else {
          next();
        }
      });
    }

    this.server.set("PORT", process.env.PORT);
    this.server.use(
      "/",
      express.static(path.resolve(__dirname, "public", "pages"))
    );
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
