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
  console.log("\n👥 1. Membuat data user...");

  await prisma.user.createMany({
    data: [
      {
        name: "Administrator",
        email: "admin@mediapelajar.id",
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
      },
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
        isVerified: false,
      },
      {
        name: "Dr. Ahmad Fauzi",
        email: "fauzi@mediapelajar.id",
        password: hashedPassword,
        role: "KOL",
        isVerified: true,
      },
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
  // 2. SEED KATEGORI & TAG
  // ==========================================
  console.log("\n📂 2. Membuat data Kategori & Tag...");

  await prisma.category.createMany({
    data: [
      {
        name: "Pendidikan",
        slug: "pendidikan",
        description: "Berita seputar dunia pendidikan pelajar",
      },
      {
        name: "Teknologi",
        slug: "teknologi",
        description: "Inovasi dan teknologi untuk pelajar",
      },
      {
        name: "Kegiatan Sekolah",
        slug: "kegiatan-sekolah",
        description: "Event dan aktivitas di sekolah",
      },
      {
        name: "Prestasi",
        slug: "prestasi",
        description: "Pencapaian dan lomba pelajar",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.tag.createMany({
    data: [
      { name: "OSN", slug: "osn" },
      { name: "Beasiswa", slug: "beasiswa" },
      { name: "Lomba", slug: "lomba" },
      { name: "Coding", slug: "coding" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Data Kategori dan Tag berhasil dimasukkan!");

  // ==========================================
  // 3. SEED ARTIKEL (Penting untuk Dashboard)
  // ==========================================
  console.log("\n📝 3. Membuat data Artikel dummy...");

  // Ambil ID user jurnalis dan kategori untuk relasi database
  const jurnalisUser = await prisma.user.findFirst({
    where: { role: "JURNALIS" },
  });
  const kategoriPendidikan = await prisma.category.findFirst({
    where: { slug: "pendidikan" },
  });
  const kategoriTeknologi = await prisma.category.findFirst({
    where: { slug: "teknologi" },
  });
  const kategoriPrestasi = await prisma.category.findFirst({
    where: { slug: "prestasi" },
  });

  if (
    jurnalisUser &&
    kategoriPendidikan &&
    kategoriTeknologi &&
    kategoriPrestasi
  ) {
    await prisma.article.createMany({
      data: [
        // --- Artikel PUBLISHED (Untuk Statistik & Chart) ---
        {
          title: "Dampak AI dalam Pendidikan Modern di Indonesia",
          slug: "dampak-ai-dalam-pendidikan-modern",
          excerpt:
            "Kecerdasan buatan mulai merambah dunia pendidikan. Apakah ini ancaman atau peluang...",
          content: "Isi artikel lengkap tentang dampak AI dalam pendidikan...",
          status: "PUBLISHED",
          views: 1250,
          authorId: jurnalisUser.id,
          categoryId: kategoriPendidikan.id,
        },
        {
          title: "Tips Sukses Menghadapi Olimpiade Sains Nasional",
          slug: "tips-sukses-menghadapi-osn",
          excerpt:
            "Persiapan matang adalah kunci. Berikut adalah panduan lengkap dari para juara OSN...",
          content:
            "Isi artikel lengkap tentang tips dan trik menghadapi OSN...",
          status: "PUBLISHED",
          views: 3800,
          authorId: jurnalisUser.id,
          categoryId: kategoriPrestasi.id,
        },

        // --- Artikel PENDING_REVIEW (Untuk Antrean Moderasi di Dashboard Admin) ---
        {
          title: "Eksplorasi Budaya: Festival Seni Pelajar Jawa Barat",
          slug: "eksplorasi-budaya-festival-seni-pelajar",
          excerpt:
            "Festival seni tahunan kembali digelar dengan antusiasme tinggi dari berbagai sekolah...",
          content: "Isi artikel lengkap tentang festival seni pelajar...",
          status: "PENDING_REVIEW",
          views: 0,
          authorId: jurnalisUser.id,
          categoryId: kategoriPendidikan.id,
        },
        {
          title: "Pemanasan Global: Fakta vs Mitos di Kalangan Pelajar",
          slug: "pemanasan-global-fakta-vs-mitos",
          excerpt:
            "Banyak informasi menyesatkan tentang perubahan iklim. Mari kita bedah fakta ilmiahnya...",
          content:
            "Isi artikel lengkap tentang fakta dan mitos pemanasan global...",
          status: "PENDING_REVIEW",
          views: 0,
          authorId: jurnalisUser.id,
          categoryId: kategoriTeknologi.id,
        },

        // --- Artikel DRAFT ---
        {
          title: "Review Film: Perjuangan Pelajar di Daerah Terpencil",
          slug: "review-film-perjuangan-pelajar",
          excerpt:
            "Film ini mengangkat kisah nyata yang menginspirasi tentang semangat belajar...",
          content: "Isi artikel lengkap tentang review film...",
          status: "DRAFT",
          views: 0,
          authorId: jurnalisUser.id,
          categoryId: kategoriPendidikan.id,
        },
      ],
      skipDuplicates: true,
    });
    console.log("✅ Data artikel dummy berhasil dibuat!");
  } else {
    console.log(
      "⚠️ Gagal membuat artikel: Pastikan User Jurnalis dan Kategori sudah ada di database.",
    );
  }

  // ==========================================
  // 4. SEED OTP (Dummy untuk testing user belum verifikasi)
  // ==========================================
  console.log("\n🔑 4. Membuat data OTP dummy...");
  const unverifiedUsers = await prisma.user.findMany({
    where: { isVerified: false },
  });

  if (unverifiedUsers.length > 0) {
    const otpData = unverifiedUsers.map((user) => ({
      email: user.email,
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      userId: user.id,
    }));

    await prisma.otp.createMany({ data: otpData, skipDuplicates: true });
    console.log(`✅ ${otpData.length} data OTP berhasil dibuat.`);
  }

  // ==========================================
  // 5. RINGKASAN DATA
  // ==========================================
  console.log("\n📊 5. Ringkasan Data di Database:");
  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();
  const tagCount = await prisma.tag.count();
  const articleCount = await prisma.article.count();
  const pendingCount = await prisma.article.count({
    where: { status: "PENDING_REVIEW" },
  });
  const publishedCount = await prisma.article.count({
    where: { status: "PUBLISHED" },
  });
  const draftCount = await prisma.article.count({ where: { status: "DRAFT" } });

  console.log(`   ├─ Total User     : ${userCount}`);
  console.log(`   ├─ Total Kategori : ${categoryCount}`);
  console.log(`   ├─ Total Tag      : ${tagCount}`);
  console.log(`   └─ Total Artikel  : ${articleCount}`);
  console.log(`        • Published  : ${publishedCount}`);
  console.log(`        • Pending    : ${pendingCount}`);
  console.log(`        • Draft      : ${draftCount}`);

  console.log("\n🔑 Password default untuk semua user: 'password123'");
  console.log(
    "✅ Seeding selesai! Dashboard seharusnya sudah tidak loading lagi.",
  );
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
