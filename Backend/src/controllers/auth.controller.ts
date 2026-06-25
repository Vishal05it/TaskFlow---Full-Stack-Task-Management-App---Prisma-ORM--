import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import {
  changePasswordService,
  createAccService,
  editProfileService,
} from "../services/auth.service.js";
import { redis } from "../config/redis.js";
import jwt from "jsonwebtoken";
import { otpGenerator } from "../utils/otpGenerator.js";
import { transport } from "../config/nodemailer.js";
import { brevo } from "../config/brevo.js";
export const signUpController = async (req: Request, res: Response) => {
  try {
    let body = req.body;
    let { name, email, password, avatar, phoneNumber, bio } = body;
    // console.log(`Body : `, body);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let actualEmail = email.toString().trim();
    if (!emailRegex.test(actualEmail)) {
      return res.status(400).json({
        message: "Invalid Email",
        success: false,
      });
    }
    const actualPassword = password.toString().trim();
    if (actualPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be atleast 8 characters long",
        success: false,
      });
    }
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email & password all are required",
        success: false,
      });
    }
    if (name.toString().length < 2) {
      return res.status(400).json({
        message: "Name must be atleast 2 character long",
        success: false,
      });
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        message: "Invalid Phone number",
        success: false,
      });
    }
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(401).json({
        message: "Email already registered",
        success: false,
      });
    }
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(actualPassword, salt);
    let refUser = {
      name,
      email: actualEmail,
      password: hashedPassword,
      bio,
      avatar,
      phoneNumber,
    };
    let userResponse = await createAccService(refUser);
    return res.status(200).json({
      message: "Account created successfully",
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let actualPassword = password.toString().trim();
    let actuaEmail = email.toString().trim();
    if (!actuaEmail || !actualPassword) {
      return res.status(400).json({
        message: "Email & Password both are required",
        success: false,
      });
    }
    if (actualPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be atleast 8 characters long",
        success: false,
      });
    }
    let findUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        isVerified: true,
        password: true,
      },
    });
    if (!findUser) {
      return res.status(404).json({
        message: "Email not registered",
        success: false,
      });
    }
    let matchPass = await bcrypt.compare(password, findUser.password);
    if (!matchPass) {
      return res.status(401).json({
        message: "Invalid Credentials, please try again",
        success: false,
      });
    }
    if (!findUser.isVerified) {
      return res.status(401).json({
        message:
          "Account verification pending, please verify your account to log in",
        success: false,
        unverified: true,
      });
    }
    let sendUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isVerified: false,
        password: false,
        bio: true,
        phoneNumber: true,
      },
    });
    let sessionToken = jwt.sign(
      { userId: findUser.id },
      process.env.SECRET_KEY as string,
      { expiresIn: "7d" },
    );
    // console.log("Token : ", sessionToken);
    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    await redis.set(
      `activeSession:userId:${findUser.id}`,
      JSON.stringify(true),
    );
    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      user: sendUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const logOutController = async (req: Request, res: Response) => {
  try {
    let token = req.cookies.sessionToken;
    if (!token) {
      res.status(401).json({
        message: "Already logged out",
        success: true,
      });
    }
    res.clearCookie("sessionToken");
    let decode: any = jwt.verify(token, process.env.SECRET_KEY as string);
    await redis.del(`activeSession:userId:${decode.userId}`);
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const sendOTP = async (req: Request, res: Response) => {
  try {
    let { email } = req.params;
    let userExist = await prisma.user.findUnique({
      where: {
        email: String(email),
      },
    });
    if (!userExist) {
      return res.status(404).json({
        message: "Email not registered",
        success: true,
      });
    }
    let existOTP = await redis.get(`accountVerify:email:${email}`);
    if (existOTP) {
      let timeLeft = await redis.ttl(`accountVerify:email:${email}`);
      return res.status(400).json({
        message: `Please wait ${timeLeft} seconds before requesting a new OTP`,
        success: false,
      });
    }
    let otp = otpGenerator();
    let salt = await bcrypt.genSalt(10);
    let hashOTP = await bcrypt.hash(otp.toString(), salt);
    await redis.set(`accountVerify:email:${email}`, hashOTP, { EX: 120 });
    brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.EMAIL,
        name: "TaskFlow",
      },
      to: [
        {
          email: email as string,
          name: userExist.name,
        },
      ],
      subject: "Account Verification",
      htmlContent: `<!DOCTYPE html>
<html>
  <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid #e4e4e7;
      "
    >
      <div
        style="
          background: #18181b;
          padding: 30px;
          text-align: center;
        "
      >
        <h1 style="color: white; margin: 0; font-size: 28px;">
          Task Manager
        </h1>
      </div>

      <div style="padding: 40px;">
        <h2
          style="
            color: #18181b;
            margin-top: 0;
            margin-bottom: 16px;
          "
        >
          Verify Your Account
        </h2>

        <p
          style="
            color: #52525b;
            font-size: 16px;
            line-height: 1.7;
          "
        >
          Hi,
        </p>

        <p
          style="
            color: #52525b;
            font-size: 16px;
            line-height: 1.7;
          "
        >
          Hello ${userExist.name}, Thank you for creating your Task Manager account.
          To complete your registration, please use the verification code below.
        </p>

        <div
          style="
            margin: 35px 0;
            text-align: center;
          "
        >
          <div
            style="
              display: inline-block;
              background: #18181b;
              color: white;
              padding: 18px 36px;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 10px;
              border-radius: 12px;
            "
          >
            ${otp}
          </div>
        </div>

        <p
          style="
            color: #52525b;
            font-size: 15px;
            line-height: 1.7;
          "
        >
          This OTP is valid for
          <strong>2 minutes</strong>.
          If you didn't create an account, you can safely ignore this email.
        </p>

        <hr
          style="
            margin: 30px 0;
            border: none;
            border-top: 1px solid #e4e4e7;
          "
        />

        <p
          style="
            color: #71717a;
            font-size: 14px;
            text-align: center;
            margin: 0;
          "
        >
          © 2026 Task Manager • Secure Personal Task Management
        </p>
      </div>
    </div>
  </body>
</html>`,
    });
    return res.status(200).json({
      message: `OTP sent to registered email`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const verifyAccount = async (req: Request, res: Response) => {
  try {
    let { email } = req.params;
    const { otpUser } = req.body;
    if (!otpUser) {
      return res.status(400).json({
        message: "OTP not entered",
        success: false,
      });
    }
    let realOTP = await redis.get(`accountVerify:email:${email}`);
    if (!realOTP) {
      return res.status(400).json({
        message: "OTP expired, request a new one",
        success: false,
      });
    }
    let matchOTP = await bcrypt.compare(otpUser, realOTP);
    await redis.incr(`otpAttempts:email:${email}`);
    let attempts = await redis.get(`otpAttempts:email:${email}`);
    if (attempts && Number(attempts) >= 5) {
      if (Number(attempts) == 5)
        await redis.set(`otpAttempts:email:${email}`, 5, { EX: 90 });
      else if (Number(attempts) > 5) {
        let timeLeft = await redis.ttl(`otpAttempts:email:${email}`);
        console.log("Time left : ", timeLeft + " and attempts = ", attempts);
        return res.status(401).json({
          message: `Too many attempts, please try after ${timeLeft} seconds`,
          success: false,
        });
      }
    }
    if (!matchOTP) {
      attempts = await redis.get(`otpAttempts:email:${email}`);
      // console.log("Attempts = ", attempts);
      return res.status(401).json({
        message: `Invalid OTP, ${5 - Number(attempts)} attempts remaining`,
        success: false,
      });
    }

    let user = await prisma.user.update({
      where: {
        email: email as string,
      },
      data: {
        isVerified: true,
      },
    });
    await redis.del(`otpAttempts:email:${email}`);
    await redis.del(`accountVerify:email:${email}`);
    return res.status(200).json({
      message: "Account verified successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const sendOTPforPassword = async (req: Request, res: Response) => {
  try {
    let { email } = req.params;
    let userExist = await prisma.user.findUnique({
      where: {
        email: String(email),
      },
    });
    if (!userExist) {
      return res.status(404).json({
        message: "Email not registered",
        success: true,
      });
    }
    let existOTP = await redis.get(`resetPassOtp:email:${email}`);
    if (existOTP) {
      let timeLeft = await redis.ttl(`resetPassOtp:email:${email}`);
      return res.status(400).json({
        message: `Please wait ${timeLeft} seconds before requesting a new OTP`,
        success: false,
      });
    }
    let otp = otpGenerator();
    let salt = await bcrypt.genSalt(10);
    let hashOTP = await bcrypt.hash(otp.toString(), salt);
    await redis.set(`resetPassOtp:email:${email}`, hashOTP, { EX: 120 });
    brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.EMAIL,
        name: "TaskFlow",
      },
      to: [
        {
          email: email as string,
        },
      ],
      subject: "TaskFlow Password Reset",
      htmlContent: `<!DOCTYPE html>
<html>
  <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid #e4e4e7;
      "
    >
      <div
        style="
          background: #18181b;
          padding: 30px;
          text-align: center;
        "
      >
        <h1 style="color: white; margin: 0; font-size: 28px;">
          Task Manager
        </h1>
      </div>

      <div style="padding: 40px;">
        <h2
          style="
            color: #18181b;
            margin-top: 0;
            margin-bottom: 16px;
          "
        >
          Verify Your Account
        </h2>

        <p
          style="
            color: #52525b;
            font-size: 16px;
            line-height: 1.7;
          "
        >
          Hi,
        </p>

        <p
          style="
            color: #52525b;
            font-size: 16px;
            line-height: 1.7;
          "
        >
          Hello ${userExist.name}, You have requested to reset your password.
          To reset your password, please use the verification code below.
        </p>

        <div
          style="
            margin: 35px 0;
            text-align: center;
          "
        >
          <div
            style="
              display: inline-block;
              background: #18181b;
              color: white;
              padding: 18px 36px;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 10px;
              border-radius: 12px;
            "
          >
            ${otp}
          </div>
        </div>

        <p
          style="
            color: #52525b;
            font-size: 15px;
            line-height: 1.7;
          "
        >
          This OTP is valid for
          <strong>2 minutes</strong>.
          If you didn't request this OTP, contact us immediately and change your TaskFlow password.
        </p>

        <hr
          style="
            margin: 30px 0;
            border: none;
            border-top: 1px solid #e4e4e7;
          "
        />

        <p
          style="
            color: #71717a;
            font-size: 14px;
            text-align: center;
            margin: 0;
          "
        >
          © 2026 Task Manager • Secure Personal Task Management
        </p>
      </div>
    </div>
  </body>
</html>`,
    });
    return res.status(200).json({
      message: `OTP sent to registered email`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const resetPasswordByOTP = async (req: Request, res: Response) => {
  try {
    let { email } = req.params;
    const { otpUser, password } = req.body;
    if (!otpUser) {
      return res.status(400).json({
        message: "OTP not entered",
        success: false,
      });
    }
    let realOTP = await redis.get(`resetPassOtp:email:${email}`);
    if (!realOTP) {
      return res.status(400).json({
        message: "OTP expired, request a new one",
        success: false,
      });
    }
    await redis.incr(`otpAttemptsPass:email:${email}`);
    let attempts = await redis.get(`otpAttemptsPass:email:${email}`);
    console.log("Attempts now : ", attempts);
    if (attempts && Number(attempts) >= 5) {
      if (Number(attempts) == 5)
        await redis.set(`otpAttemptsPass:email:${email}`, 5, { EX: 90 });
      else if (Number(attempts) > 5) {
        let timeLeft = await redis.ttl(`otpAttemptsPass:email:${email}`);
        return res.status(401).json({
          message: `Too many attempts, Please try after ${timeLeft} seconds`,
          success: false,
        });
      }
    }
    let matchOTP = await bcrypt.compare(otpUser.toString(), realOTP);
    if (!matchOTP) {
      attempts = await redis.get(`otpAttemptsPass:email:${email}`);
      return res.status(401).json({
        message: `Invalid OTP, ${5 - Number(attempts)} attempts remaining`,
        success: false,
      });
    } else {
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);
      let user = await prisma.user.update({
        where: {
          email: email as string,
        },
        data: {
          password: hashedPassword,
        },
      });
      await redis.del(`otpAttemptsPass:email:${email}`);
      await redis.del(`resetPassOtp:email:${email}`);
      return res.status(200).json({
        message: "Password reset successful",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const editProfile = async (req: Request | any, res: Response) => {
  try {
    const { name, email, bio, phoneNumber, avatar } = req.body;
    let refUser: any = {};
    if (name) {
      if (name.toString().trim().length < 2) {
        return res.status(400).json({
          message: "Name must be atleast 2 characters long",
          success: false,
        });
      }
      refUser.name = name;
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.toString().trim())) {
        return res.status(400).json({
          message: "Invalid Email",
          success: false,
        });
      }
      let emailExist = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (emailExist && emailExist.id != req.userId) {
        return res.status(401).json({
          message: "Email already registered",
          success: false,
        });
      }
      refUser.email = email;
    }
    if (bio) {
      refUser.bio = bio;
    }
    if (phoneNumber) {
      refUser.phoneNumber = phoneNumber;
    }
    if (avatar) {
      refUser.avatar = avatar;
    }
    refUser.id = req.userId;
    let updatedUser = await editProfileService(refUser);
    if (!updatedUser) {
      return res.status(500).json({
        message: "Profile updation failed",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const changePassword = async (req: Request | any, res: Response) => {
  try {
    const { currPass, newPass } = req.body;
    const id = req.userId;
    if (!currPass || !newPass) {
      return res.status(400).json({
        message: "Enter both old and new passwords to continue",
        success: false,
      });
    }
    if (newPass.toString().trim().length < 8) {
      return res.status(400).json({
        message: "New Password must be atleast 8 characters long",
        success: false,
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const matchPass = await bcrypt.compare(currPass, user.password);
    if (!matchPass) {
      return res.status(401).json({
        message: "Incorrect Password",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);
    const updatedUser = await changePasswordService(Number(id), hashedPassword);
    if (!updatedUser) {
      return res.status(500).json({
        message: "Password updation failed",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
