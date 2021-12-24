import { Request, Response } from "express";
import prisma from "../../prisma";

const get__sessions = async (req: Request, res: Response) => {
  const { starting_date } = req.params;
  if (!starting_date) {
    return res.json({
      ok: false,
      field: starting_date,
      message: "REQUIRE_FIELD_NOT_PROVIDED",
    });
  }
  const sesseions = await prisma.session.findMany({
    where: {
      schedule: {
        gte: starting_date,
      },
    },
    select: {
      duration: true,
      schedule: true,
      tutor: {
        select: {
          avatar: true,
          firstname: true,
          rating: true,
          content: true,
        },
      },
    },
  });
  return res.json({
    ok: true,
    result: {
      sesseions,
    },
  });
};

export default get__sessions;
