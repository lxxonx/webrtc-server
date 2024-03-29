import argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../../prisma";
import jwt from "../../utils/jwt";
import validate from "../../utils/validate";
type Login_Input_Type = {
  username: string;
  password: string;
};

const post__login = async (req: Request, res: Response, next: NextFunction) => {
  // args
  const { username, password }: Login_Input_Type = req.body;
  const { role } = req.params;

  // valid check
  const isValidPassword = validate.require_string(password);
  if (!isValidPassword.ok) {
    return res.json(isValidPassword);
  }
  const isValidUsername = validate.require_string(username);
  if (!isValidUsername.ok) {
    return res.json(isValidUsername);
  }

  const user = await prisma.user.findUnique({
    where: { username: role === "tutor" ? "$t_" + username : username },
  });

  if (!user) {
    return res.json({
      ok: false,
      message: "USER_NOT_FOUND",
      field: "username",
    });
  }
  if (await argon2.verify(user!.password, password)) {
    const accessToken = jwt.sign(user.id, user.role);
    const refreshToken = jwt.refresh();
    await prisma.user.update({
      where: {
        username,
      },
      data: {
        refresh: refreshToken,
      },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    return res.json({
      ok: true,
      result: {
        token: accessToken,
      },
    });
  }
  return next(createHttpError(500));
};
export default post__login;
