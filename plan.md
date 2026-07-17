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

### ✅ P9 — Diet APK (SELESAI 16 Jul)
- [x] app.json: splash + adaptiveIcon (fg/mono) + launcher + favicon → semua `icon-wayang.png`; adaptive bg = warna solid #1A120B
- [x] Hapus 3 PNG lama (splash-icon, android-icon-background, android-icon-monochrome) — `assets/` kini 1 file
- [x] Buang `expo-dev-client` dari dependencies (modul debug, tak perlu di release; dev via Expo Go)
- [x] **Fix font bundle**: import barrel `{ Ionicons } from '@expo/vector-icons'` ternyata bundle SEMUA 19 font (~4MB, terbukti via `expo export`). Ganti ke subpath `import Ionicons from '@expo/vector-icons/Ionicons'` di 7 file → cuma Ionicons.ttf (390KB) ke-bundle. Hemat ~3.6MB.
- [ ] User: jalankan `npm install --ignore-scripts --legacy-peer-deps --no-package-lock` (bersihkan dev-client dari node_modules), lalu build APK manual buat ukur size final

## ✅ P10 — Kalender Lanjutan (SELESAI 17 Jul)

Dikerjakan AI, hasilnya jadi bahan bedah Mode Mentor (modulo & konversi = materi JS-4/Modul 2).

### Fase 1 — Picker Bulan & Tahun (murni UI)
- [x] `CalendarScreen.js` — tap area nama bulan/tahun → panel picker (state `showPicker`):
      baris tahun (chevron ±1), grid 12 bulan (4 kolom), tombol "Hari Ini". Batas 1900–2100 M / 1830–2036 AJ.

### Fase 2 — Mode Kalender Jawa Penuh
Logic baru di `javaneseLogic.js` (pure, anchor existing TAK disentuh):
- [x] `hijriToJD(y, m, d)` — inverse kalender tabular (epoch sama: JD 1948440 = 1 Muharram 1 AH)
- [x] `jdToGregorian(jd)` — Fliegel–Van Flandern
- [x] `getJavaneseMonthStart(tahunAJ, idx)` + `generateJavaneseMonth(tahunAJ, idx)`;
      `getJavaneseCalendar` kini juga return `bulanIndex`
- [x] **Verifikasi LOLOS**: round-trip Hijri & Gregorian 1900–2100 (73k+ hari), anchor 1 Suro 1957 AJ = 19 Jul 2023 ✓,
      panjang bulan selalu 29/30 & tahun 354/355, grid 24 bulan (kelipatan 7, align minggu, kontinu) ✓

UI `CalendarScreen.js`:
- [x] Toggle segmented `Masehi | Jawa`; mode jawa: header bulan Jawa + tahun AJ + windu + rentang Masehi,
      chevron iterasi bulan Jawa, sel = tgl Jawa besar + tgl Masehi kecil + pasaran
- [x] Persist `calendar_mode` via storage; fix seleksi sel pakai `getTime()` (aman lintas bulan Masehi)
- [x] Disclaimer hisab tabular ±1 hari
- [ ] Verifikasi visual via `npm run web` (perlu user)

## ✅ P11 — Weton Runtut + Pantangan Detail + Cek Nasib (SELESAI 17 Jul)

Feedback user 17 Jul. Bugfix detail tanggal mode Jawa (tgl Masehi salah: `selectedDay.day` → `date.getDate()`) ikut di sini.

### A. Restrukturisasi WetonCalculatorScreen ✅
- [x] Divider bagian: ✦ MAKNA KOMPONEN ✦ → ✦ WATAK & NASIB KELAHIRAN ✦ → ✦ HARI PANTANGAN ✦
- [x] 4 kartu pasaran overlap (Info Pasaran + Makna Pasaran + Detail Unsur + Detail Arah&Warna)
      dilebur jadi 1 kartu "Makna Pasaran" (+ field `keterangan` yang dulu tak tampil)
- [x] Label sumber hitungan (style `sourceLabel`) di tiap kartu watak/nasib:
      neptu 12 golongan · 35 weton · Pancasuda · Pawukon 210 hari · Pranata Mangsa

### B. Hari Pantangan Detail — halaman sendiri ✅
- [x] `findBadDays(birthDate, start, end)` di javaneseLogic — Weton Ulang + Naas Kombinasi (tiap 35 hari)
- [x] `src/screens/PantanganScreen.js` — full-screen pola Glosarium, list 90 hari (tanggal, weton, badge jenis, alasan)
- [x] Tombol "Lihat Tanggal Pantangan 90 Hari" di kartu naas; gate render lokal `showPantangan`; `birthDate` disimpan di result
- [x] Verifikasi: lahir Senin Legi → 90 hari = 2× Senin Legi + 2× Rabu Pon, interval 35 hari ✓

### C. Cek Nasib per Tanggal — dari kalender ✅
- [x] `getNasibSemuaWeton(date)` — 35 weton, gabungan `(neptuWeton + neptuTanggal) % 7`, flag `isWetonUlang`/`isNaas` (inverse +2)
- [x] `src/screens/NasibScreen.js` — kelompok Selaras / Kurang Selaras (sort skor), badge pantangan, disclaimer
- [x] Tombol "Cek Nasib Semua Weton di Tanggal Ini" di detail tanggal; gate render lokal `nasibDate`
- [x] Verifikasi: target Rabu Pon → naas cuma utk Senin Legi, ulang cuma utk Rabu Pon ✓
- [ ] Verifikasi visual via `npm run web` (perlu user) — P10 + P11 sekaligus

### Urutan commit granular (belum dieksekusi, nunggu verifikasi visual)
1. `fix: tanggal masehi di detail kalender mode jawa`
2. `feat: findBadDays di javaneseLogic`
3. `feat: getNasibSemuaWeton di javaneseLogic`
4. `refactor: gabung 4 kartu pasaran jadi satu di WetonCalculatorScreen`
5. `refactor: susun ulang kartu weton per bagian + label sumber hitungan`
6. `feat: PantanganScreen + tombol dari kartu Hari Pantangan`
7. `feat: NasibScreen + tombol dari detail tanggal kalender`
8. `docs: update konteks.md`

### Build & Deploy
- [ ] Build APK via EAS: `npx eas-cli build -p android --profile preview`
- [ ] (Opsional) Build local — install NDK 27.1.12297006 via `sdkmanager`
- [ ] Deploy Web ke Vercel/Netlify
- [ ] (Opsional) Publish ke Google Play Store

### Fitur Ditunda
- [ ] Notifikasi harian — butuh `expo-notifications` (tak jalan di web)
- [ ] Animasi transisi antar halaman lebih halus
