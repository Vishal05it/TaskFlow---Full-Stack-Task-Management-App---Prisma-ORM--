import nodemailer from "nodemailer";
export const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});
transport.verify((err, success) => {
  if (err) {
    console.error("SMTP Verify Error:", err);
  } else {
    console.log("SMTP Ready");
  }
});
console.log("EMAIL:", process.env.EMAIL);
console.log(
  "APP_PASSWORD exists:",
  !!process.env.APP_PASSWORD,
  "length:",
  process.env.APP_PASSWORD?.length,
);
