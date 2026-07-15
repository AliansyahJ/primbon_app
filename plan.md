# Primbon Jawa — Roadmap & Status

> **Konteks lengkap proyek ada di [`konteks.md`](./konteks.md)** — arsitektur, API, konvensi, riwayat.
> File ini hanya roadmap ringkas: status per fitur + sisa pekerjaan.

## Mode Mentor (AKTIF)

User belajar dari kode, bukan cuma menyelesaikan proyek. Aturan untuk AI agent:
- JANGAN langsung beri solusi/kode lengkap — beri petunjuk bertahap.
- Ajukan pertanyaan yang menguji pemahaman user sebelum lanjut.
- Jelaskan alasan ("kenapa") di balik tiap keputusan desain.
- Kode lengkap HANYA bila user benar-benar buntu atau minta eksplisit.

### Kurikulum JS Dasar (AKTIF DULUAN — user belum bisa JavaScript)

Belajar JS dari nol pakai kode project ini sebagai contoh. Praktik di `node` REPL.
Selesai semua → baru lanjut kurikulum bedah kode di bawah.

- [x] **JS-1 Nilai & Variabel** — LULUS 16 Jul. Paham: tipe, const vs let, `'4'+4` concat, error assign const.
- [x] **JS-2 Object & Array** — LULUS. Paham: index-0, `.length-1`, undefined tanpa error (typo senyap), titik vs kurung (key spasi/variabel: `PASARAN_INFO[x]`).
- [x] **JS-3 Fungsi** — LULUS. Paham: arrow, auto-return tanpa `{}`, `{}` butuh return manual, parameter kosong = undefined → NaN menular, scope (ReferenceError vs undefined). Bisa nulis `(weton) => weton.neptuDina + weton.neptuPasaran`.
- [ ] **JS-4 Operator** — SEDANG: modulo `%` sebagai siklus. 3 soal terakhir BELUM dijawab: (1) kenapa %5 max 4, (2) pasaranKe(20653) utk 15 Jul 2026, (3) `-3 % 5` negatif → kenapa `((x%5)+5)%5`. LANJUTKAN DARI SINI.
- [ ] **JS-5 Kontrol**: if/else, ternary `? :`, loop for/while — bedah `findGoodDays`
- [ ] **JS-6 Method Array**: `.map` (dipakai render tab & grid), `.filter`, `.sort`, `.includes`
- [ ] **JS-7 Sintaks Modern**: template literal `` `${}` ``, destructuring `const {dina}`, spread `...`
- [ ] **JS-8 Modul**: import/export — kenapa file bisa saling pakai
- [ ] **JS-9 Async dasar**: async/await — bedah `storage.js`
- Ujian: baca `getJavaneseDate` baris per baris dan jelaskan tiap baris ngapain

### Kurikulum Bedah Kode (7 modul, urut fondasi → lanjut — SETELAH JS dasar lulus)

Pola tiap modul: pertanyaan pembuka → user baca file target → user jawab →
koreksi + alasan desain → latihan (trace/prediksi). Lanjut modul berikut bila lulus latihan.

- [ ] **Modul 1 — Peta & Arsitektur**: `index.js`, `App.js`, struktur `src/`.
      Kenapa pisah data/utils/screens; alur render entry→tab; kenapa custom tab bar bukan react-navigation.
      Latihan: trace tap tab "Kecocokan".
- [ ] **Modul 2 — Algoritma Penanggalan Jawa**: `javaneseLogic.js`.
      Epoch + modulo (pasaran), anchor wuku, kenapa `Date.UTC`, konversi JD→Hijriah→AJ.
      Latihan: hitung weton sendiri manual; kenapa `((x%5)+5)%5` bukan `x%5`.
- [ ] **Modul 3 — Pola React (State & Lifecycle)**: `WetonCalculatorScreen.js`.
      `useState` vs `useRef` (Animated.Value), alur calculate→setResult→render kondisional.
      Latihan: prediksi kalau fadeAnim pakai useState.
- [ ] **Modul 4 — Theming & Context**: `theme.js`, `ThemeContext.js`.
      Kenapa Context bukan prop drilling; pola `getStyles(colors)` + `useMemo`; kenapa StyleSheet statis gagal ganti tema.
      Latihan: trace toggle tema sampai warna kartu berubah.
- [ ] **Modul 5 — Komposisi UI & Safe Area**: `App.js` (tab bar), `GlosariumCard.js`, `CalendarScreen.js`.
      Glassmorphism; kenapa `useSafeAreaInsets` gantikan padding hardcode; helper-props vs self-contained.
      Latihan: jelaskan kenapa tab bar dulu ketutup nav sistem.
- [ ] **Modul 6 — Desain Data**: `src/data/*.js`.
      Kenapa key `"Senin Legi"` (string) vs 0–6 (angka); fallback `getPrimbonInsight`; dihitung (getHariNaas) vs ditabelkan (35 weton).
      Latihan: desain hipotetis "jam baik" — data atau fungsi?
- [ ] **Modul 7 — Build & Infra**: `app.json`, `eas.json`, `build.yml`, `package.json`.
      expo prebuild→gradle; arm64-only (32→12MB); Hermes/ProGuard; kenapa react=react-dom exact; kenapa CI manual.
      Latihan: baca log build Actions, tunjuk tahap terlama & kenapa.

Ujian akhir: user jelaskan lisan alur lengkap "input tanggal lahir → semua kartu hasil" tanpa buka konteks.md.

