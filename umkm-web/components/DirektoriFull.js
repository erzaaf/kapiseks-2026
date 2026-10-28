"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UMKM, KATEGORI, KATEGORI_META } from "@/data/umkm";

/* Direktori lengkap: pencarian + filter kategori + pengelompokan jenis usaha */
export default function DirektoriFull() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [cat, setCat] = useState(params.get("cat") || "Semua");

  useEffect(() => {
    const qp = params.get("q");
    const cp = params.get("cat");
    if (qp !== null) setQ(qp);
    if (cp !== null) setCat(cp);
  }, [params]);

  const cocok = useMemo(() => {
    const qu = q.trim().toLowerCase();
    return UMKM.filter((u) => {
      const okCat = cat === "Semua" || u.kategori === cat;
      const okQ =
        qu === "" ||
        u.nama.toLowerCase().includes(qu) ||
        u.pemilik.toLowerCase().includes(qu) ||
        u.produk.toLowerCase().includes(qu) ||
        u.kategori.toLowerCase().includes(qu);
      return okCat && okQ;
    });
  }, [q, cat]);

  const grup = useMemo(() => {
    return KATEGORI.map((k) => ({
      kategori: k,
      items: cocok.filter((u) => u.kategori === k),
    })).filter((g) => g.items.length > 0);
  }, [cocok]);

  return (
    <div>
      <div className="dir-search">
        <div className="search-field">
          <span className="search-icon">&#128269;</span>
          <input
            className="search-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama usaha, pemilik, atau produk…"
          />
        </div>
      </div>

      <div className="dir-filter">
        <div className="dir-chips">
          {["Semua"].concat(KATEGORI).map((k) => (
            <button
              key={k}
              className={"chip " + (cat === k ? "chip-solid" : "chip-outline")}
              onClick={() => setCat(k)}
            >
              {k}
              {k !== "Semua" && " · " + UMKM.filter((u) => u.kategori === k).length}
            </button>
          ))}
        </div>
      </div>

      {grup.length === 0 ? (
        <p className="dir-empty">
          &#128530; Tidak ada UMKM yang cocok, coba kata kunci atau kategori
          lain.
        </p>
      ) : (
        grup.map((g) => (
          <div key={g.kategori}>
            <div className="group-head">
              <span className="group-title">{g.kategori}</span>
              <span className="group-count">{g.items.length} usaha</span>
              <span className="group-line" />
            </div>
            <div className="dir-grid">
              {g.items.map((u) => {
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
                        <span className="card-loc">&#128205; {u.alamat}</span>
                        <Link
                          className="card-link"
                          href={"/umkm/" + u.id}
                        >
                          Lihat Detail &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
