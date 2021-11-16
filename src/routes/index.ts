import { Router } from "express";
import sessions from "./sessions";
import users from "./users";

// /api
const routes = Router();

routes.use("/sessions", sessions);
routes.use("/users", users);

export default routes;
