"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function go() {
    const query = q.trim();
    router.push("/umkm" + (query ? "?q=" + encodeURIComponent(query) : ""));
  }

  return (
    <div className="hero-search">
      <div className="search-field">
        <span className="search-icon">&#128269;</span>
        <input
          className="search-input"
          type="text"
          placeholder="Cari nama usaha atau pemilik…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") go();
          }}
        />
      </div>
      <button className="btn btn-primary" onClick={go}>
        Cari UMKM
      </button>
    </div>
  );
}
