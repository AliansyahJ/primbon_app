# Kalender Jawa - Rencana Pengembangan Aplikasi

## Workflow WAJIB

1. **Tulis rencana ke `plan.md` DULU** sebelum implementasi — urut prioritas, minta persetujuan user.
2. **Update `plan.md`** setelah rencana disepakati (tandai sedang dikerjakan).
3. **Update `konteks.md`** setelah selesai perubahan — simpan konteks terbaru agar AI agent lain bisa langsung lanjut.

---

## Deskripsi Proyek
Aplikasi Kalender Jawa berbasis React Native (Expo) yang bersifat Universal (Web + Mobile Native).
Menampilkan penanggalan Masehi dengan informasi Jawa (Pasaran, Weton, Neptu, Primbon) secara offline.

## Tech Stack
- **Framework:** React Native + Expo SDK 57
- **UI:** Glassmorphism, LinearGradient, BlurView, Animated API
- **Data:** 100% Client-Side (Offline, tanpa Backend/Database)
- **Deployment:** Web (Vercel/Netlify) + Mobile APK (EAS Cloud Build)

---

## 🔧 Perbaikan Bug

### Bug 1: Validasi tanggal tidak cek kombinasi valid (Prioritas: Tinggi)
- [x] `javaneseLogic.js` — tambah `isValidDate(year, month, day)` yang verify `new Date().getDate() === day`
- [x] `WetonCalculatorScreen.js` — pakai `isValidDate()` + hapus validasi manual
- [x] `KecocokanScreen.js` — pakai `isValidDate()` + hapus `parseDate()`
- [x] `DewasaAyuScreen.js` — pakai `isValidDate()` + hapus `parseDate()`

### Bug 2: Duplikasi PERUNTUNGAN_SKOR (Prioritas: Tinggi)
- [x] `primbonData.js` — tambah field `skor` di tiap entri `PERUNTUNGAN_INFO`
- [x] `javaneseLogic.js` — hapus `PERUNTUNGAN_SKOR`, ganti logika `findGoodDays()` pakai `PERUNTUNGAN_INFO[key].skor` dan `.baik`

### Bug 3: Mangsa off-by-1 di tahun kabisat (Prioritas: Sedang)
- [x] `javaneseLogic.js` — tambah `isLeapYear()`, update `dayOfYear()` terima parameter `year`, tambah 1 jika leap && month > 2
- [x] `javaneseLogic.js` — `getMangsa()` pass `year` ke `dayOfYear()`

### Bug 4: KeyboardAvoidingView behavior 'height' di Android (Prioritas: Rendah)
- [x] `WetonCalculatorScreen.js`, `KecocokanScreen.js`, `DewasaAyuScreen.js` — ganti `'height'` → `undefined` di Android

---

## Status Fitur

### ✅ Selesai

#### Fitur 1: Kalender Utama
- [x] Grid kalender responsive (7 kolom, layout persentase)
- [x] Navigasi bulan (prev/next) dengan animasi fade
- [x] Menampilkan Pasaran di setiap tanggal
- [x] Highlight "Hari Ini" dengan warna emas
- [x] Kartu "Weton Hari Ini" di atas kalender (Neptu, Unsur, Arah)
- [x] Tap tanggal untuk melihat detail (Weton, Neptu, Arti Pasaran, Unsur)
- [x] Detail penjelasan Makna Pasaran di detail card kalender

#### Fitur 2: Kalkulator Weton
- [x] Input tanggal lahir (DD / MM / YYYY)
- [x] Perhitungan Weton (Dina + Pasaran)
- [x] Perhitungan Neptu (Neptu Dina + Neptu Pasaran)
- [x] Kartu hasil: Weton utama, statistik Neptu
- [x] Kartu Info Pasaran (Arti, Unsur, Arah, Warna)
- [x] Kartu Watak Primbon (Nama watak, ringkasan, detail karakter)
- [x] Kartu Makna Pasaran (penjelasan arti mendalam)
- [x] Kartu Detail Unsur (filosofi, sifat, kelemahan)
- [x] Kartu Detail Arah & Warna (filosofi, makna)

