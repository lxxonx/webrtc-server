import { Student, Tutor } from ".prisma/client";
import { Request } from "express";

export class Context {
  constructor(
    public username?: string | undefined,
    public role?: "Student" | "Tutor" | undefined
  ) {}
}
declare global {
  namespace Express {
    interface Request {
      context: Context;
      user: Student | Tutor;
    }
  }
}
