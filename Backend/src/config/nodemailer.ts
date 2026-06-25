import nodemailer from "nodemailer";
export const transport = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_LOGIN,
    pass: process.env.BREVO_PASSWORD,
  },
  connectionTimeout: 30000,
});
transport.verify((err, success) => {
  console.log("VERIFY ERROR:", err);
  console.log("VERIFY SUCCESS:", success);
});