#### Data Primbon Lengkap
- [x] UNSUR_INFO: filosofi + sifat + kelemahan untuk Api, Bumi, Angin, Air, Ether
- [x] ARAH_INFO: filosofi + makna untuk Timur, Selatan, Barat, Utara, Tengah
- [x] WARNA_INFO: filosofi + makna untuk Putih, Merah, Kuning, Hitam, Kuning Emas
- [x] PASARAN_INFO: arti + penjelasanArti mendalam + unsur + arah + warna
- [x] neptuWatak: watak untuk Neptu 7–18

#### UI/UX Premium
- [x] Tema Dark Royal Javanese (Earth tones + Gold)
- [x] Glassmorphism (BlurView) pada semua kartu
- [x] Linear Gradient background
- [x] Micro-animations (fade, slide-up)
- [x] Tab navigasi bawah dengan ikon Ionicons
- [x] Responsive design (Web + Mobile)

---

### 📋 Rencana Ke Depan (Backlog) — Urutan Prioritas

> Prioritas: nilai user tinggi & kompleksitas rendah duluan.

---

#### ✅ Prioritas 1: Konten Primbon Baru — SELESAI

##### Fitur 3: Kecocokan Jodoh (Petungan Pernikahan)
- [x] Input 2 tanggal lahir (Pria & Wanita)
- [x] Hitung jumlah neptu 2 orang → mod 9 → hasil nasib (Lukar/Tulus/Rindu/Rogoh/Sempoyongan/Gembira/Cinta/Celaka/Bahagia)
- [x] Tampilkan kartu weton pria & wanita + kartu hasil padangan (detail + saran)
- [x] PADANGAN_INFO di `primbonData.js`, `calculatePadangan()` di `javaneseLogic.js`
- [x] Tab "Kecocokan" baru di App.js (icon heart)

##### Fitur 4: Peruntungan Harian (7 Kemungkinan)
- [x] Hitung (neptuDina + neptuPasaran) mod 7 → Sri/Lungguh/Gedhong/Lara/Pati/Sida/Pegat
- [x] Tampilkan di kartu "Hari Ini" di CalendarScreen (nama + ikon + ringkasan)
- [x] PERUNTUNGAN_INFO di `primbonData.js`, `getPeruntungan()` di `javaneseLogic.js`
- [x] Peruntungan untuk tanggal apa saja: kotak Peruntungan di detail card (tap tanggal), + penanggalan Jawa per tanggal

##### Fitur 5: Nama Bulan & Tahun Jawa
- [x] Konversi Gregorian → Hijri (algoritma JD tabular), offset AJ = AH + 512
- [x] BULAN_JAWA array, WINDU_NAMES array di `primbonData.js`
- [x] `getJavaneseCalendar()` di `javaneseLogic.js` → {bulanJawa, tahunAJ, namaWindu}
- [x] Tampil di header kalender: nama bulan Jawa + tahun AJ di bawah bulan/tahun Masehi

---

#### ✅ Prioritas 2: Pencari Hari Baik (Dewasa Ayu) — SELESAI

##### Fitur 6: Pencari Hari Baik
- [x] Picker jenis acara: Pernikahan, Pindah Rumah, Memulai Usaha, Hajatan/Khitanan, Bepergian Jauh
- [x] Input tanggal mulai + rentang (1/3/6 bulan)
- [x] Input weton pengguna (opsional) untuk keselarasan
- [x] Algoritma skor: peruntungan (mod 7) + dina/pasaran baik + pantangan + keselarasan weton
- [x] `DEWASA_AYU_INFO` di `primbonData.js`, `findGoodDays()` di `javaneseLogic.js`
- [x] `DewasaAyuScreen.js` baru: list hari baik (tanggal, weton, kualitas, alasan) + disclaimer
- [x] Tab keempat "Hari Baik" (icon star) di App.js

