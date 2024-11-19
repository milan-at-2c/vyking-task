import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import { config } from "../config/config";

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("token");
  const refreshToken = req.headers.cookie?.split("=")[1];

  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).send({
      success: false,
      error: {
        code: httpStatus.UNAUTHORIZED,
        message: "Token not provided",
        tokenExpired: !!refreshToken,
      },
    });
    return;
  }

  try {
    jwt.verify(token, config.jwt.secret);
    next();
  } catch (ex: any) {
    if (ex.name === "TokenExpiredError") {
      res.status(httpStatus.UNAUTHORIZED).send({
        success: false,
        error: {
          code: httpStatus.UNAUTHORIZED,
          message: "Token expired",
          tokenExpired: true,
        },
      });
      return;
    }
    res
      .status(httpStatus.UNAUTHORIZED)
      .clearCookie("refreshToken")
      .send({
        success: false,
        error: {
          code: httpStatus.UNAUTHORIZED,
          message: "Token not valid",
        },
      });
  }
};
