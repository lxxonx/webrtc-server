import jwt, { Secret, SignOptions } from "jsonwebtoken";
import prisma from "../prisma";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as Secret;

export type PayloadType = {
  userId: number;
  role: "tutor" | "student";
};

export default {
  sign: (userId: number, role: "tutor" | "student") => {
    const payload = {
      userId,
      role,
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      algorithm: "HS512",
      expiresIn: "5m",
    });
  },
  verify: (token: string) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as PayloadType;
      return {
        ok: true,
        userId: decoded.userId,
        role: decoded.role,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
  decode: (token: string) => {
    return jwt.decode(token);
  },
  refresh: (maxAge: SignOptions["expiresIn"] = "1d") => {
    return jwt.sign({}, REFRESH_TOKEN_SECRET, {
      algorithm: "HS512",
      expiresIn: maxAge,
    });
  },
  refreshVerify: async (refresh: string, userId: number): Promise<Boolean> => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        refresh: true,
      },
    });
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
