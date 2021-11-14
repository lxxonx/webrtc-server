import { Router } from "express";
import studentsCtrl from "../controllers/students.ctrl";
// /api/students
const students = Router();
students.post("/register", studentsCtrl.post.register);
students.post("/login", studentsCtrl.post.login);
export default students;
