import { Router } from "express";
import tutors from "./tutors";
import students from "./students";
import sessions from "./sessions";
import authRouter from "./auth";

// /api
const routes = Router();

routes.use("/tutors", tutors);
routes.use("/students", students);
routes.use("/sessions", sessions);
routes.use("/auth", authRouter);

export default routes;
