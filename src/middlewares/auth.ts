import { NextFunction, Request, Response } from "express";
import prisma from "src/prisma";
import jwt from "../utils/jwt";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split("Bearer ")[1];
    const result = jwt.verify(token);

    const user = await prisma.user.findUnique({
      where: {
        id: result.userId,
      },
      select: {
        role: true,
      },
    });
    if (result.ok) {
      req.context = {
        userId: result.userId,
        role: user?.role,
      };
      next();
    } else {
      res.status(401).send({
        ok: false,
        message: result.message,
      });
    }
  }
};
export default auth;
