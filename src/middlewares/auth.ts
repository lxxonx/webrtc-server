import { NextFunction, Request, Response } from "express";
import jwt from "../utils/jwt";

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split("Bearer ")[1];
    const result = jwt.verify(token);
    if (result.ok) {
      req.context = {
        ...result,
      };
      return next();
    } else {
      return res.status(401).send({
        ok: false,
        message: result.message,
      });
    }
  }
};
export default auth;
