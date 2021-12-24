import { Student, Tutor } from ".prisma/client";

export type Context = {
  userId?: number;
  role?: "student" | "tutor" | undefined;
};
declare global {
  namespace Express {
    interface Request {
      context: Context;
      user: Student | Tutor;
    }
  }
  namespace Socket {
    interface Handshake {
      context: Context;
    }
  }
}
