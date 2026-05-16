import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export async function sendInvitationEmail(to: string, projectName: string, inviterName: string) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return;

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: `You were added to ${projectName}`,
    text: `${inviterName} added you to ${projectName} in Team Task Manager. Log in to view your tasks.`
  });
}
