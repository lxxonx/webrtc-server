import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt, { PayloadType } from "../../utils/jwt";

const post__refresh_token = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization && req.headers.refresh) {
    const authToken = req.headers.authorization.split("Bearer ")[1];
    const refreshToken = req.headers.refresh as string;

    const authResult = jwt.verify(authToken);

    const decoded = jwt.decode(authToken) as PayloadType;

    if (decoded === null) {
      return next(createHttpError(401));
    }

    const refreshResult = await jwt.refreshVerify(
      refreshToken,
      decoded!.userId
    );

    if (authResult.ok === false && authResult.message === "jwt expired") {
      if (refreshResult === false) {
        return next(createHttpError(401));
      } else {
        const newAccessToken = jwt.sign(decoded!.userId, decoded.role);

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
};

export default post__refresh_token;
