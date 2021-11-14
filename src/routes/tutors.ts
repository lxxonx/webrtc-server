import { Router } from "express";
import tutorsCtrl from "../controllers/tutors.ctrl";

// /api/tutors
const tutors = Router();

tutors.post("/register", tutorsCtrl.post.register);
tutors.post("/login", tutorsCtrl.post.login);

export default tutors;
