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

## 🚧 P6 — Perkaya Data Makna (SEDANG DIRENCANAKAN)

Tujuan: perdalam arti/makna tiap konsep. Tanpa field sumber (keputusan user).
Semua kerja di branch `dev`.

### Fitur 17: DINA_INFO (7 hari)
- [ ] `primbonData.js` — export `DINA_INFO` keyed `Minggu`..`Sabtu`, tiap entri `{ arti, ikon, filosofi, watak, unsur, keterangan }` (mirror `PASARAN_INFO`)
- [ ] Tutup asimetri: Pasaran punya info lengkap, Dina cuma nama+neptu
- [ ] Render: detail card `CalendarScreen` + hasil `WetonCalculatorScreen`

### Fitur 18: Perkaya neptuWatak (12 entri, neptu 7–18)
- [ ] `primbonData.js` — tiap entri `neptuWatak` tambah `rejeki`, `jodoh`, `karier`, `saran` (samakan struktur `WATAK_WETON`)
- [ ] Render: kartu Watak Primbon di `WetonCalculatorScreen`

### Fitur 19: Perkaya PASARAN_INFO (5 pasaran)
- [ ] `primbonData.js` — tiap entri `PASARAN_INFO` tambah `watakPemilik` (watak orang lahir pasaran itu) + `keterangan`
- [ ] Render: detail Pasaran di `CalendarScreen` / `WetonCalculatorScreen`

### Fitur 20: Glossary Edukasi
- [ ] File baru `src/data/edukasiData.js` — export `GLOSARIUM` array `{ istilah, ikon, penjelasan }`
- [ ] Istilah: Weton, Neptu, Dina, Pasaran, Wuku, Pancasuda, Pranata Mangsa, Padangan, Peruntungan
- [ ] UI: kartu accordion "Apa itu…?" (BlurView, ikuti pola kartu existing) di `WetonCalculatorScreen` + `CalendarScreen`

**Catatan:** murni tambah data + wiring UI. Tak ubah algoritma `javaneseLogic.js` (anchor perhitungan aman).

---


### Build & Deploy
- [ ] Build APK via EAS: `npx eas-cli build -p android --profile preview`
- [ ] (Opsional) Build local — install NDK 27.1.12297006 via `sdkmanager`
- [ ] Deploy Web ke Vercel/Netlify
- [ ] (Opsional) Publish ke Google Play Store

### Fitur Ditunda
- [ ] Notifikasi harian — butuh `expo-notifications` (tak jalan di web)
- [ ] Animasi transisi antar halaman lebih halus
