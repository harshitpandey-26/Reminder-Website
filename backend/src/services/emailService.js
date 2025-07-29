import nodemailer from "nodemailer";

export const sendReminderEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Reminder App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
