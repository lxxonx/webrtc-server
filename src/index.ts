import compression from "compression";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import logger from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import swagger from "./swagger";
// init dotenv
dotenv.config();

const startServer = async () => {
  const app = express();

  const specs = swaggerJSDoc(swagger.options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.use(logger("dev"));
  app.use(compression());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use("/api", routes);

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`);
  });
};
startServer();
