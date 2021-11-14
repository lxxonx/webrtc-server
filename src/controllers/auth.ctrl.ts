import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt, { PayloadType } from "../utils/jwt";
import jsonwebtoken from "jsonwebtoken";
import prisma from "../prisma";

type UserReturn = {
  username: string;
  firstname: string;
  lastname?: string;
  birthYear: number;
  createdAt: Date;
  updatedAt?: Date;
  monthlySession?: number;
  leftSession?: number;
  rating: number;
  avatar: string;
  nationality?: string;
};

export default {
  get: {
    current_user: async (req: Request, res: Response, next: NextFunction) => {
      if (!req.context.username || !req.context.role) {
        return next(createHttpError(401));
      }
      let user;
      try {
        if (req.context.username.startsWith("$t_")) {
          user = await prisma.tutor.findUnique({
            where: { username: req.context.username },
          });
        } else {
          user = (await prisma.student.findUnique({
            where: { username: req.context.username },
          })) as UserReturn;
        }
        return res.json(user);
      } catch (e) {
        console.log(e);
        return next(createHttpError(500));
      }
    },
  },
  post: {
    refresh: async (req: Request, res: Response, next: NextFunction) => {
      if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split("Bearer ")[1];
        const refreshToken = req.headers.refresh as string;

        const authResult = jwt.verify(authToken);

        const decoded = jsonwebtoken.decode(authToken) as PayloadType;

        if (decoded === null) {
          return res.status(401).send({
            ok: false,
            message: "No authorized!",
          });
        }

        const refreshResult = await jwt.refreshVerify(
          refreshToken,
          decoded!.username
        );

        if (authResult.ok === false && authResult.message === "jwt expired") {
          if (refreshResult === false) {
            return next(createHttpError(401));
          } else {
            const newAccessToken = jwt.sign(decoded!.username);

            return res.status(200).send({
              ok: true,
              tokens: {
                accessToken: newAccessToken,
                refreshToken,
              },
            });
          }
        } else {
          return res.status(400).send({
            ok: false,
            message: "Acess token is not expired!",
          });
        }
      } else {
        return res.status(400).send({
          ok: false,
          message: "Access token and refresh token are need for refresh!",
        });
      }
    },
  },
};
