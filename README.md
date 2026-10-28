# Kapita Selekta 2026 — Website UMKM Way Huwi

**Digitalisasi Pendataan UMKM Berbasis Web untuk Meningkatkan Efektivitas Pengelolaan dan Akses Informasi di Desa Way Huwi** — Kelompok 4, Kapita Selekta Informatika ITERA 2026.

## Struktur Repo

| Folder | Keterangan |
|---|---|
| `umkm-web/` | **Frontend utama** — Next.js (sesuai proposal): beranda, tentang desa, direktori UMKM, detail UMKM, panduan usaha, halaman masuk |
| `backup-design-html-v1/` | Backup desain HTML statis versi pertama (design system asli) |

## Teknologi (sesuai proposal)

1. Framework: **Next.js** (App Router)
2. Bahasa: **JavaScript**
3. Styling: **CSS** (design system di `umkm-web/app/globals.css`)
4. Database: **PostgreSQL (Neon)** — *tahap backend, data saat ini masih dummy di `umkm-web/data/umkm.js`*
5. Desain UI/UX: **Figma**
6. Kolaborasi: **GitHub**

## Fitur Frontend (dummy data, backend menyusul)

- **Beranda** — hero + pencarian + slider rekomendasi + statistik dinamis dari data
- **Direktori UMKM** (`/umkm`) — pencarian, filter kategori, pengelompokan per jenis usaha
- **Detail UMKM** (`/umkm/[id]`) — profil usaha, produk, alamat, kontak, jam operasional
- **Tentang Desa** (`/tentang`) — profil desa + target SDG 8.3
- **Panduan Usaha** (`/panduan`) — artikel pemasaran digital, permodalan, legalitas NIB
- **Masuk** (`/masuk`) — shell login perangkat desa & pelaku UMKM (otentikasi backend menyusul)

## Menjalankan

```bash
cd umkm-web
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Tim

Kelompok 4 — Kapita Selekta Informatika, ITERA 2026.
