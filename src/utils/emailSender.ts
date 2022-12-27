import nodemailer from 'nodemailer';
import config from './config';
import { IUser } from '../tsTypes/';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.GMAIL_EMAIL,
    pass: config.GMAIL_NODEMAILER_PSW,
  },
});

export const sendPwdResetEmail = async (userObj: IUser, link: string) => {
  const mailOptions = {
    from: config.GMAIL_EMAIL,
    to: userObj.email,
    subject: 'SALAD BAR: Reset your password',
    text: `To resest your password follow this link : ${link}`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
