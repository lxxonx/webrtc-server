import { NextFunction, Request, Response } from "express";

const get__sessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { starting_date } = req.body;
};

export default get__sessions;
