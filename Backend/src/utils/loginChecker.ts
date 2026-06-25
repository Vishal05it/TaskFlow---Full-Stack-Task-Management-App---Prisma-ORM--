import { redis } from "../config/redis.js";
import type { Request, Response } from "express";
export const loginChecker = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    let isLoggedIn = await redis.get(`activeSession:userId:${userId}`);
    if (isLoggedIn)
      return res.status(200).json({
        message: "User is actually logged in",
        success: true,
      });
    else
      return res.status(401).json({
        message: "User is not logged in",
        success: false,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
