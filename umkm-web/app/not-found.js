import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", display: "grid", gap: 12 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>
          404 &mdash; Halaman tidak ditemukan
        </h1>
        <p style={{ color: "var(--muted)" }}>
          UMKM atau halaman yang dicari tidak tersedia.
        </p>
        <Link href="/umkm" className="btn btn-primary">
          Ke Direktori UMKM &rarr;
        </Link>
      </div>
    </main>
  );
}
