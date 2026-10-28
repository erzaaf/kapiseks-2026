import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PANDUAN } from "@/data/umkm";

export const metadata = { title: "Panduan Usaha" };

export default function Panduan() {
  return (
    <>
      <Navbar />
      <main>
        <div className="page-head">
          <div className="container">
            <h1 className="page-title">Panduan Usaha</h1>
            <p className="page-sub">
              Informasi, artikel, dan panduan pengembangan usaha untuk pelaku
              UMKM Desa Way Huwi &mdash; pemasaran digital, permodalan, hingga
              legalitas.
            </p>
          </div>
        </div>

        <section className="section" style={{ paddingTop: 24 }}>
          <div className="panduan-wrap">
            {PANDUAN.map((a) => (
              <article className="article-card" key={a.id}>
                <div className="article-top">
                  <span className="chip chip-green">{a.tag}</span>
                  <span className="article-meta">{a.meta}</span>
                </div>
                <h2 className="article-title">{a.judul}</h2>
                <div className="article-body">
                  {a.isi.map((par, i) =>
                    Array.isArray(par) ? (
                      <ul className="article-list" key={i}>
                        {par.map((li, j) => (
                          <li key={j}>{li}</li>
                        ))}
                      </ul>
                    ) : (
                      <p key={i}>{par}</p>
                    )
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
