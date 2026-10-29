/* ============================================================
   Data UMKM Dusun 6 — dummy sementara.
   Nanti diganti query dari database (PostgreSQL / Neon).
   ============================================================ */

export const KATEGORI = [
  "Kuliner",
  "Perdagangan",
  "Kerajinan",
  "Jasa",
  "Lainnya",
];

export const KATEGORI_META = {
  "Kuliner": {
    emoji: "\u{1F372}",
    chip: "chip chip-green",
    img: "card-img-green",
  },
  "Perdagangan": {
    emoji: "\u{1F392}",
    chip: "chip chip-amber",
    img: "card-img-amber",
  },
  "Kerajinan": {
    emoji: "\u{1FA9E}",
    chip: "chip chip-blue",
    img: "card-img-blue",
  },
  "Jasa": {
    emoji: "\u{1F527}",
    chip: "chip chip-neutral",
    img: "card-img-neutral",
  },
  "Lainnya": {
    emoji: "\u{2699}\u{FE0F}",
    chip: "chip chip-neutral",
    img: "card-img-neutral",
  },
};

export const UMKM = [
  {
    id: 1,
    nama: "Warung Bu Sari",
    pemilik: "Sari Wulandari",
    kategori: "Kuliner",
    rt: "RT 05",
    alamat: "Jl. Raya Way Huwi, Dusun 6",
    deskripsi:
      "Warung makan rumahan dengan menu andalan pecel, emping, dan minuman dingin. Berdiri sejak 2015 dan menjadi tempat makan favorit warga Dusun 6.",
    produk: "Pecel, emping, aneka minuman",
    telepon: "0857-6001-1001",
    jam: "06.00 \u2013 17.00 setiap hari",
  },
  {
    id: 2,
    nama: "Toko Kelontong Jaya",
    pemilik: "Budi Santoso",
    kategori: "Perdagangan",
    rt: "RT 05A",
    alamat: "Perumahan Asri 1 Blok A, RT 05A",
    deskripsi:
      "Toko kelontong lengkap: sembako, bahan dapur, alat tulis, dan kebutuhan harian lainnya. Melayani pembelian langsung maupun pesan-antar bagi warga sekitar.",
    produk: "Sembako, kebutuhan harian",
    telepon: "0857-6001-1002",
    jam: "07.00 \u2013 21.00 setiap hari",
  },
  {
    id: 3,
    nama: "Kerajinan Anyaman Pak Min",
    pemilik: "Suhairi Minang",
    kategori: "Kerajinan",
    rt: "RT 06",
    alamat: "Gg. Kenanga, Jl. Desa Way Huwi, RT 06",
    deskripsi:
      "Kerajinan anyaman bambu: keranjang, tudung saji, kipas, dan tas. Menerima pesanan langsung maupun kontrak jumlah besar untuk kebutuhan acara desa.",
    produk: "Keranjang, tudung saji, tas anyaman",
    telepon: "0857-6001-1003",
    jam: "08.00 \u2013 17.00 Senin\u2013Sabtu",
  },
  {
    id: 4,
    nama: "Kue Basah Mama Nia",
    pemilik: "Nia Kartika",
    kategori: "Kuliner",
    rt: "RT 05",
    alamat: "Samping Masjid Al-Hikmah, RT 05",
    deskripsi:
      "Kue basah rasa khas: kue lumpur, putu ayu, dan bolu kukus. Cocok menjadi sajian acara warga maupun hantaran sesuai pesanan.",
    produk: "Kue lumpur, putu ayu, bolu kukus",
    telepon: "0857-6001-1004",
    jam: "05.00 \u2013 12.00 setiap hari",
  },
  {
    id: 5,
    nama: "Bengkel Rusli Motor",
    pemilik: "Rusli Andika",
    kategori: "Jasa",
    rt: "RT 06A",
    alamat: "Jl. Pendidikan, depan SDN 1, RT 06A",
    deskripsi:
      "Servis ringan dan besar sepeda motor, tune-up, ganti ban, serta penjualan part dan oli. Tersedia layanan panggilan ke rumah bagi warga sekitar.",
    produk: "Servis motor, part & oli",
    telepon: "0857-6001-1005",
    jam: "08.00 \u2013 20.00 Senin\u2013Sabtu",
  },
  {
    id: 6,
    nama: "Es Lilin Barokah",
    pemilik: "Rahmi Putri",
    kategori: "Perdagangan",
    rt: "RT 06A",
    alamat: "Griya Way Huwi Blok C, RT 06A",
    deskripsi:
      "Es lilin aneka rasa \u2014 mangga, durian, dan nangka \u2014 diproduksi sendiri setiap hari. Melayani pesanan jajaran bazar desa maupun pernikahan warga.",
    produk: "Es lilin aneka rasa",
    telepon: "0857-6001-1006",
    jam: "09.00 \u2013 18.00 setiap hari",
  },
  {
    id: 7,
    nama: "Gula Semut Bu Rahma",
    pemilik: "Rahma Zahira",
    kategori: "Lainnya",
    rt: "RT 06",
    alamat: "Sentra gula semut, RT 06",
    deskripsi:
      "Hasil olahan kelompok tani Dusun 6 berupa gula semut (gula kempa) murni dari nira kelapa. Dipasarkan ke pembeli lokal dan menjadi pasokan beberapa bakeri di kota.",
    produk: "Gula semut asli nira kelapa",
    telepon: "0857-6001-1007",
    jam: "08.00 \u2013 16.00 Senin\u2013Jumat",
  },
  {
    id: 8,
    nama: "Laundry Banjar Sari",
    pemilik: "Dwi Lestari",
    kategori: "Jasa",
    rt: "RT 06A",
    alamat: "Jl. Melati No. 4, RT 06A",
    deskripsi:
      "Pencucian kilat dan reguler untuk pakaian, sepatu, hingga sarung dan tikar. Antar-jemput gratis bagi pelanggan tetap di wilayah Dusun 6.",
    produk: "Cuci kilat, cuci sepatu, antar-jemput",
    telepon: "0857-6001-1008",
    jam: "07.00 \u2013 21.00 setiap hari",
  },
];

