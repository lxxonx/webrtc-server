import { Router } from "express";
import usersCtrl from "../controllers/users.ctrl";
import auth from "../middlewares/auth";

// api/users
const users = Router();

users.get("/current-user", auth, usersCtrl.get.currentUser);
users.post("/login", usersCtrl.post.login);
users.post("/logout", usersCtrl.post.logout);
users.post("/register/:role", usersCtrl.post.register);
users.post("/refresh", usersCtrl.post.refreshToken);

export default users;
