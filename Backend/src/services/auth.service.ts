import cloudinary from "../config/cloudinary.js";
import prisma from "../config/prisma.js";
type refUser = {
  name: string;
  email: string;
  password: string;
  bio: string;
  phoneNumber: string;
  avatar: string;
};
type refUserUpdate = {
  id: number;
  name: string;
  email: string;
  password: string;
  bio: string;
  phoneNumber: string;
  avatar: string;
};
export const createAccService = async (refUser: refUser) => {
  return await prisma.user.create({
    data: refUser,
    select: {
      id: true,
      name: true,
      avatar: true,
      email: true,
      phoneNumber: true,
      bio: true,
      password: false,
      isVerified: false,
    },
  });
};
export const editProfileService = async (refUser: refUserUpdate) => {
  return await prisma.user.update({
    where: {
      id: refUser.id,
    },
    data: refUser,
    select: {
      id: true,
      name: true,
      avatar: true,
      email: true,
      phoneNumber: true,
      bio: true,
      password: false,
      isVerified: false,
    },
  });
};
export const changePasswordService = async (
  id: number,
  newPassword: string,
) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: newPassword,
    },
  });
};