---

#### ✅ Prioritas 3: Wuku / Pawukon — SELESAI

##### Fitur 7: Wuku
- [x] `src/data/wukuData.js` baru: 30 wuku (nama, dewa pelindung, watak, deskripsi)
- [x] `getWuku(date)` di `javaneseLogic.js` — siklus 210 hari, anchor 7 Sep 2025 = Sinta (sumber Kemenag RI)
- [x] Return index, urutan (1–30), hariKe (1–7), + data wuku
- [x] Tampil di kartu Hari Ini (wuku + dewa) dan detail card (wuku + dewa + deskripsi per tanggal)

---

#### ✅ Prioritas 4: UI/UX & Infrastruktur (SELESAI)

Dipilih user: Pranata Mangsa, Dark/Light toggle, Splash + Onboarding.
Ditunda: Notifikasi harian, Deployment.

##### Fitur 8: Pranata Mangsa (Musim Pertanian Jawa)
- [x] `src/data/mangsaData.js`: 12 mangsa (nama, no, rentang tgl, durasi, ciri alam, deskripsi)
- [x] `getMangsa(date)` di `javaneseLogic.js` — cari mangsa aktif berdasar tanggal-dalam-tahun
- [x] Tampil di kartu Hari Ini + detail card CalendarScreen
- [x] Mangsa Kasa mulai 22 Juni; durasi tiap mangsa beda (23–43 hari)

##### Fitur 9: Dark/Light Mode Toggle
- [x] `theme.js`: pecah jadi `darkColors` + `lightColors`, `typography` tetap
- [x] `src/theme/ThemeContext.js` baru: Provider + `useTheme()` hook (mode, colors, toggle)
- [x] Persist pilihan via lightweight storage (localStorage di web, memory di native)
- [x] Refactor tiap screen: `StyleSheet.create({...})` → `getStyles(colors)` dipanggil via `useMemo` + `useTheme()`
- [x] App.js: bungkus `<ThemeProvider>`, gradient & tab bar pakai theme, tombol toggle di kanan atas
- [x] src/utils/storage.js — wrapper localStorage/memory (AsyncStorage diblokir environment policy)

##### Fitur 10: Splash + Onboarding
- [x] Splash: konfigurasi `expo.splash` di `app.json` (pakai `assets/splash-icon.png`, bg `#1A120B`)
- [x] `src/screens/OnboardingScreen.js` baru: 3 slide (kalender, weton/kecocokan, hari baik) + tombol Mulai
- [x] App.js: cek flag `onboarding_seen` saat mount → tampil onboarding bila belum
- [x] userInterfaceStyle: "automatic" di app.json (ikut sistem)

##### Ditunda
- Animasi transisi antar halaman lebih halus
- Fitur Notifikasi Harian (butuh `expo-notifications`, tak jalan di web)

---

#### Deployment & Distribusi
- [ ] Build APK via EAS Cloud Build
- [ ] Deploy versi Web ke Vercel atau Netlify
- [ ] (Opsional) Publish ke Google Play Store

---

## Struktur File Proyek
```
kalender_jawa/
├── App.js                          # Entry point + Tab Navigation
├── index.js                        # Expo entry
├── app.json                        # Konfigurasi Expo
├── package.json                    # Dependencies
├── src/
│   ├── screens/
│   │   ├── CalendarScreen.js       # Layar Kalender Utama
│   │   └── WetonCalculatorScreen.js # Layar Kalkulator Weton
│   ├── utils/
│   │   └── javaneseLogic.js        # Algoritma perhitungan Jawa
│   ├── data/
│   │   └── primbonData.js          # Database Primbon (lokal)
│   └── theme/
│       └── theme.js                # Design System (warna, tipografi)
└── assets/                         # Gambar, ikon, font
```
