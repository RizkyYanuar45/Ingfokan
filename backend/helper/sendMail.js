import nodemailer from "nodemailer";

const sendEmail = async (to, subject, content, isHTML = false) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"Support Ingfokan" <${process.env.SMTP_USER}>`,
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

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
