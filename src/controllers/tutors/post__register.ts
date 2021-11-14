import argon2 from "argon2";
import prisma from "../../prisma";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "../../utils/jwt";
import validate from "../../utils/validate";
interface Tutor_Register_Inputs {
  username: string;
  password: string;
  firstname: string;
  lastname?: string;
  birthYear: number;
}

const post__register = async (
  { body }: Request,
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
  }: Tutor_Register_Inputs = body;

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
  const username_input = modified_username(username);
  if (!username_input) {
    return res.json({
      ok: false,
      field: "username",
      message: "REQUIRE_FIELD_NOT_PROVIDED",
    });
  }
  // validate birthYear
  if (!birthYear) {
    return res.json({
      ok: false,
      field: "birthYear",
      message: "REQUIRE_FIELD_NOT_PROVIDED",
    });
  }

  try {
    const hash = await argon2.hash(password);
    await prisma.tutor.create({
      data: {
        username: username_input,
        password: hash,
        birthYear: +birthYear,
        firstname,
        lastname,
      },
    });
    const accessToken = jwt.sign(username_input);
    const refreshToken = jwt.refresh();

    return res.json({
      ok: true,
      tokens: {
        accessToken,
        refreshToken,
      },
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

const modified_username = (username: string): string | false => {
  const trimmed = username.trim();
  if (!trimmed) {
    return false;
  }
  return "$t_" + trimmed;
};
