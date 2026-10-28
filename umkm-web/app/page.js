import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import RecommSlider from "@/components/RecommSlider";
import { UMKM, KATEGORI, KATEGORI_META } from "@/data/umkm";

/* Statistik harga langsung dari data (dummy sementara → nanti dari DB) */
const TOTAL = UMKM.length;
const JML_KATEGORI = new Set(UMKM.map((u) => u.kategori)).size;

export default function Beranda() {
  return (
    <>
      <Navbar />
      <main>
        {/* ============ HERO ============ */}
        <section className="hero" id="beranda">
          <div className="container hero-inner">
            <div className="hero-copy">
              <h1 className="hero-title">
                Satu Platform Digital untuk{" "}
                <span className="accent">Potensi UMKM</span> Desa Way Huwi
              </h1>
              <p className="hero-desc">
                Pendataan UMKM Dusun 6 kini digital dan terstruktur. Cari,
                kelompokkan, dan pelajari usaha lokal &mdash; dari kuliner
                hingga kerajinan &mdash; langsung dari website yang mudah
                diakses semua orang.
              </p>
              <HeroSearch />
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-value">{TOTAL}</span>
                  <span className="stat-label">UMKM Terdata</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-value">{JML_KATEGORI}</span>
                  <span className="stat-label">Kategori Usaha</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Terbuka untuk Publik</span>
                </div>
              </div>
            </div>

            <RecommSlider />
          </div>

          <div className="container hero-categories">
            <span className="cat-label">Kategori usaha:</span>
            <div className="cat-chips">
              {KATEGORI.map((k) => {
                const meta = KATEGORI_META[k];
                const jml = UMKM.filter((u) => u.kategori === k).length;
                return (
                  <Link key={k} href={"/umkm?cat=" + encodeURIComponent(k)}>
                    <button className={meta.chip}>
                      {meta.emoji} {k} &middot; {jml}
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ TENTANG (ringkas) ============ */}
        <section className="section section-alt" id="tentang">
          <div className="container tentang-grid">
            <div className="tentang-copy">
              <h2 className="section-title">Profil Desa Way Huwi</h2>
              <p className="section-sub">
                Desa Way Huwi berlokasi di Kecamatan Jati Agung, Kabupaten
                Lampung Selatan. Masyarakatnya memiliki beragam mata
                pencaharian, mulai dari usaha mikro, kecil, dan menengah (UMKM)
                di bidang kuliner, perdagangan, kerajinan, hingga usaha
                lainnya.
              </p>
              <Link href="/tentang" className="btn btn-primary">
                Profil &amp; SDGs Desa &rarr;
              </Link>
            </div>
            <div className="tentang-facts">
              <div className="fact-row">
                <span className="fact-ico">&#128205;</span>
                <div className="fact-body">
                  <span className="fact-label">Lokasi</span>
                  <span className="fact-value">
                    Way Huwi, Jati Agung, Lampung Selatan
                  </span>
                </div>
              </div>
              <div className="fact-row">
                <span className="fact-ico">&#127891;</span>
                <div className="fact-body">
                  <span className="fact-label">Mitra</span>
                  <span className="fact-value">
                    Pemerintah Desa &amp; Pelaku UMKM
                  </span>
                </div>
              </div>
              <div className="fact-row">
                <span className="fact-ico">&#128506;</span>
                <div className="fact-body">
                  <span className="fact-label">Fokus Wilayah</span>
                  <span className="fact-value">Dusun 6</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ DIREKTORI (preview) ============ */}
        <section className="section" id="direktori">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Direktori UMKM Dusun 6</h2>
              <p className="section-sub">
                Kumpulan data UMKM yang telah didata dan dikelola pihak desa
                &mdash; lengkap dengan nama usaha, pemilik, dan jenis usaha.
              </p>
            </div>

            <div className="dir-grid">
              {UMKM.slice(0, 6).map((u) => {
                const meta = KATEGORI_META[u.kategori];
                return (
                  <article className="umkm-card" key={u.id}>
                    <div className={"card-img " + meta.img}>
                      <span className="img-emoji">{meta.emoji}</span>
                    </div>
                    <div className="card-body">
                      <span className={meta.chip}>{u.kategori}</span>
                      <div className="card-title">{u.nama}</div>
                      <div className="card-meta">Milik {u.pemilik}</div>
                      <div className="card-foot">
                        <span className="card-loc">
                          &#128205; {u.rt} &middot; {u.alamat.split(",")[0]}
                        </span>
                        <Link className="card-link" href={"/umkm/" + u.id}>
                          Lihat Detail &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="section-cta">
              <Link
                href="/umkm"
                className="btn btn-outline btn-lg"
              >
                Lihat Semua {TOTAL} UMKM
              </Link>
            </div>
          </div>
        </section>

        {/* ============ CTA / KONTAK ============ */}
        <section className="section" id="kontak">
          <div className="container">
            <div className="cta-card">
              <div className="cta-copy">
                <h2 className="cta-title">Punya usaha di Dusun 6?</h2>
                <p className="cta-desc">
                  Daftarkan UMKM Anda kepada perangkat desa agar tampil di
                  direktori dan lebih mudah dikenal masyarakat luas &mdash;
                  gratis.
                </p>
              </div>
              <div className="cta-actions">
                <Link href="/masuk" className="btn bg-amber-text">
                  Daftarkan / Kelola UMKM
                </Link>
                <a
                  className="cta-contact"
                  href="tel:08576877726"
                >
                  &#128222; Purnomo &mdash; Kepala Dusun 6
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
