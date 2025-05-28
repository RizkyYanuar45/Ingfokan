import sequelize from "../config/database.js";
import bcrypt from "bcrypt";
import user from "../models/user.js";

import banner from "../models/banner.js";
import author from "../models/author.js";
import category from "../models/category.js";
import favorite from "../models/favorite.js";
import Comment from "../models/comment.js";
import article from "../models/article.js";
import setupAssociations from "../config/association.js";
const seeder = async () => {
  try {
    setupAssociations();

    await sequelize.sync({ force: true }); //ini agar bila ada tabel sebelumnya akan dihapus kemudian dibuatkan

    console.log("tabel direstart");

    const encryptedPassword = await bcrypt.hash("password123", 10);
    await user.bulkCreate([
      {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: encryptedPassword,
        avatar: "images/janedoe.jpg",
        role: "admin",
        username: "JD",
      },
      {
        name: "John Smith",
        email: "rizkyanuar4@gmail.com",
        password: encryptedPassword,
        avatar: "images/johnsmith.jpg",
        role: "user",
        username: "John Smith Uwu",
      },
    ]);
    await category.bulkCreate([
      {
        name: "animal",
        thumbnail: "images/animal.jpg",
        slug: "animal",
      },
      {
        name: "economy",
        thumbnail: "images/economy.jpg",
        slug: "economy",
      },
      {
        name: "education",
        thumbnail: "images/education.jpg",
        slug: "education",
      },
      {
        name: "healthy",
        thumbnail: "images/healthy.jpg",
        slug: "healty",
      },
      {
        name: "politic",
        thumbnail: "images/politic.jpg",
        slug: "politic",
      },
      {
        name: "sport",
        thumbnail: "images/sport.jpg",
        slug: "sport",
      },
      {
        name: "trending",
        thumbnail: "images/trending.png",
        slug: "trending",
      },
      { name: "food", thumbnail: "images/food.jpg", slug: "food" },
      { name: "fashion", thumbnail: "images/fashion.jpg", slug: "fashion" },
      {
        name: "technology",
        thumbnail: "images/technology.jpg",
        slug: "technology",
      },
    ]);
    await author.bulkCreate([
      {
        name: "Wijayanto",
        email: "Wijayanto@gmail.com",
        avatar: "images/wijayanto.jpg",
        slug: "wijayanto",
      },
      {
        name: "Anton Ivanov",
        email: "Antonuhuy@gmail.com",
        avatar: "images/anton.jpg",
        slug: "anton",
      },
      {
        name: "Irma",
        email: "irma@gmail.com",
        avatar: "images/irma.jpg",
        slug: "irma",
      },
      {
        name: "Nurul",
        email: "Nurul@gmail.com",
        avatar: "images/nurul.jpg",
        slug: "nurul",
      },
    ]);
    await article.bulkCreate([
      {
        title: "Kucing",
        content:
          "!lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        thumbnail: "images/kucing.jpg",
        category_id: 1,
        author_id: 1,
        published_date: new Date(),
        slug: "kucing",
      },
      {
        title: "Anjing",
        content:
          "!lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        thumbnail: "images/anjing.jpg",
        category_id: 1,
        author_id: 2,
        published_date: new Date(),
        slug: "anjing",
      },
      {
        title: "Dampak Inflasi Global",
        content:
          "Pembahasan seputar inflasi global dan pengaruhnya terhadap perekonomian Indonesia...",
        thumbnail: "images/inflasi.jpg",
        category_id: 2,
        author_id: 1,
        published_date: new Date(),
        slug: "dampak-inflasi-global",
      },

      // education - ID: 3
      {
        title: "Pendidikan Jarak Jauh Efektifkah?",
        content:
          "Analisis seberapa efektif pendidikan jarak jauh dalam meningkatkan kualitas belajar...",
        thumbnail: "images/pendidikan.jpg",
        category_id: 3,
        author_id: 2,
        published_date: new Date(),
        slug: "pendidikan-jarak-jauh",
      },

      // healthy - ID: 4
      {
        title: "Manfaat Air Putih",
        content:
          "Air putih sangat penting untuk kesehatan tubuh. Artikel ini membahas manfaatnya...",
        thumbnail: "images/airputih.jpg",
        category_id: 4,
        author_id: 3,
        published_date: new Date(),
        slug: "manfaat-air-putih",
      },

      // politic - ID: 5
      {
        title: "Pemilu 2024 dan Tantangannya",
        content:
          "Pemilu serentak 2024 diprediksi membawa berbagai tantangan baru bagi demokrasi...",
        thumbnail: "images/pemilu.jpg",
        category_id: 5,
        author_id: 4,
        published_date: new Date(),
        slug: "pemilu-2024",
      },

      // sport - ID: 6
      {
        title: "Timnas U-23 Lolos Final",
        content:
          "Keberhasilan Timnas Indonesia U-23 menembus final Piala Asia menjadi sorotan publik...",
        thumbnail: "images/timnas.jpg",
        category_id: 6,
        author_id: 1,
        published_date: new Date(),
        slug: "timnas-u23-final",
      },

      // trending - ID: 7 (4 articles)
      {
        title: "Fenomena Citayam Fashion Week",
        content:
          "Citayam Fashion Week menjadi fenomena budaya anak muda Jakarta...",
        thumbnail: "images/citayam.jpg",
        category_id: 7,
        author_id: 2,
        published_date: new Date(),
        slug: "citayam-fashion-week",
      },
      {
        title: "Viral! Makanan Ekstrem Dicoba Influencer",
        content:
          "Seorang influencer mencoba makanan ekstrem dari berbagai daerah dan viral di media sosial...",
        thumbnail: "images/makanan-ekstrem.jpg",
        category_id: 7,
        author_id: 3,
        published_date: new Date(),
        slug: "makanan-ekstrem-viral",
      },
      {
        title: "Challenge Unik di TikTok",
        content:
          "Tren challenge baru di TikTok menarik perhatian netizen karena keunikannya...",
        thumbnail: "images/tiktok-challenge.jpg",
        category_id: 7,
        author_id: 4,
        published_date: new Date(),
        slug: "challenge-tiktok",
      },
      {
        title: "Artis A Menikah Diam-diam",
        content:
          "Publik dikejutkan dengan kabar pernikahan artis A yang dilakukan secara tertutup...",
        thumbnail: "images/artis-menikah.jpg",
        category_id: 7,
        author_id: 1,
        published_date: new Date(),
        slug: "artis-menikah",
      },

      // food - ID: 8
      {
        title: "Resep Nasi Goreng Kampung",
        content:
          "Nasi goreng kampung adalah salah satu masakan favorit. Berikut resep lengkapnya...",
        thumbnail: "images/nasigoreng.jpg",
        category_id: 8,
        author_id: 2,
        published_date: new Date(),
        slug: "resep-nasi-goreng",
      },

      // fashion - ID: 9
      {
        title: "Tren Busana Muslim 2025",
        content:
          "Mode busana muslim terus berkembang. Ini dia tren yang akan hits di 2025...",
        thumbnail: "images/busana.jpg",
        category_id: 9,
        author_id: 3,
        published_date: new Date(),
        slug: "tren-busana-muslim",
      },

      // technology - ID: 10
      {
        title: "AI dan Masa Depan Dunia Kerja",
        content:
          "Artificial Intelligence diprediksi akan menggantikan banyak jenis pekerjaan...",
        thumbnail: "images/ai.jpg",
        category_id: 10,
        author_id: 4,
        published_date: new Date(),
        slug: "ai-dunia-kerja",
      },
    ]);
    return console.log("berhasil seed ke database");
  } catch (error) {
    return console.log(error);
  } finally {
    await sequelize.close();
  }
};

seeder();
