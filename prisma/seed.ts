/* eslint-disable @typescript-eslint/no-explicit-any */
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
  // 3. SEED ARTIKEL (Dengan Relasi Tags menggunakan Upsert)
  // ==========================================
  console.log("\n📝 3. Membuat data Artikel dummy beserta Tags...");

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
    const articlesData = [
      {
        slug: "dampak-ai-dalam-pendidikan-modern",
        title: "Dampak AI dalam Pendidikan Modern di Indonesia",
        excerpt:
          "Kecerdasan buatan mulai merambah dunia pendidikan. Apakah ini ancaman atau peluang...",
        content: "Isi artikel lengkap tentang dampak AI dalam pendidikan...",
        status: "PUBLISHED",
        views: 1250,
        categoryId: kategoriPendidikan.id,
        tagSlugs: ["coding"],
      },
      {
        slug: "tips-sukses-menghadapi-osn",
        title: "Tips Sukses Menghadapi Olimpiade Sains Nasional",
        excerpt:
          "Persiapan matang adalah kunci. Berikut adalah panduan lengkap dari para juara OSN...",
        content: "Isi artikel lengkap tentang tips dan trik menghadapi OSN...",
        status: "PUBLISHED",
        views: 3800,
        categoryId: kategoriPrestasi.id,
        tagSlugs: ["osn", "lomba"],
      },
      {
        slug: "eksplorasi-budaya-festival-seni-pelajar",
        title: "Eksplorasi Budaya: Festival Seni Pelajar Jawa Barat",
        excerpt:
          "Festival seni tahunan kembali digelar dengan antusiasme tinggi dari berbagai sekolah...",
        content: "Isi artikel lengkap tentang festival seni pelajar...",
        status: "PENDING_REVIEW",
        views: 0,
        categoryId: kategoriPendidikan.id,
        tagSlugs: ["lomba"],
      },
      {
        slug: "pemanasan-global-fakta-vs-mitos",
        title: "Pemanasan Global: Fakta vs Mitos di Kalangan Pelajar",
        excerpt:
          "Banyak informasi menyesatkan tentang perubahan iklim. Mari kita bedah fakta ilmiahnya...",
        content:
          "Isi artikel lengkap tentang fakta dan mitos pemanasan global...",
        status: "PENDING_REVIEW",
        views: 0,
        categoryId: kategoriTeknologi.id,
        tagSlugs: ["beasiswa"],
      },
      {
        slug: "review-film-perjuangan-pelajar",
        title: "Review Film: Perjuangan Pelajar di Daerah Terpencil",
        excerpt:
          "Film ini mengangkat kisah nyata yang menginspirasi tentang semangat belajar...",
        content: "Isi artikel lengkap tentang review film...",
        status: "DRAFT",
        views: 0,
        categoryId: kategoriPendidikan.id,
        tagSlugs: ["osn"],
      },
    ];

    for (const data of articlesData) {
      await prisma.article.upsert({
        where: { slug: data.slug },
        update: {
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          status: data.status as any,
          views: data.views,
          categoryId: data.categoryId,
          tags: { set: data.tagSlugs.map((slug) => ({ slug })) },
        },
        create: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          status: data.status as any,
          views: data.views,
          authorId: jurnalisUser.id,
          categoryId: data.categoryId,
          tags: { connect: data.tagSlugs.map((slug) => ({ slug })) },
        },
      });
    }
    console.log(
      "✅ Data artikel dummy beserta tags berhasil dibuat/diperbarui!",
    );
  } else {
    console.log(
      "⚠️ Gagal membuat artikel: Pastikan User Jurnalis dan Kategori sudah ada di database.",
    );
  }

  // ==========================================
  // 4. SEED KOMENTAR (BARU: Untuk testing Moderasi Komentar)
  // ==========================================
  console.log("\n💬 4. Membuat data Komentar dummy...");

  const memberUser1 = await prisma.user.findFirst({
    where: { email: "rina@mediapelajar.id" },
  });
  const memberUser2 = await prisma.user.findFirst({
    where: { email: "dimas@mediapelajar.id" },
  });
  const articleAI = await prisma.article.findFirst({
    where: { slug: "dampak-ai-dalam-pendidikan-modern" },
  });
  const articleOSN = await prisma.article.findFirst({
    where: { slug: "tips-sukses-menghadapi-osn" },
  });
  const articlePemanasan = await prisma.article.findFirst({
    where: { slug: "pemanasan-global-fakta-vs-mitos" },
  });

  if (
    memberUser1 &&
    memberUser2 &&
    jurnalisUser &&
    articleAI &&
    articleOSN &&
    articlePemanasan
  ) {
    await prisma.comment.createMany({
      data: [
        {
          content:
            "Artikelnya sangat inspiratif! Saya jadi termotivasi untuk mengikuti lomba OSN tahun ini. Terima kasih kak!",
          status: "APPROVED",
          userId: memberUser1.id,
          articleId: articleOSN.id,
        },
        {
          content:
            "Konten tidak berkualitas, penulisnya pasti tidak riset dulu. Sampah!",
          status: "REJECTED",
          userId: memberUser2.id,
          articleId: articlePemanasan.id,
        },
        {
          content:
            "Terima kasih atas masukannya, akan saya pertimbangkan untuk artikel selanjutnya.",
          status: "APPROVED",
          userId: jurnalisUser.id,
          articleId: articleAI.id,
        },
        {
          content:
            "Kunjungi website kami untuk mendapatkan hadiah jutaan rupiah!!! Klik di sini -> [link]",
          status: "HIDDEN",
          userId: memberUser1.id,
          articleId: articleOSN.id,
        },
        {
          content:
            "Min, kapan artikel tentang festival seni akan dipublikasikan? Sudah submit dari kemarin.",
          status: "PENDING",
          userId: memberUser2.id,
          articleId: articleAI.id,
        },
        {
          content:
            "Penjelasannya sangat mudah dipahami, terutama bagian dampak AI untuk pelajar SMP.",
          status: "PENDING",
          userId: memberUser1.id,
          articleId: articleAI.id,
        },
      ],
    });
    console.log("✅ Data komentar dummy berhasil dimasukkan!");
  } else {
    console.log(
      "⚠️ Gagal membuat komentar: Pastikan User dan Artikel sudah ada di database.",
    );
  }

  // ==========================================
  // 5. SEED OTP (Dummy untuk testing user belum verifikasi)
  // ==========================================
  console.log("\n🔑 5. Membuat data OTP dummy...");
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
  // 6. RINGKASAN DATA
  // ==========================================
  console.log("\n📊 6. Ringkasan Data di Database:");
  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();
  const tagCount = await prisma.tag.count();
  const articleCount = await prisma.article.count();
  const commentCount = await prisma.comment.count(); // <-- BARU
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
  console.log(`   ├─ Total Artikel  : ${articleCount}`);
  console.log(`   └─ Total Komentar : ${commentCount}`); // <-- BARU
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
