import express, { NextFunction, Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/Logging";
import authorRoutes from "./routes/author.router";
import bookRoutes from "./routes/book.router";

const app = express();

/** Connect to MongoDB **/
mongoose
  .connect(config.mongo.url)
  .then(() => {
    Logging.info("Database Connected ....");
    StartServer();
  })
  .catch((error) => {
    Logging.error("Unable to connect to DB ....");
    Logging.error(error);
  });

const StartServer = () => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the Request */
    Logging.info(
      `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      /** Log the Response */
      Logging.info(
        `Result -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  /** Rules of our API */
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }

    next();
  });

  /** Routes */
  app.use("/authors", authorRoutes);
  app.use("/books", bookRoutes);

  /** HealthCheck */
  app.get("/ping", (req: Request, res: Response, next: NextFunction) =>
    res.status(200).json({ message: "pong" })
  );

  /** Error Handling */
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("not found");
    Logging.error(error);

    return res.status(404).json({ message: error.message });
  });

  http
    .createServer(app)
    .listen(config.server.port, () =>
      Logging.info(`Server is running on port: ${config.server.port}.`)
    );
};
