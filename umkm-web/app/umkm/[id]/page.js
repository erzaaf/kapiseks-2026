import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UMKM, KATEGORI_META } from "@/data/umkm";

export function generateStaticParams() {
  return UMKM.map((u) => ({ id: String(u.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const u = UMKM.find((x) => String(x.id) === String(id));
  return { title: u ? u.nama : "UMKM" };
}

export default async function DetailUmkm({ params }) {
  const { id } = await params;
  const u = UMKM.find((x) => String(x.id) === String(id));
  if (!u) notFound();

  const meta = KATEGORI_META[u.kategori];
  const lainnya = UMKM.filter(
    (x) => x.kategori === u.kategori && x.id !== u.id
  ).slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <div className="page-head">
          <div className="container">
            <Link href="/umkm" className="back-link">
              &larr; Kembali ke Direktori
            </Link>
          </div>
        </div>

        <section className="detail-wrap" style={{ paddingTop: 8 }}>
          <div className="container detail-grid">
            <div className="detail-main">
              <div className={"detail-banner " + meta.img}>{meta.emoji}</div>
              <div className="detail-body">
                <span className={meta.chip}>{u.kategori}</span>
                <h1 className="detail-title">{u.nama}</h1>
                <span className="detail-owner">Milik {u.pemilik}</span>
                <p className="detail-desc">{u.deskripsi}</p>

                <div className="detail-section">
                  <div className="detail-label">Produk / Layanan</div>
                  <p className="detail-text">{u.produk}</p>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Alamat</div>
                  <p className="detail-text">
                    {u.alamat} &mdash; Dusun 6, Desa Way Huwi
                  </p>
                </div>
                <div className="detail-section">
                  <div className="detail-label">Jam Operasional</div>
                  <p className="detail-text">{u.jam}</p>
                </div>
              </div>
            </div>

            <aside className="side-card">
              <span className="side-head">Informasi Kontak</span>
              <div className="side-row">
                <span className="side-ico">&#128205;</span>
                <div className="fact-body">
                  <span className="side-label">Lokasi</span>
                  <span className="side-value">{u.rt}</span>
                </div>
              </div>
              <div className="side-row">
                <span className="side-ico">&#128222;</span>
                <div className="fact-body">
                  <span className="side-label">Telepon</span>
                  <span className="side-value">{u.telepon}</span>
                </div>
              </div>
              <div className="side-row">
                <span className="side-ico">&#128100;</span>
                <div className="fact-body">
                  <span className="side-label">Pemilik</span>
                  <span className="side-value">{u.pemilik}</span>
                </div>
              </div>
              <a className="btn btn-primary side-btn" href={"tel:" + u.telepon}>
                Hubungi Pemilik Usaha &rarr;
              </a>

              {lainnya.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div className="detail-label">
                    {u.kategori} lain di Dusun 6
                  </div>
                  {lainnya.map((l) => (
                    <Link
                      key={l.id}
                      href={"/umkm/" + l.id}
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--green-dark)",
                        padding: "6px 0",
                      }}
                    >
                      {l.nama} &rarr;
                    </Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
