import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ⚡ utilise env
        pass: process.env.EMAIL_PASS, // ⚡ utilise env
      },
    });

    await transporter.sendMail({
      from: `"Felbled Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email envoyé à:", to);
  } catch (error) {
    console.error("Erreur envoi email:", error);
  }
};
