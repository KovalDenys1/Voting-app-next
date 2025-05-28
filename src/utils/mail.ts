import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER || "");

export async function sendVerificationEmail(email: string, token: string) {
  const confirmUrl = `${process.env.BASE_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Confirm your email",
    html: `<p>Please confirm your email by clicking this link:</p>
           <p><a href="${confirmUrl}">${confirmUrl}</a></p>`,
  });
}