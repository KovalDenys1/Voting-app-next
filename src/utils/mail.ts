import nodemailer from "nodemailer";

// Create a transporter for sending emails using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send a verification email with a confirmation link
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

// Send a password reset email with a reset link
export async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${process.env.BASE_URL}/reset?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `<p>You requested a password reset.</p>
           <p>Click <a href="${resetUrl}">${resetUrl}</a> to reset your password.</p>
           <p>This link is valid for 1 hour.</p>`,
  });
}