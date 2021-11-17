import argon2 from "argon2";
import prisma from "../../prisma";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import validate from "../../utils/validate";
type User_Register_Inputs = {
  username: string;
  password: string;
  firstname: string;
  lastname?: string;
  birthYear: number;
  nationality?: string;
};
type User_Role = "tutor" | "student";
const post__register = async (
  { body, params }: Request,
  res: Response,
  next: NextFunction
) => {
  // args
  const {
    username,
    password,
    firstname,
    lastname,
    birthYear,
    nationality,
  }: User_Register_Inputs = body;
  const { role } = params;

  // valid check
  const isValidPassword = validate.require_string(password);
  if (!isValidPassword.ok) {
    return res.json(isValidPassword);
  }
  const isValidFirstname = validate.require_string(firstname);
  if (!isValidFirstname.ok) {
    return res.json(isValidFirstname);
  }

  // validate username
  const trimmed = username.trim();
  if (!trimmed) {
    return res.json({
      ok: false,
      field: "username",
      message: "REQUIRE_FIELD_NOT_PROVIDED",
    });
  }
  // validate birthYear
  if (!birthYear || birthYear < 1900) {
    return res.json({
      ok: false,
      field: "birthYear",
      message: "REQUIRE_FIELD_NOT_PROVIDED",
    });
  }
  try {
    const hash = await argon2.hash(password);
    await prisma.user.create({
      data: {
        username: role === "tutor" ? "$t_" + username : username,
        password: hash,
        birthYear: +birthYear,
        firstname,
        lastname,
        nationality,
        role: role as User_Role,
      },
    });

    return res.json({
      ok: true,
      message: "USER_REGISTER_SUCCESS",
      field: "regiser",
    });
  } catch (e) {
    if (e.code === "P2002") {
      // unique constraint error
      return res.json({
        ok: false,
        field: e.message
          .split("Unique constraint failed on the fields: ")[1]
          .split("`")[1],
        message: "UNIQUE_CONSTRAINT_ERROR",
      });
    }
    console.log(e);
    return next(createHttpError(500, "INTERNAL_ERROR"));
  }
};
export default post__register;
