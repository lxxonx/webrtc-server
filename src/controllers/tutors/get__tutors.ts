import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../../prisma";

const get__tutors = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;

  if (!username || typeof username !== "string") {
    return next(createHttpError(400));
  }

  const tutorname = "$t_" + username;
  try {
    const tutor = await prisma.user.findUnique({
      where: {
        username: tutorname,
      },
    });

    if (!tutor || tutor.role !== "tutor") {
      return next(createHttpError(400));
    }
    return res.json({
      ok: true,
      result: {
        tutor,
      },
    });
  } catch (e) {
    console.log(e);
    return next(createHttpError(500));
  }
};
export default get__tutors;
