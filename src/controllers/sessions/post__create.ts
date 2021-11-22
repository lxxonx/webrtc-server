import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../../prisma";

type Session_Create_Input = {
  schedule: Date;
};

const post__create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { schedule } = req.body as Session_Create_Input;
  const { userId, role } = req.context;

  if (role !== "tutor" || !userId) {
    return next(createHttpError(403));
  }

  if (!schedule) {
    return res.json({
      ok: false,
      field: "schedule",
      message: "REQUIRE_FIELD_NOT_PROVIDED",
    });
  }

  await prisma.session.create({
    data: {
      schedule,
      tutorId: userId,
    },
  });
};

export default post__create;
