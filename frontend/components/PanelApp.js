"use client";

import { useEffect, useState } from "react";
import { KATEGORI, KATEGORI_META, UMKM, PANEL_SEED, IURAN_SEED } from "@/data/umkm";

/* ============================================================
   Panel Perangkat Desa — Kelola Data + Iuran Bulanan
   Frontend-only: state React + localStorage (backend menyusul)
   ============================================================ */

const RTS = ["RT 05", "RT 05A", "RT 06", "RT 06A"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const SESS_KEY = "umkmweb_sess";
const DATA_KEY = "umkmweb_umkm";
const IURAN_KEY = "umkmweb_iuran";
const USER = "pemdes";
const PASS = "desa123";
const DISPLAY_USER = { nama: "Purnomo", role: "Perangkat Desa" };

const rp = (n) => (n || 0).toLocaleString("id-ID");
const monthKey = (y, m) => y + "-" + String(m + 1).padStart(2, "0");

function loadLS(key, fallback) {
  try {
    const v = JSON.parse(window.localStorage.getItem(key));
    return v === null || v === undefined ? fallback : v;
  } catch {
    return fallback;
  }
}

export default function PanelApp() {
  const [mounted, setMounted] = useState(false);
  const [masuk, setMasuk] = useState(false);

  /* data utama */
  const [data, setData] = useState(PANEL_SEED);
  const [iuran, setIuran] = useState(IURAN_SEED);

  /* login */
  const [lUser, setLUser] = useState("");
  const [lPass, setLPass] = useState("");
  const [loginErr, setLoginErr] = useState(false);

  /* UI state */
  const [tab, setTab] = useState("kelola");
  const [rtKelola, setRtKelola] = useState("Semua");
  const [cat, setCat] = useState("Semua");
  const [q, setQ] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [rt, setRt] = useState("RT 05");
  const [editId, setEditId] = useState(null);
  const [umkmOpen, setUmkmOpen] = useState(false);
  const [paying, setPaying] = useState(null);

  /* form modal UMKM */
  const [fNama, setFNama] = useState("");
  const [fPemilik, setFPemilik] = useState("");
  const [fKategori, setFKategori] = useState("Kuliner");
  const [fRt, setFRt] = useState("RT 05");
  const [fLokasi, setFLokasi] = useState("");
  const [umkmErr, setUmkmErr] = useState("");

  /* form modal iuran */
  const [fNominal, setFNominal] = useState(10000);

  /* muat dari localStorage saat mount (hindari hydration mismatch) */
  useEffect(() => {
    const d = loadLS(DATA_KEY, null);
    if (Array.isArray(d) && d.length > 0) setData(d);
    const i = loadLS(IURAN_KEY, null);
    if (i && typeof i === "object" && !Array.isArray(i)) setIuran(i);
    if (window.localStorage.getItem(SESS_KEY) === "1") setMasuk(true);
    setMounted(true);
  }, []);

  /* simpan perubahan */
  useEffect(() => {
    if (mounted) window.localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data, mounted]);
  useEffect(() => {
    if (mounted) window.localStorage.setItem(IURAN_KEY, JSON.stringify(iuran));
  }, [iuran, mounted]);

  if (!mounted) return null;

  /* ================= Statistik ================= */
  function renderStats() {
    if (tab === "kelola") {
      const list = data.filter((d) => rtKelola === "Semua" || (d.rt || RTS[0]) === rtKelola);
      const suf = rtKelola === "Semua" ? "" : " \u2014 " + rtKelola;
      return [{ num: list.length, label: "Total UMKM terdata" + suf }];
    }
    const now = new Date();
    const rtNow = rt || RTS[0];
    const list = data.filter((d) => (d.rt || RTS[0]) === rtNow);
    const mk = monthKey(year, now.getFullYear() === year ? now.getMonth() : 0);
    let sumMonth = 0, sudah = 0, belum = 0, sumYear = 0;
    for (const d of list) {
      const v = iuran[d.id + "|" + mk] || 0;
      if (v > 0) sudah++; else belum++;
      sumMonth += v;
      for (let m = 0; m < 12; m++) sumYear += iuran[d.id + "|" + monthKey(year, m)] || 0;
    }
    const blnName = MONTHS[now.getFullYear() === year ? now.getMonth() : 0];
    return [
      { num: "Rp " + rp(sumMonth), label: "Iuran " + blnName + " \u2014 " + rtNow },
      { num: sudah, label: "Sudah bayar \u2014 " + rtNow },
      { num: belum, label: "Belum bayar \u2014 " + rtNow },
      { num: "Rp " + rp(sumYear), label: "Total tahun " + year + " \u2014 " + rtNow },
    ];
  }

  /* ================= Daftar kelola (filter) ================= */
  const cocok = data.filter((d) => {
    const qu = q.toLowerCase();
    const okRt = rtKelola === "Semua" || (d.rt || RTS[0]) === rtKelola;
    const okCat = cat === "Semua" || d.kategori === cat;
    const okQ =
      !qu ||
      d.nama.toLowerCase().includes(qu) ||
      d.pemilik.toLowerCase().includes(qu) ||
      d.lokasi.toLowerCase().includes(qu);
    return okRt && okCat && okQ;
  });

  /* ================= Daftar iuran ================= */
  const listRt = data.filter((d) => (d.rt || RTS[0]) === rt);
  const rtTotal = listRt.reduce((acc, d) => {
    for (let m = 0; m < 12; m++) acc += iuran[d.id + "|" + monthKey(year, m)] || 0;
    return acc;
  }, 0);
  const nowDate = new Date();
  const bulanBerjalan = nowDate.getFullYear() === year ? nowDate.getMonth() : -1;

  /* pilihan tahun: ±3 tahun + tahun & bulan yang punya data */
  const tahunOpts = (() => {
    const ys = new Set([year, new Date().getFullYear()]);
    for (const k of Object.keys(iuran)) ys.add(Number(k.split("|")[1].slice(0, 4)));
    for (let y = year - 3; y <= year + 1; y++) ys.add(y);
    return [...ys].map(Number).filter((x) => x >= 2020 && x <= 2100).sort((a, b) => a - b);
  })();

  /* ================= Aksi login ================= */
  function doLogin(e) {
    e.preventDefault();
    if (lUser.trim().toLowerCase() === USER && lPass === PASS) {
      setLoginErr(false);
      window.localStorage.setItem(SESS_KEY, "1");
      setMasuk(true);
    } else {
      setLoginErr(true);
    }
  }
  function doKeluar() {
    window.localStorage.removeItem(SESS_KEY);
    setLPass("");
    setMasuk(false);
  }

  /* ================= Aksi CRUD ================= */
  function bukaTambah() {
    setEditId(null);
    setUmkmOpen(true);
    setFNama(""); setFPemilik(""); setFKategori("Kuliner"); setFLokasi("");
    setFRt(rtKelola === "Semua" ? RTS[0] : rtKelola);
    setUmkmErr("");
  }
  function bukaUbah(id) {
    const d = data.find((x) => x.id === id);
    if (!d) return;
    setEditId(id);
    setUmkmOpen(true);
    setFNama(d.nama); setFPemilik(d.pemilik); setFKategori(d.kategori);
    setFRt(d.rt || RTS[0]); setFLokasi(d.lokasi);
    setUmkmErr("");
  }
  function simpanUmkm(e) {
    e.preventDefault();
    if (!fNama.trim() || !fPemilik.trim() || !fLokasi.trim()) {
      setUmkmErr("Nama usaha, pemilik, dan lokasi wajib diisi.");
      return;
    }
    if (editId === null) {
      const baru = {
        id: data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1,
        nama: fNama.trim(), pemilik: fPemilik.trim(), kategori: fKategori,
        rt: fRt, lokasi: fLokasi.trim(),
      };
      setData([baru].concat(data));
    } else {
      setData(data.map((d) =>
        d.id === editId
          ? { ...d, nama: fNama.trim(), pemilik: fPemilik.trim(), kategori: fKategori, rt: fRt, lokasi: fLokasi.trim() }
          : d
      ));
    }
    setUmkmOpen(false);
    setEditId(null);
  }
  function hapusUmkm(id) {
    const d = data.find((x) => x.id === id);
    if (!d) return;
    if (!window.confirm('Hapus "' + d.nama + '" dari direktori?')) return;
    setData(data.filter((x) => x.id !== id));
    setIuran(Object.fromEntries(Object.entries(iuran).filter(([k]) => k.split("|")[0] !== String(id))));
  }

  /* ================= Aksi iuran ================= */
  function tutupUmkm() {
    setUmkmOpen(false);
    setEditId(null);
    setUmkmErr("");
  }
  function bukaIuran(key, nama, bulanTeks) {
    setPaying({ key, nama, bulanTeks });
    setFNominal(iuran[key] > 0 ? iuran[key] : 10000);
  }
  function simpanIuran() {
    if (!paying) return;
    const v = Math.max(0, Number(fNominal) || 0);
    setIuran((prev) => {
      const nxt = { ...prev };
      if (v === 0) delete nxt[paying.key]; else nxt[paying.key] = v;
      return nxt;
    });
    setPaying(null);
  }
  function hapusIuran() {
    if (!paying) return;
    setIuran((prev) => {
      const nxt = { ...prev };
      delete nxt[paying.key];
      return nxt;
    });
    setPaying(null);
  }

  /* ================= LOGIN SCREEN ================= */
  if (!masuk) {
    return (
      <section
        className="auth-wrap"
        style={{ background: "linear-gradient(180deg, #F7FAF8 0%, #E7F5EF 100%)" }}
      >
        <div className="auth-card">
          <div>
            <h1 className="auth-title">Login Perangkat Desa</h1>
            <p className="auth-sub" style={{ marginTop: 8 }}>
              Kelola data &amp; iuran UMKM Dusun 6 &mdash; Desa Way Huwi
            </p>
          </div>
          <form className="auth-form" onSubmit={doLogin}>
            <div className="field">
              <label htmlFor="lUser">Nama Pengguna</label>
              <input
                className="input" id="lUser" type="text"
                placeholder="Contoh: pemdes" autoComplete="username"
                value={lUser} onChange={(e) => setLUser(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="lPass">Kata Sandi</label>
              <input
                className="input" id="lPass" type="password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" autoComplete="current-password"
                value={lPass} onChange={(e) => setLPass(e.target.value)}
              />
            </div>
            {loginErr && <p className="perr">Nama pengguna atau kata sandi salah.</p>}
            <button type="submit" className="btn btn-primary btn-lg btn-wide">
              Masuk ke Panel &rarr;
            </button>
          </form>
          <p className="auth-note">
            Akun demo: <b>pemdes</b> / <b>desa123</b>
          </p>
          <p className="auth-note" style={{ marginTop: -8 }}>
            Halaman khusus perangkat desa &mdash; Desa Way Huwi
          </p>
        </div>
      </section>
    );
  }

  /* ================= APP ================= */
  return (
    <div className="pwrap">
      {/* Navbar */}
      <header className="pnav">
        <div className="pnavin">
          <div>
            <span className="pbrand-title">UMKM Way Huwi</span>
            <span className="pbrand-sub">Dusun 6 &mdash; Panel Perangkat Desa</span>
          </div>
          <nav className="pnavtabs">
            <button className={"ptab" + (tab === "kelola" ? " aktif" : "")} onClick={() => setTab("kelola")}>
              Kelola Data
            </button>
            <button className={"ptab" + (tab === "iuran" ? " aktif" : "")} onClick={() => setTab("iuran")}>
              Iuran Bulanan
            </button>
          </nav>
          <div className="pnavr">
            <div className="puser">
              <span className="puser-ava">{DISPLAY_USER.nama[0]}</span>
              <span className="puser-info">
                <span className="puser-name">{DISPLAY_USER.nama}</span>
                <span className="puser-role">{DISPLAY_USER.role}</span>
              </span>
            </div>
            <button className="pbtn-keluar" onClick={doKeluar}>Keluar</button>
          </div>
        </div>
        {/* Tab mobile */}
        <nav className="pmobtabs pmobs">
          <button className={"ptab" + (tab === "kelola" ? " aktif" : "")} onClick={() => setTab("kelola")}>
            Kelola Data
          </button>
          <button className={"ptab" + (tab === "iuran" ? " aktif" : "")} onClick={() => setTab("iuran")}>
            Iuran Bulanan
          </button>
        </nav>
      </header>

      <main className="pmain">
        {/* Judul + tombol konteks tab */}
        <div className="pheadrow">
          <h1 className="ptitle">{tab === "kelola" ? "Kelola Data UMKM" : "Iuran Bulanan UMKM"}</h1>
          {tab === "kelola" ? (
            <button className="pbtn-primary" onClick={bukaTambah}>
              + Tambah UMKM
            </button>
          ) : (
            <div className="pyear">
              &#128197; Tahun:
              <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {tahunOpts.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Statistik */}
        <div className={"pstatgrid" + (renderStats().length === 1 ? " satu" : "")}>
          {renderStats().map((s, i) => (
            <div className="pstatcard" key={i}>
              <span className="pstat-title">{s.label}</span>
              <span className="pstat-num">{s.num}</span>
            </div>
          ))}
        </div>

        {/* ============ TAB: KELOLA ============ */}
        {tab === "kelola" && (
          <section>
            {/* pemilih RT */}
            <div className="punders pmt-6">
              {["Semua"].concat(RTS).map((r) => (
                <button
                  key={r}
                  className={"putab" + (rtKelola === r ? " aktif" : "")}
                  onClick={() => setRtKelola(r)}
                >
                  {r === "Semua" ? "Semua RT" : r}
                </button>
              ))}
            </div>
            {/* pencarian + kategori */}
            <div className="pbar">
              <div className="psearch">
                <span>&#128269;</span>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari nama usaha, pemilik, atau lokasi..."
                />
              </div>
              <div className="pchips">
                {["Semua"].concat(KATEGORI).map((k) => (
                  <button
                    key={k}
                    className={"pchip" + (cat === k ? " aktif" : "")}
                    onClick={() => setCat(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
            {/* tabel */}
            <div className="pcard">
              <div className="pscroll">
                <table className="ptable">
                  <thead>
                    <tr>
                      <th style={{ width: "42%" }}>UMKM</th>
                      <th>Kategori</th>
                      <th>Lokasi</th>
                      <th style={{ width: 88, textAlign: "right" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cocok.length === 0 && (
                      <tr>
                        <td colSpan={4} className="pempty">
                          Belum ada UMKM{rtKelola === "Semua" ? "" : " di " + rtKelola} yang cocok.
                        </td>
                      </tr>
                    )}
                    {cocok.map((d) => {
                      const meta = KATEGORI_META[d.kategori];
                      return (
                        <tr key={d.id}>
                          <td>
                            <div className="pcell-biz">
                              <span className={"pbiz-ava grad-" + d.kategori}>
                                {meta.emoji}
                              </span>
                              <div>
                                <div className="pbiz-name">{d.nama}</div>
                                <div className="pbiz-owner">{d.pemilik}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="pcat-txt">{d.kategori}</span>
                          </td>
                          <td style={{ color: "var(--muted)" }}>{d.lokasi}</td>
                          <td>
                            <div className="pactions">
                              <button className="pico-btn" title="Ubah" onClick={() => bukaUbah(d.id)}>&#9998;</button>
                              <button className="pico-btn pico-del" title="Hapus" onClick={() => hapusUmkm(d.id)}>&#128465;</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="pfoot">
                <span>
                  Menampilkan {cocok.length} dari {data.length} UMKM
                  {rtKelola === "Semua" ? "" : " \u2014 " + rtKelola}
                </span>
                <span>
                  &larr; Sebelumnya &nbsp;&bull;&nbsp; Halaman 1 dari{" "}
                  {Math.max(1, Math.ceil(data.length / 8))} &nbsp;&bull;&nbsp; Berikutnya &rarr;
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ============ TAB: IURAN ============ */}
        {tab === "iuran" && (
          <section>
            {/* pemilih RT */}
            <div className="punders" style={{ marginTop: 16 }}>
              {RTS.map((r) => (
                <button
                  key={r}
                  className={"putab" + (rt === r ? " aktif" : "")}
                  onClick={() => setRt(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="pinfo">
              <span>
                <b style={{ fontWeight: 800 }}>{rt}</b> &mdash; {listRt.length} UMKM terdata
              </span>
              <span style={{ color: "var(--muted)" }}>
                Tahun <b className="hijau">{year}</b>: <b className="hijau">Rp {rp(rtTotal)}</b>
              </span>
            </div>

            {/* tabel buku iuran */}
            <div className="pcard" style={{ marginTop: 12 }}>
              <div className="pscroll">
                <table className="ptable iutable">
                  <thead>
                    <tr>
                      <th className="c-no" style={{ width: 36 }}>No</th>
                      <th className="c-nama hnama">Nama Usaha</th>
                      {MONTHS.map((mn, m) => (
                        <th key={m} className={m === bulanBerjalan ? "bln-aktif" : ""} style={{ minWidth: 88 }}>
                          {mn}
                        </th>
                      ))}
                      <th className="hjum">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listRt.length === 0 && (
                      <tr>
                        <td colSpan={15} className="pempty">
                          Belum ada UMKM terdata di {rt}.
                        </td>
                      </tr>
                    )}
                    {listRt.map((d, idx) => {
                      let rowTotal = 0;
                      const sel = MONTHS.map((mn, m) => {
                        const key = d.id + "|" + monthKey(year, m);
                        const v = iuran[key] || 0;
                        rowTotal += v;
                        return { key, v, mn: mn + " " + year };
                      });
                      return (
                        <tr key={d.id}>
                          <td className="c-no" style={{ width: 36 }}>{idx + 1}</td>
                          <td className="c-nama">
                            <div className="pbiz-name" style={{ fontSize: 13, lineHeight: "16px" }}>{d.nama}</div>
                            <div className="pbiz-owner" style={{ lineHeight: "16px" }}>{d.pemilik}</div>
                          </td>
                          {sel.map((s) => (
                            <td
                              key={s.key}
                              className={"c-bln" + (s.v > 0 ? " c-blnterisi" : " kosong")}
                              style={{ padding: "10px 8px", cursor: "pointer" }}
                              onClick={() => bukaIuran(s.key, d.nama, s.mn)}
                            >
                              {s.v > 0 ? rp(s.v) : "\u2014"}
                            </td>
                          ))}
                          <td className="c-jum">{rp(rowTotal)}</td>
                        </tr>
                      );
                    })}
                    {/* baris jumlah */}
                    <tr className="row-jum">
                      <td className="c-no" style={{ width: 36 }}></td>
                      <td className="c-nama jum-label">Jumlah {rt}</td>
                      {MONTHS.map((mn, m) => {
                        let sum = 0;
                        for (const d of listRt) sum += iuran[d.id + "|" + monthKey(year, m)] || 0;
                        return (
                          <td key={m} className="jum-val" style={{ minWidth: 88, padding: "12px 8px" }}>
                            {sum > 0 ? rp(sum) : "\u2014"}
                          </td>
                        );
                      })}
                      <td className="c-jum">{rp(rtTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ============ Modal Tambah/Ubah UMKM ============ */}
      {umkmOpen && (
        <div className="pmodal" onClick={(e) => { if (e.target === e.currentTarget) tutupUmkm(); }}>
          <div className="pmodal-card">
            <div className="pmodal-head">
              <h2 className="pmodal-title">{editId === null ? "Tambah UMKM" : "Ubah UMKM"}</h2>
              <button className="pico-btn" onClick={tutupUmkm}>&#10005;</button>
            </div>
            <form onSubmit={simpanUmkm} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="pfield">
                <label className="plabel">Nama Usaha</label>
                <input className="input" value={fNama} onChange={(e) => setFNama(e.target.value)} placeholder="Contoh: Warung Bu Sari" />
              </div>
              <div className="pfield">
                <label className="plabel">Nama Pemilik</label>
                <input className="input" value={fPemilik} onChange={(e) => setFPemilik(e.target.value)} placeholder="Contoh: Sari Wulandari" />
              </div>
              <div className="prow-2">
                <div className="pfield">
                  <label className="plabel">Kategori</label>
                  <select className="input" value={fKategori} onChange={(e) => setFKategori(e.target.value)}>
                    {["Kuliner", "Perdagangan", "Kerajinan", "Jasa", "Lainnya"].map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="pfield">
                  <label className="plabel">RT</label>
                  <select className="input" value={fRt} onChange={(e) => setFRt(e.target.value)}>
                    {RTS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="pfield">
                <label className="plabel">Lokasi</label>
                <input className="input" value={fLokasi} onChange={(e) => setFLokasi(e.target.value)} placeholder="Contoh: Jl. Raya Way Huwi" />
              </div>
              {umkmErr && <p className="perr">{umkmErr}</p>}
              <div className="pmodal-actions">
                <button type="button" className="pbtn-ghost" onClick={tutupUmkm}>Batal</button>
                <button type="submit" className="pbtn-primary" style={{ padding: "10px 24px" }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ Modal Bayar Iuran ============ */}
      {paying && (
        <div className="pmodal" onClick={(e) => { if (e.target === e.currentTarget) setPaying(null); }}>
          <div className="pmodal-card small">
            <div className="pmodal-head">
              <h2 className="pmodal-title">Bayar Iuran</h2>
              <button className="pico-btn" onClick={() => setPaying(null)}>&#10005;</button>
            </div>
            <div className="pinfo-box">
              <div className="nama">{paying.nama}</div>
              <div className="bulan">Iuran bulan {paying.bulanTeks}</div>
            </div>
            <div className="pfield">
              <label className="plabel">Nominal (Rp)</label>
              <input
                className="input" type="number" min={0} step={500}
                value={fNominal}
                onChange={(e) => setFNominal(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </div>
            <div className="pmodal-actions">
              {iuran[paying.key] > 0 && (
                <button className="pbtn-danger" onClick={hapusIuran}>Hapus Bayar</button>
              )}
              <button className="pbtn-ghost" onClick={() => setPaying(null)}>Batal</button>
              <button className="pbtn-primary" onClick={simpanIuran} style={{ padding: "10px 24px" }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

