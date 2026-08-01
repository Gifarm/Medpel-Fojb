import nodemailer from "nodemailer";

// Konfigurasi transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: false, // true untuk 465, false untuk port lain (587)
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// ==========================================
// 1. Fungsi Kirim Email OTP (Verifikasi)
// ==========================================
export async function sendOtpEmail(email: string, code: string) {
  try {
    console.log("\n📧 Attempting to send OTP email to:", email);

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
            .container { background-color: #ffffff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
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

    console.log("✅ Email OTP BERHASIL dikirim ke:", email);
    return true;
  } catch (error) {
    console.error("❌ Gagal mengirim email OTP:", error);
    return false;
  }
}

// ==========================================
// 2. Fungsi Kirim Email Reset Password
// ==========================================
export async function sendResetPasswordEmail(
  email: string,
  newPassword: string,
) {
  try {
    console.log("\n📧 Attempting to send Reset Password email to:", email);

    await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        `"Media Pelajar" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: "Password Baru Anda - Media Pelajar",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { background-color: #ffffff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .logo { text-align: center; margin-bottom: 20px; }
            .password-box { background-color: #FFFEF5; border: 2px solid #FCC200; color: #233982; font-size: 28px; font-weight: bold; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 2px; }
            .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; color: #991b1b; padding: 12px; font-size: 14px; margin: 20px 0; border-radius: 4px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e2e2; font-size: 12px; color: #6B7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h2 style="color: #233982; margin: 0;">Media Pelajar</h2>
            </div>
            <p>Halo,</p>
            <p>Kami menerima permintaan untuk mereset password akun Media Pelajar Anda. Berikut adalah password baru Anda:</p>
            
            <div class="password-box">${newPassword}</div>

            <div class="warning">
              <strong>⚠️ Penting:</strong> Segera login dan ubah password Anda di pengaturan akun demi keamanan. Jangan bagikan password ini kepada siapa pun.
            </div>

            <p>Jika Anda tidak meminta perubahan ini, abaikan email ini atau hubungi tim support kami segera.</p>
            <div class="footer">
              <p>&copy; 2026 Media Pelajar. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Email Reset Password BERHASIL dikirim ke:", email);
    return true;
  } catch (error) {
    console.error("❌ Gagal mengirim email Reset Password:", error);
    return false;
  }
}
