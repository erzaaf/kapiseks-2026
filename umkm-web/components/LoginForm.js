"use client";

import { useState } from "react";
import Link from "next/link";

/* Shell login — backend otentikasi menyusul (NextAuth + database) */
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!email.trim() || !pass.trim()) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }
    setError(
      "Otentikasi backend belum aktif pada tahap frontend ini."
    );
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          className="input"
          id="email"
          type="email"
          placeholder="nama@desawayhuwi.id"
          autocomplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="password">Kata Sandi</label>
        <input
          className="input"
          id="password"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
      </div>

      {error && <div className="auth-error">{error}</div>}

      <div className="auth-actions">
        <button className="btn btn-primary btn-lg btn-wide" type="submit">
          Masuk &rarr;
        </button>
      </div>

      <div className="role-note">
        <span><b>Perangkat desa</b> — kelola data UMKM seluruh Dusun 6.</span>
        <span><b>Pelaku UMKM</b> — perbarui profil usaha milik sendiri (mendatang).</span>
      </div>
    </form>
  );
}
