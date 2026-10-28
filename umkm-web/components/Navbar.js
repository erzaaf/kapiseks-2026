"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang Desa" },
  { href: "/umkm", label: "Direktori UMKM" },
  { href: "/panduan", label: "Panduan Usaha" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <header className={"navbar" + (open ? " open" : "")}>
      <div className="container navbar-inner">
        <Link href="/" className="nav-brand" onClick={() => setOpen(false)}>
          <div className="brand-text">
            <span className="brand-title">UMKM Way Huwi</span>
            <span className="brand-sub">Dusun 6</span>
          </div>
        </Link>

        <div className="nav-menu">
          <nav className="nav-links">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={"nav-link" + (isActive(l.href) ? " active" : "")}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link href="/masuk" className="btn btn-ghost" onClick={() => setOpen(false)}>
              Masuk
            </Link>
            <Link href="/#kontak" className="btn btn-primary" onClick={() => setOpen(false)}>
              Kontak Desa
            </Link>
          </div>
        </div>

        <button
          className="nav-toggle"
          aria-label="Buka menu"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
