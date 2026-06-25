import express from "express";
import {
  changePassword,
  editProfile,
  loginController,
  logOutController,
  resetPasswordByOTP,
  sendOTP,
  sendOTPforPassword,
  signUpController,
  verifyAccount,
} from "../controllers/auth.controller.js";
import { loginChecker } from "../utils/loginChecker.js";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";
export const authRouter = express.Router();
authRouter.post("/signup", signUpController);
authRouter.post("/login", loginController);
authRouter.post("/logout", verifyUser, logOutController);
authRouter.post("/sendotp/:email", sendOTP);
authRouter.post("/sendotpforpassword/:email", sendOTPforPassword);
authRouter.post("/resetpasswordbyotp/:email", resetPasswordByOTP);
authRouter.post("/verifyaccount/:email", verifyAccount);
authRouter.get("/verifylogin/:userId", verifyUser, loginChecker);
authRouter.put("/editprofile", verifyUser, editProfile);
authRouter.patch("/changepassword", verifyUser, changePassword);
