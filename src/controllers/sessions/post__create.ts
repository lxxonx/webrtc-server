import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../../prisma";

type Session_Create_Type = {
  schedule: Date;
};

const post__create = async (
  { body, context }: Request,
  res: Response,
  next: NextFunction
) => {
  const { schedule }: Session_Create_Type = body;
  const { username } = context;
  if (!username || !username.startsWith("$t_")) {
    return next(createHttpError(401));
  }
  try {
    const tutor = await prisma.tutor.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (!tutor) {
      return res.json({
        ok: false,
        message: "USER_NOT_FOUND",
      });
    }
    const session = await prisma.session.create({
      data: {
        tutorId: tutor!.id,
        schedule,
      },
    });
    return res.json(session);
  } catch (e) {
    return next(createHttpError(500));
  }
};
export default post__create;
