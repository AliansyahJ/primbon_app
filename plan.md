# Primbon Jawa — Roadmap & Status

> **Konteks lengkap proyek ada di [`konteks.md`](./konteks.md)** — arsitektur, API, konvensi, riwayat.
> File ini hanya roadmap ringkas: status per fitur + sisa pekerjaan.

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


### Build & Deploy
- [ ] Build APK via EAS: `npx eas-cli build -p android --profile preview`
- [ ] (Opsional) Build local — install NDK 27.1.12297006 via `sdkmanager`
- [ ] Deploy Web ke Vercel/Netlify
- [ ] (Opsional) Publish ke Google Play Store

### Fitur Ditunda
- [ ] Notifikasi harian — butuh `expo-notifications` (tak jalan di web)
- [ ] Animasi transisi antar halaman lebih halus
