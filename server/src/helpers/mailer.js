import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "./config.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});
