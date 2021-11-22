import { Router } from "express";
import tutorsCtrl from "../controllers/tutors.ctrl";

// /api/tutors

const tutors = Router();

tutors.get("/", tutorsCtrl.get._);

export default tutors;
