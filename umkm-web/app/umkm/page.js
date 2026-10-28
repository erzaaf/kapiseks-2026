import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DirektoriFull from "@/components/DirektoriFull";

export const metadata = { title: "Direktori UMKM" };

export default function UmkmPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="page-head">
          <div className="container">
            <h1 className="page-title">Direktori UMKM Dusun 6</h1>
            <p className="page-sub">
              Kumpulan UMKM yang telah didata dan dikelola perangkat desa
              &mdash; dikelompokkan berdasarkan jenis usaha.
            </p>
          </div>
        </div>

        <section className="section" style={{ paddingTop: 24 }}>
          <div className="container">
            <Suspense
              fallback={<p className="dir-empty">Memuat direktori&hellip;</p>}
            >
              <DirektoriFull />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
