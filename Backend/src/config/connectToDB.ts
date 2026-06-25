import prisma from "./prisma.js";
export const connectToDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB : ", error);
    process.exit(1);
  }
};
