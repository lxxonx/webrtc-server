import { Router } from "express";
import usersCtrl from "src/controllers/users.ctrl";
import auth from "../middlewares/auth";

// api/users
const users = Router();

users.get("/current-user", auth, usersCtrl.get.currentUser);
users.post("/login", usersCtrl.post.login);
users.post("/refresh", usersCtrl.post.refreshToken);

export default users;
