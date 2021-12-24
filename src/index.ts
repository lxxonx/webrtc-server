import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import http from "http";
import logger from "morgan";
import { Server } from "socket.io";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import socketHandler from "./socketHandler";
import swagger from "./swagger";

// init dotenv
dotenv.config();

const startServer = async () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
    },
  });
  const nsp = io.of("/api/sessions/connect");
  const specs = swaggerJSDoc(swagger.options);

  nsp.on("connection", socketHandler);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.use(logger("dev"));
  app.use(compression());
  app.use(cookieParser());
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use("/api", routes);
  const port = process.env.PORT || 4000;

  server.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`);
    console.log(`web socket server is running on ws://localhost:${port}`);
  });
};
startServer();
