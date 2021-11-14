import jwt, { Secret, SignOptions } from "jsonwebtoken";
import prisma from "../prisma";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as Secret;

export type PayloadType = {
  username: string;
  role: "Tutor" | "Student";
};

export default {
  sign: (username: string) => {
    const payload = {
      username: username,
      role: username.startsWith("$t_") ? "Tutor" : "Student",
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      algorithm: "HS512",
      expiresIn: "30s",
    });
  },
  verify: (token: string) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as PayloadType;
      return {
        ok: true,
        username: decoded.username,
        role: decoded.role,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
  refresh: (maxAge: SignOptions["expiresIn"] = "1d") => {
    return jwt.sign({}, REFRESH_TOKEN_SECRET, {
      algorithm: "HS512",
      expiresIn: maxAge,
    });
  },
  refreshVerify: async (
    refresh: string,
    username: string
  ): Promise<Boolean> => {
    let user;
    if (username.startsWith("$t_")) {
      user = await prisma.tutor.findUnique({
        where: {
          username,
        },
        select: {
          refresh: true,
        },
      });
    } else {
      user = await prisma.student.findUnique({
        where: {
          username,
        },
        select: {
          refresh: true,
        },
      });
    }
    try {
      if (refresh === user?.refresh) {
        try {
          jwt.verify(refresh, REFRESH_TOKEN_SECRET);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};
