import { Router } from "express";
import auth from "../middlewares/auth";
import sessionsCtrl from "../controllers/sessions.ctrl";

// /api/sessions
const sessions = Router();

sessions.use("/connect", sessionsCtrl.io.connect);
sessions.get("/", sessionsCtrl.get._);
sessions.post("/create", auth, sessionsCtrl.post.create);

export default sessions;
