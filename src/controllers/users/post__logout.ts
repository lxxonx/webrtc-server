import { Request, Response } from "express";

const post__logout = (req: Request, res: Response) => {
  req.context = {};
  res.clearCookie("refreshToken");
};

export default post__logout;
