import nodemailer from "nodemailer";

// Konfigurasi transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: false, // true untuk 465, false untuk port lain
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendOtpEmail(email: string, code: string) {
  try {
    // Log untuk debugging
    console.log("\n Attempting to send email to:", email);
    console.log("🔑 Email config:", {
      host: process.env.EMAIL_SERVER_HOST,
      user: process.env.EMAIL_SERVER_USER,
      hasPassword: !!process.env.EMAIL_SERVER_PASSWORD,
    });

    // Kirim email (baik development maupun production)
    await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        `"Media Pelajar" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: "Kode OTP Verifikasi - Media Pelajar",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { background-color: #ffffff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
            .logo { text-align: center; margin-bottom: 20px; }
            .otp-code { background-color: #FCC200; color: #233982; font-size: 32px; font-weight: bold; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e2e2; font-size: 12px; color: #6B7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h2 style="color: #233982; margin: 0;">Media Pelajar</h2>
            </div>
            <p>Halo,</p>
            <p>Terima kasih telah mendaftar di Media Pelajar. Gunakan kode OTP berikut untuk verifikasi email Anda:</p>
            <div class="otp-code">${code}</div>
            <p>Kode ini berlaku selama <strong>5 menit</strong>.</p>
            <p>Jika Anda tidak meminta kode ini, abaikan email ini.</p>
            <div class="footer">
              <p>&copy; 2026 Media Pelajar. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Email BERHASIL dikirim ke:", email);
  } catch (error) {
    console.error("❌ Gagal mengirim email:", error);
    console.log("\n💡 Kemungkinan penyebab:");
    console.log(
      "1. EMAIL_SERVER_USER atau EMAIL_SERVER_PASSWORD di .env belum diisi dengan benar",
    );
    console.log(
      "2. Jika pakai Gmail, pastikan menggunakan 'App Password', bukan password biasa",
    );
    console.log("3. Cek koneksi internet Anda\n");
  }
}