## Workflow WAJIB
1. Tulis rencana ke `plan.md` DULU sebelum implementasi — urut prioritas, minta persetujuan user.
2. Update `plan.md` (tandai sedang dikerjakan) setelah rencana disepakati.
3. Update `konteks.md` setelah selesai — simpan konteks terbaru untuk AI agent berikutnya.

---

## ✅ Selesai

- **P1 — Konten Primbon**: Kalkulator Weton, Kecocokan Jodoh (Padangan), Peruntungan Harian (7 kemungkinan), Bulan & Tahun Jawa
- **P1 — Kalender Utama**: grid responsive, navigasi bulan, Pasaran per tanggal, kartu Hari Ini, detail tanggal
- **P2 — Dewasa Ayu**: pencari hari baik per jenis acara (skor peruntungan + pantangan + keselarasan weton)
- **P3 — Wuku/Pawukon**: 30 wuku, siklus 210 hari (anchor 7 Sep 2025 = Sinta)
- **P4 — UI/UX & Infra**: Pranata Mangsa, Dark/Light toggle (`ThemeContext`), Splash + Onboarding
- **P5 — Horoskop Jawa**: Watak 35 Weton, Wuku Lahir, Pancasuda, Zodiak Mangsa (kartu di WetonCalculatorScreen)
- **Bugfix batch 1**: validasi tanggal (`isValidDate`), dedup `PERUNTUNGAN_SKOR`, mangsa off-by-1 kabisat, `KeyboardAvoidingView` Android
- **Rename**: `package.json`/`app.json` → `primbon-app`; folder → `O:\Project\primbon-app` ✅ (`android.package` sengaja dibiarkan agar identitas EAS tak putus)
- **Deploy config**: `eas.json`, Hermes + ProGuard, GitHub Actions build APK otomatis

---

## ✅ P6 — Perkaya Data Makna (SELESAI)

Tujuan: perdalam arti/makna tiap konsep. Tanpa field sumber (keputusan user). Kerja di branch `dev`.

### Fitur 17: DINA_INFO (7 hari)
- [x] `primbonData.js` — export `DINA_INFO` keyed `Minggu`..`Sabtu` `{ arti, ikon, filosofi, watak, unsur, keterangan }`
- [x] Render: kartu "Makna Hari" di detail `CalendarScreen` + kartu "Info Dina" di `WetonCalculatorScreen`

### Fitur 18: Perkaya neptuWatak (12 entri, neptu 7–18)
- [x] `primbonData.js` — tiap entri tambah `rejeki`, `jodoh`, `karier`, `saran` + fallback `getPrimbonInsight`
- [x] Render: kartu Watak Primbon di `WetonCalculatorScreen`

### Fitur 19: Perkaya PASARAN_INFO (5 pasaran)
- [x] `primbonData.js` — tiap entri tambah `watakPemilik` + `keterangan`
- [x] Render: kartu Info Pasaran di `WetonCalculatorScreen`

### Fitur 20: Glossary Edukasi
- [x] `src/data/edukasiData.js` — `GLOSARIUM` 9 istilah `{ istilah, ikon, penjelasan }`
- [x] Komponen reusable `src/components/GlosariumCard.js` (accordion, LayoutAnimation)
- [x] Pasang di `WetonCalculatorScreen` + `CalendarScreen`

**Catatan:** murni tambah data + wiring UI. `javaneseLogic.js` tak disentuh. Semua file lolos `node --check`.
Belum diverifikasi visual via `npm run web` (perlu user).

---

## ✅ P7 — Hari Pantangan per Weton (SELESAI)

Rumus deterministik (dihitung, bukan tabel manual — hindari data karangan):
1. **Weton ulang** — hari weton sendiri (tiap 35 hari) pantang hajat besar.
2. **Naas telung dina + telung pasaran** — dina ke-3 & pasaran ke-3 setelah weton lahir (hitungan inklusif, offset +2; varian Betaljemur Adammakna yang umum).

- [x] `javaneseLogic.js` — fungsi murni `getHariNaas(date)` → `{ wetonLahir, naasDina, naasPasaran, naasKombinasi }` (anchor existing tak disentuh)
- [x] `WetonCalculatorScreen.js` — kartu "Hari Pantangan" (weton ulang + naas dina/pasaran + disclaimer varian tradisi)
- [x] Verifikasi rumus: Senin Legi → Rabu Pon ✓, Sabtu Pon → Senin Kliwon ✓

---


### ✅ P8 — Glosarium Halaman Mandiri (SELESAI 16 Jul)
- [x] `src/screens/GlosariumScreen.js` — full-screen (gradient + header + tombol X), accordion per istilah (kartu terpisah)
- [x] `App.js` — tombol `?` kanan atas (kiri toggle tema, `right: 62`), state `showGlossary`, render gate sebelum tab
- [x] Cabut dari `WetonCalculatorScreen` + `CalendarScreen`; `src/components/GlosariumCard.js` DIHAPUS (folder components kosong lagi)

### Build & Deploy
- [ ] Build APK via EAS: `npx eas-cli build -p android --profile preview`
- [ ] (Opsional) Build local — install NDK 27.1.12297006 via `sdkmanager`
- [ ] Deploy Web ke Vercel/Netlify
- [ ] (Opsional) Publish ke Google Play Store

### Fitur Ditunda
- [ ] Notifikasi harian — butuh `expo-notifications` (tak jalan di web)
- [ ] Animasi transisi antar halaman lebih halus
