import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt, { PayloadType } from "../../utils/jwt";

const post__refresh_token = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization && req.cookies.refreshToken) {
    const authToken = req.headers.authorization.split("Bearer ")[1];
    const refreshToken = req.cookies.refreshToken as string;

    const authResult = jwt.verify(authToken);

    const decoded = jwt.decode(authToken) as PayloadType;

    console.log(decoded);
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
          result: { token: newAccessToken },
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
