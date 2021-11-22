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
import swagger from "./swagger";
// init dotenv
dotenv.config();

const startServer = async () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  const specs = swaggerJSDoc(swagger.options);
  app.set("io", io);
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
  });
};
startServer();
