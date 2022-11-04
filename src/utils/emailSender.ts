import nodemailer from 'nodemailer';
import { IUser } from './tsTypes';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_NODEMAILER_PSW,
  },
});

export const sendPwdResetEmail = async (userObj: IUser, link: string) => {
  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: userObj.email,
    subject: 'SALAD BAR: Reset your password',
    text: `$To resest your password follow this link : ${link}`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
