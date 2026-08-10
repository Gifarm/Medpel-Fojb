import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Mulai mengisi data dummy Media Pelajar...");

  // Hash password default untuk semua user
  const defaultPassword = "password123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // ==========================================
  // 1. SEED USER (Admin, Jurnalis, KOL, Member)
  // ==========================================
  console.log("\n👥 Membuat data user...");

  await prisma.user.createMany({
    data: [
      // --- ADMIN ---
      {
        name: "Administrator",
        email: "admin@mediapelajar.id",
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
      },

      // --- JURNALIS ---
      {
        name: "Budi Santoso",
        email: "budi@mediapelajar.id",
        password: hashedPassword,
        role: "JURNALIS",
        isVerified: true,
      },
      {
        name: "Siska Putri",
        email: "siska@mediapelajar.id",
        password: hashedPassword,
        role: "JURNALIS",
        isVerified: true,
      },

      {
        name: "Dewi Lestari",
        email: "dewi@mediapelajar.id",
        password: hashedPassword,
        role: "JURNALIS",
        isVerified: false, // Belum verifikasi email
      },

      // --- KOL (Key Opinion Leader / Kontributor Ahli) ---
      {
        name: "Dr. Ahmad Fauzi",
        email: "fauzi@mediapelajar.id",
        password: hashedPassword,
        role: "KOL",
        isVerified: true,
      },
      {
        name: "Prof. Siti Rahayu",
        email: "rahayu@mediapelajar.id",
        password: hashedPassword,
        role: "KOL",
        isVerified: true,
      },

      // --- MEMBER (User Biasa / Pembaca) ---
      {
        name: "Rina Kartika",
        email: "rina@mediapelajar.id",
        password: hashedPassword,
        role: "MEMBER",
        isVerified: true,
      },
      {
        name: "Dimas Prasetyo",
        email: "dimas@mediapelajar.id",
        password: hashedPassword,
        role: "MEMBER",
        isVerified: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Data user berhasil dimasukkan!");

  // ==========================================
  // 2. SEED OTP (Dummy untuk testing)
  // ==========================================
  console.log("\n🔑 Membuat data OTP dummy...");

  // Ambil user yang belum terverifikasi untuk dibuatkan OTP dummy
  const unverifiedUsers = await prisma.user.findMany({
    where: { isVerified: false },
  });

  if (unverifiedUsers.length > 0) {
    const otpData = unverifiedUsers.map((user) => ({
      email: user.email,
      code: Math.floor(100000 + Math.random() * 900000).toString(), // 6 digit random
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Expire 5 menit dari sekarang
      userId: user.id,
    }));

    await prisma.otp.createMany({
      data: otpData,
      skipDuplicates: true,
    });

    console.log(
      `✅ ${otpData.length} data OTP berhasil dibuat untuk user belum verifikasi.`,
    );
  } else {
    console.log("️ Tidak ada user yang belum verifikasi, skip OTP seeding.");
  }

  // ==========================================
  // 3. RINGKASAN DATA
  // ==========================================
  console.log("\n📊 Ringkasan Data:");
  const userCount = await prisma.user.count();
  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  const jurnalisCount = await prisma.user.count({
    where: { role: "JURNALIS" },
  });
  const kolCount = await prisma.user.count({ where: { role: "KOL" } });
  const memberCount = await prisma.user.count({ where: { role: "MEMBER" } });
  const otpCount = await prisma.otp.count();

  console.log(`   Total User     : ${userCount}`);
  console.log(`   ├─ Admin       : ${adminCount}`);
  console.log(`   ├─ Jurnalis    : ${jurnalisCount}`);
  console.log(`   ├─ KOL         : ${kolCount}`);
  console.log(`   └─ Member      : ${memberCount}`);
  console.log(`   Total OTP      : ${otpCount}`);

  console.log("\n Password default untuk semua user: 'password123'");
  console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
