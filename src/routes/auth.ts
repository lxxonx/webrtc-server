import { Router } from "express";
import authCtrl from "../controllers/auth.ctrl";
import auth from "../middlewares/auth";

// api/auth
const authRouter = Router();

authRouter.get("users/current-user", auth, authCtrl.get.current_user);
authRouter.post("users/refresh", authCtrl.post.refresh);

export default authRouter;
