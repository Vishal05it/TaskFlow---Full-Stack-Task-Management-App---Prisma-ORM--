import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
export const verifyUser = async (
  req: Request | any,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req.cookies.sessionToken;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }
    let decode: any = jwt.verify(token, process.env.SECRET_KEY as string);
    if (!decode.userId) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }
    let userExist = await prisma.user.findUnique({
      where: {
        id: decode.userId,
      },
      select: {
        id: true,
      },
    });
    if (!userExist) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    req.userId = decode.userId;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or Expired token",
      success: false,
    });
  }
};
