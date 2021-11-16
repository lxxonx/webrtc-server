import compression from "compression";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import logger from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import swagger from "./swagger";
import http from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
// init dotenv
dotenv.config();

const startServer = async () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  const specs = swaggerJSDoc(swagger.options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.use(logger("dev"));
  app.use(compression());
  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use("/api", routes);

  io.on("connection", (socket) => {
    socket.on("join_room", (roomName) => {
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) => {
      socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
      socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
      socket.to(roomName).emit("ice", ice);
    });
  });
  const port = process.env.PORT || 4000;

  server.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`);
  });
};
startServer();
