"use client";

import Link from "next/link";
import { useState } from "react";
import { UMKM, KATEGORI_META } from "@/data/umkm";

/* Rekomendasi: slider geser halus, urutan berputar tiap hari */
export default function RecommSlider() {
  /* Urutan berbeda tiap hari: putar array berdasar jumlah hari sejak epoch */
  const dayOffset = Math.floor(Date.now() / 86400000) % UMKM.length;
  const ordered = UMKM.slice(dayOffset).concat(UMKM.slice(0, dayOffset));

  const [index, setIndex] = useState(0);
  const n = ordered.length;

  return (
    <div className="hero-visual">
      <div className="recomm-head">
        <span className="recomm-title">⭐ Rekomendasi</span>
        <div className="recomm-nav">
          <button
            className="recomm-btn"
            aria-label="Rekomendasi sebelumnya"
            onClick={() => setIndex((index - 1 + n) % n)}
          >
            &larr;
          </button>
          <button
            className="recomm-btn"
            aria-label="Rekomendasi berikutnya"
            onClick={() => setIndex((index + 1) % n)}
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="recomm-viewport" style={{ position: "relative" }}>
        <div
          className="recomm-track"
          style={{ transform: "translateX(" + -index * 100 + "%)" }}
        >
          {ordered.map((u) => {
            const meta = KATEGORI_META[u.kategori];
            return (
              <div className="recomm-slide" key={u.id}>
                <div className="hero-card-main" style={{ width: "100%" }}>
                  <Link href={"/umkm/" + u.id} style={{ display: "block" }}>
                    <div className={"card-img " + meta.img}>
                      <span className="img-emoji">{meta.emoji}</span>
                    </div>
                    <div className="hero-card-body">
                      <span className={meta.chip}>{u.kategori}</span>
                      <div className="card-title">{u.nama}</div>
                      <div className="card-meta">Milik {u.pemilik}</div>
                      <div className="card-meta muted">{u.alamat}</div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="recomm-dots">
          {ordered.map((_, i) => (
            <span
              key={i}
              className={"dot" + (i === index ? " active" : "")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
