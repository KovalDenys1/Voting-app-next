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
export async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${process.env.BASE_URL}/reset?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `<p>You requested a password reset.</p>
           <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
           <p>This link is valid for 1 hour.</p>`,
  });
}