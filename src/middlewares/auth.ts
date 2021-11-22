import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../prisma";
import jwt from "../utils/jwt";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split("Bearer ")[1];
    const result = jwt.verify(token);
    if (result.ok === false) {
      return res.status(401).send({
        ok: false,
        message: result.message,
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: result.userId,
      },
      select: {
        role: true,
      },
    });
    req.context = {
      userId: result.userId,
      role: user?.role,
    };
    return next();
  } else {
    return next(createHttpError(401));
  }
};
export default auth;
