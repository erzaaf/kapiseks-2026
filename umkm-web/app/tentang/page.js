import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Tentang Desa" };

export default function Tentang() {
  return (
    <>
      <Navbar />
      <main>
        <div className="page-head">
          <div className="container">
            <h1 className="page-title">Tentang Desa Way Huwi</h1>
            <p className="page-sub">
              Profil desa, kondisi UMKM, dan target SDGs yang dipegang proyek
              digitalisasi pendataan UMKM ini.
            </p>
          </div>
        </div>

        <section className="section">
          <div className="container tentang-grid" style={{ paddingTop: 0 }}>
            <div className="tentang-copy">
              <h2 className="section-title">Profil Desa</h2>
              <p className="section-sub">
                Desa Way Huwi berada di Kecamatan Jati Agung, Kabupaten
                Lampung Selatan, Provinsi Lampung. Warganya beragam mata
                pencaharian: kuliner, perdagangan, kerajinan, jasa, hingga
                olahan hasil pertanian seperti gula semut.
              </p>
              <p className="section-sub">
                Di Dusun 6, pendataan UMKM masih dilakukan manual menggunakan
                buku. Data tercatat: nama usaha, pemilik, jenis usaha, alamat,
                dan informasi lainnya, tersebar pada catatan masing-masing RT
                &mdash; menyulitkan rekapitulasi dan pengambilan kebijakan desa.
              </p>
              <Link href="/umkm" className="btn btn-primary">
                Jelajahi Direktori UMKM &rarr;
              </Link>
            </div>
            <div className="tentang-facts">
              <div className="fact-row">
                <span className="fact-ico">&#128205;</span>
                <div className="fact-body">
                  <span className="fact-label">Kecamatan / Kabupaten</span>
                  <span className="fact-value">Jati Agung / Lampung Selatan</span>
                </div>
              </div>
              <div className="fact-row">
                <span className="fact-ico">&#128506;</span>
                <div className="fact-body">
                  <span className="fact-label">Fokus Wilayah</span>
                  <span className="fact-value">Dusun 6 (RT 05 s.d. RT 06A)</span>
                </div>
              </div>
              <div className="fact-row">
                <span className="fact-ico">&#128100;</span>
                <div className="fact-body">
                  <span className="fact-label">Kontak Person</span>
                  <span className="fact-value">Purnomo — 0857-6877-726</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Target SDG Desa</h2>
              <p className="section-sub">
                Mengapa website ini penting bagi desa.
              </p>
            </div>
            <div className="sdgs-grid">
              <div className="sdgs-card">
                <span className="sdgs-badge">SDG 8</span>
                <span className="sdgs-title">
                  Pekerjaan Layak dan Pertumbuhan Ekonomi
                </span>
                <span className="sdgs-indicator">Target 8.3</span>
                <p className="sdgs-desc">
                  Mendorong kegiatan produktif, kewirausahaan, kreativitas dan
                  inovasi, serta mendorong formalisasi dan pertumbuhan usaha
                  mikro, kecil, dan menengah &mdash; termasuk melalui akses
                  terhadap layanan keuangan.
                </p>
              </div>
              <div className="sdgs-card">
                <span className="sdgs-indicator">Indikator Proyek</span>
                <span className="sdgs-title">
                  Hasil yang diharapkan di Dusun 6
                </span>
                <ul className="article-list">
                  <li>
                    Direktori UMKM berbasis web yang dapat diakses publik.
                  </li>
                  <li>
                    Informasi usaha tersaji lengkap dan terstruktur.
                  </li>
                  <li>
                    Fitur pencarian berdasarkan nama, pemilik, dan kategori
                    usaha.
                  </li>
                  <li>
                    Data terpusat sehingga desa mudah melakukan rekapitulasi.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="kontak" style={{ minHeight: "auto", padding: "56px 0 72px" }}>
          <div className="container">
            <div className="cta-card">
              <div className="cta-copy">
                <h2 className="cta-title">Butuh informasi lebih lanjut?</h2>
                <p className="cta-desc">
                  Hubungi perangkat Dusun 6 untuk pendaftaran UMKM atau
                  pertanyaan seputar pengelolaan data.
                </p>
              </div>
              <div className="cta-actions">
                <a className="cta-contact" href="tel:08576877726">
                  &#128222; Purnomo &mdash; 0857-6877-726
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