/* Panel perangkat desa: seed data singkat (lokasi tanpa imbuhan RT) */
export const PANEL_SEED = UMKM.map((u) => ({
  id: u.id,
  nama: u.nama,
  pemilik: u.pemilik,
  kategori: u.kategori,
  rt: u.rt,
  lokasi: u.alamat.replace(/,?\s*RT\s*\d{2}A?\s*$/, ""),
}));

/* Panel perangkat desa: contoh pencatatan iuran awal (Sep & Okt 2026) */
export const IURAN_SEED = {
  "1|2026-09": 10000, "2|2026-09": 10000, "3|2026-09": 10000, "4|2026-09": 10000, "5|2026-09": 10000, "6|2026-09": 10000,
  "1|2026-10": 10000, "2|2026-10": 10000, "3|2026-10": 10000, "4|2026-10": 10000, "5|2026-10": 10000, "6|2026-10": 10000,
  "7|2026-10": 5000,
};

/* Artikel panduan pengembangan usaha (fitur #5 proposal) */
export const PANDUAN = [
  {
    id: 1,
    tag: "Pemasaran Digital",
    judul: "Tips Pemasaran Digital untuk UMKM Desa",
    meta: "Panduan dasar \u2022 5 menit baca",
    isi: [
      "Promosi lewat mulut ke mulut memang terbukti, tapi pemasaran digital membuka pasar jauh di luar desa. Awalannya sederhana: aktifkan WhatsApp Business dan pastikan profil produk terisi lengkap.",
      "Langkah praktis memulai pemasaran digital:",
      [
        "Gunakan WhatsApp Business dengan katalog produk dan nama usaha yang jelas.",
        "Foto produk dengan cahaya pagi di dekat jendela \u2014 cukup HP biasa, pengeditan ringan saja.",
        "Gabung ke grup pedagang desa/dusun dan posting rutin, bukan tiap jam.",
        "Minta pelanggan memberi ulasan \u2014 tangkapan layar ulasan jadi bahan kepercayaan bagi calon pembeli.",
      ],
      "Konsistensi lebih penting daripada jumlah: satu konten berkualitas setiap minggu lebih baik daripada posting setiap hari lalu berhenti di tengah jalan.",
    ],
  },
  {
    id: 2,
    tag: "Permodalan",
    judul: "Mengakses Permodalan: PNM Mekaar & KUR",
    meta: "Panduan \u2022 4 menit baca",
    isi: [
      "Tiga jalur permodalan yang paling mudah diakses pelaku usaha desa adalah kelompok PNM Mekaar, KUR (Kredit Usaha Rakyat), dan pinjaman koperasi desa.",
      "Yang perlu disiapkan sebelum mengajukan:",
      [
        "KTP dan Kartu Keluarga yang masih berlaku.",
        "Catatan kecil penjualan sehari-hari \u2014 buku sederhana pun cukup.",
        "Informasi jenis usaha dan perkiraan kebutuhan modalnya.",
      ],
      "Kepala Dusun 6 dapat membantu menghubungkan pelaku usaha dengan petugas PNM setempat dan petugas bank yang menangani KUR.",
    ],
  },
  {
    id: 3,
    tag: "Legalitas",
    judul: "Legalitas Usaha: Cara Mengurus NIB",
    meta: "Panduan \u2022 6 menit baca",
    isi: [
      "Nomor Induk Berusaha (NIB) adalah identitas usaha paling dasar \u2014 gratis, cukup online, dan syaratnya sederhana.",
      "Langkah mengurus NIB lewat OSS (Online Single Submission):",
      [
        "Siapkan KTP, NPWP (kalau ada), dan nomor HP aktif.",
        "Registrasi akun di oss.go.id menggunakan alamat email pribadi.",
        "Isi identitas usaha dan pilih jenis perizinan dengan teliti.",
        "NIB terbit beberapa menit kemudian dalam bentuk dokumen PDF.",
      ],
      "Dengan NIB, pelaku usaha dapat mendaftar KUR, mengikuti pasar/bazar yang mensyaratkan legalitas, dan menawarkan produk untuk kontrak di luar desa.",
    ],
  },
];
