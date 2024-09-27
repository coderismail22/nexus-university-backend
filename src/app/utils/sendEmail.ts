import nodemailer from "nodemailer";
import config from "../config";

const sendEmail = async (resetPasswordUILink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production", // true for port 465, false for other ports
    auth: {
      user: "xordiboy@gmail.com",
      pass: "aesc tcrj ushj gjlc",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: "coderismail22@gmail.com", // list of receivers
    to: "ismailmdhossain2@gmail.com", // list of receivers
    subject: "Password reset link", // Subject line
    text: "Please change your password.", // plain text body
    html: `<b>Reset Link:${resetPasswordUILink}</b>`, // html body
  });
};

export default sendEmail;
