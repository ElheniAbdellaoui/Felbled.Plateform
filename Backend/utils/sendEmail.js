import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true pour 465, false pour 587
      auth: {
        user: process.env.EMAIL_USER, // stocke ton email dans .env
        pass: process.env.EMAIL_PASS, // stocke ton app password Gmail dans .env
      },
    });

    const info = await transporter.sendMail({
      from: `"Felbled Plateform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📩 Email envoyé:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);
    throw new Error("Impossible d’envoyer l’email");
  }
};
