import nodemailer from "nodemailer";

const sendEmail = async (to, subject, content, isHTML = false) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Brevo/Sendinblue specific settings
    requireTLS: true,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"Support Orange News" <${process.env.SMTP_SENDER || process.env.SMTP_USER}>`,
    to,
    subject,
  };

  // PERBAIKAN UTAMA: Gunakan html atau text berdasarkan parameter isHTML
  if (isHTML) {
    mailOptions.html = content; // Untuk HTML email
    // Opsional: Tambahkan text fallback (strip HTML tags)
    mailOptions.text = content
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  } else {
    mailOptions.text = content; // Untuk plain text email
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error in sendEmail helper:", error);
    throw error;
  }
};

export default sendEmail;
