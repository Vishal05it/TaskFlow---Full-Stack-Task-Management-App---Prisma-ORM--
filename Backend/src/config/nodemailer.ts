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
