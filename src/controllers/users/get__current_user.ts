import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "src/prisma";

const get__current_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.context.userId || !req.context.role) {
    return next(createHttpError(401));
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.context.userId },
    });
    return res.json(user);
  } catch (e) {
    console.log(e);
    return next(createHttpError(500));
  }
};
export default get__current_user;
