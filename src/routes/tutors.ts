import { Router } from "express";
import tutorsCtrl from "src/controllers/tutors.ctrl";

// /api/tutors

const tutors = Router();

tutors.get("/", tutorsCtrl.get._);

export default tutors;
