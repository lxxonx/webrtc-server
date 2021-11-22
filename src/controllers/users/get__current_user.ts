import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../../prisma";

const get__current_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.context.userId || !req.context.role) {
    return res.json({
      ok: false,
      message: "NOT_LOGGED_IN",
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.context.userId },
    });
    return res.json({
      ok: true,
      user,
    });
  } catch (e) {
    console.log(e);
    return next(createHttpError(500));
  }
};
export default get__current_user;
