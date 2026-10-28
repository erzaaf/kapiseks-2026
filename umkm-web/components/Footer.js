import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="nav-brand">
            <div className="brand-text">
              <span className="brand-title">UMKM Way Huwi</span>
              <span className="brand-sub">Dusun 6</span>
            </div>
          </div>
          <p className="footer-desc">
            Website informasi &amp; pendataan UMKM Dusun 6, Desa Way Huwi,
            Kecamatan Jati Agung, Kabupaten Lampung Selatan, Provinsi Lampung.
          </p>
        </div>
        <div className="footer-col">
          <span className="footer-head">Kontak</span>
          <span className="footer-link">Purnomo — Kepala Dusun 6</span>
          <span className="footer-link">0857-6877-726</span>
          <span className="footer-link">Way Huwi, Lampung Selatan</span>
        </div>
        <div className="footer-col">
          <span className="footer-head">Tautan</span>
          <Link className="footer-link" href="/umkm">
            Direktori UMKM
          </Link>
          <Link className="footer-link" href="/panduan">
            Panduan Usaha
          </Link>
          <Link className="footer-link" href="/masuk">
            Login Perangkat Desa
          </Link>
        </div>
        <div className="footer-col">
          <span className="footer-head">Tim Pengembang</span>
          <span className="footer-link">
            Kelompok 4 — Kapita Selekta Informatika
          </span>
          <span className="footer-link">Teknik Informatika ITERA — 2026</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span className="copyright">
          &copy; 2026 Kelompok 4 Kapita Selekta — ITERA
        </span>
        <span className="copyright muted">
          Digitalisasi Pendataan UMKM Berbasis Web
        </span>
      </div>
    </footer>
  );
}
