import { Router } from "express";
import auth from "../middlewares/auth";
import sessionsCtrl from "../controllers/sessions.ctrl";

// /api/students

const sessions = Router();

sessions.post("/create", auth, sessionsCtrl.post.create);

export default sessions;
