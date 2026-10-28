# Kapita Selekta 2026 — Desa Way Huwi

Proyek Kapita Selekta — Kelompok 4: **Website Informasi UMKM Dusun 6, Desa Way Huwi**.

## Isi Proyek

| Folder / File | Keterangan |
|---|---|
| `design/` | Desain HTML beranda (navbar, hero, footer) + mockup panel admin versi awal |
| `panel-desa/` | Panel admin terpadu — 1 file (`index.html`, Tailwind + JS): login, kelola data UMKM per RT, iuran bulanan per RT dengan total |
| `backup-design-html-v1/` | Salinan desain versi pertama (sebelum direvisi) |
| `*.pkt`, `p4-*`, `p5-*` | Simulasi jaringan Cisco Packet Tracer (VLAN, OSPF, RIP, DHCP) |
| `konfig_vlan_jarkom.txt` | Konfigurasi CLI jaringan |
| `seb_bot/` | Bot pendamping |
| `server.py` | Server lokal untuk preview desain (port 8778, no-cache) |

## Panel Desa (panel-desa/index.html)

Buka langsung di browser (atau via Live Server). Login dummy: **pemdes / desa123**.

- **Kelola Data UMKM** — tambah/ubah/hapus + pencarian, filter kategori, dibagi per RT (RT 05, RT 05A, RT 06, RT 06A)
- **Iuran Bulanan** — buku pencatatan iuran per RT: 12 kolom bulan, klik sel untuk mencatat/menghapus pembayaran, baris jumlah + total, dropdown tahun
- Data tersimpan di `localStorage` (dummy, belum ada backend)

## Anggota

Kelompok 4 — Kapita Selekta, ITERA 2026.
