import "reflect-metadata";
import fastifyCookie from "fastify-cookie";
import { NestFactory } from "@nestjs/core";
import {
  NestFastifyApplication,
  FastifyAdapter,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });
  await app.listen(4000);
}
bootstrap();
