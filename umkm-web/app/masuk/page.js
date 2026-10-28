import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Masuk" };

export default function Masuk() {
  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <div>
          <h1 className="auth-title">Masuk</h1>
          <p className="auth-sub" style={{ marginTop: 8 }}>
            Kelola data &amp; profil UMKM Dusun 6 &mdash; Desa Way Huwi
          </p>
        </div>

        <LoginForm />

        <p className="auth-note">
          Halaman ini untuk perangkat desa dan pelaku UMKM &mdash;{" "}
          <Link
            href="/"
            style={{ color: "var(--green-dark)", fontWeight: 600 }}
          >
            &larr; Kembali ke Beranda
          </Link>
        </p>
      </div>
    </main>
  );
}
