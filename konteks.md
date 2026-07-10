# Konteks Proyek — Kalender Jawa

> File ini adalah **ringkasan menyeluruh** proyek untuk memudahkan AI agent (atau developer baru)
> memahami aplikasi dengan cepat. Baca ini dulu sebelum mulai kerja.
> Roadmap & status fitur ada di [`plan.md`](./plan.md).

---

## 1. Apa Ini

Aplikasi **Kalender Jawa** — React Native (Expo SDK 57), universal (Web + Mobile).
Menampilkan penanggalan Masehi lengkap dengan informasi Jawa (Pasaran, Weton, Neptu, Primbon,
Wuku) secara **100% offline** — tanpa backend, database, atau API. Semua perhitungan & data
di sisi klien.

**Bahasa UI:** Indonesia. **Target user:** masyarakat umum yang ingin cek weton, watak, kecocokan
jodoh, dan hari baik menurut tradisi Jawa.

---

## 2. Tech Stack

| Aspek | Pilihan |
|---|---|
| Framework | React Native 0.86 + Expo ~57.0.4 |
| Entry | `index.js` → `App.js` |
| Navigasi | **Custom tab bar** di `App.js` (state `activeTab`, BUKAN react-navigation) |
| UI | Glassmorphism: `expo-blur` (BlurView) + `expo-linear-gradient` + `Animated` API |
| Ikon | `@expo/vector-icons` (Ionicons) |
| Web | `react-native-web` |
| State | React `useState`/`useRef` lokal per screen — tidak ada global store |
| Persistensi | Tidak ada (semua stateless, dihitung on-the-fly) |

Belum ada: routing library, testing, TypeScript, linter config.

---

## 3. Struktur File

```
kalender_jawa/
├── App.js                      # Entry + custom bottom tab bar (4 tab)
├── plan.md                     # Roadmap & status fitur (SELALU update saat kerja)
├── konteks.md                  # File ini
├── AGENTS.md / CLAUDE.md       # Instruksi: baca docs Expo v57 sebelum coding
├── src/
│   ├── screens/
│   │   ├── CalendarScreen.js       # Tab 1: kalender bulanan + kartu Hari Ini + detail tanggal
│   │   ├── WetonCalculatorScreen.js # Tab 2: input tgl lahir → weton, neptu, watak, unsur/arah/warna
│   │   ├── KecocokanScreen.js       # Tab 3: 2 tgl lahir → padangan (kecocokan jodoh)
│   │   └── DewasaAyuScreen.js       # Tab 4: cari hari baik per jenis acara
│   ├── utils/
│   │   └── javaneseLogic.js    # SEMUA algoritma perhitungan (murni, tanpa UI)
│   ├── data/
│   │   ├── primbonData.js      # Database primbon (objek/array export)
│   │   └── wukuData.js         # 30 wuku Pawukon
│   └── theme/
│       └── theme.js            # colors + typography (design tokens)
└── assets/                     # Gambar, ikon
```

**Prinsip pemisahan:** logika hitung → `utils/`, data statis → `data/`, tampilan → `screens/`.
Screen meng-import fungsi dari utils dan data dari data. Jangan taruh angka/logika perhitungan di screen.

---

## 4. Konsep Jawa yang Diimplementasi

| Konsep | Arti | Di mana |
|---|---|---|
| **Dina** | 7 hari (Minggu–Sabtu), tiap hari punya neptu | `javaneseLogic.js` |
| **Pasaran** | Siklus 5 hari: Legi, Pahing, Pon, Wage, Kliwon | `javaneseLogic.js` |
| **Weton** | Kombinasi Dina + Pasaran (mis. "Senin Wage") | `getJavaneseDate()` |
| **Neptu** | Nilai angka: neptu dina + neptu pasaran (rentang 7–18) | `getJavaneseDate()` |
| **Watak Primbon** | Karakter berdasarkan total neptu | `neptuWatak` di primbonData |
| **Unsur/Arah/Warna** | Elemen kosmologi per pasaran | `PASARAN_INFO`, `UNSUR_INFO`, dll |
| **Peruntungan** | 7 kemungkinan (neptu mod 7): Sri/Lungguh/Gedhong/Lara/Pati/Sida/Pegat | `getPeruntungan()` |
| **Padangan** | Kecocokan jodoh (total neptu mod 9): Lukar/Tulus/...Bahagia | `calculatePadangan()` |
| **Dewasa Ayu** | Pencarian hari baik per jenis acara | `findGoodDays()` |
| **Bulan/Tahun Jawa** | Konversi ke kalender Hijriah-Jawa + siklus Windu | `getJavaneseCalendar()` |
| **Wuku** | Siklus Pawukon 210 hari (30 wuku × 7 hari) | `getWuku()` |

---

## 5. API `javaneseLogic.js` (fungsi yang diexport)

- `getJavaneseDate(date)` → `{ dina, pasaran, neptuDina, neptuPasaran, totalNeptu, weton }`
- `generateCalendarMonth(year, month)` → array sel kalender (termasuk padding bulan sebelah)
- `getJavaneseCalendar(date)` → `{ bulanJawa, tahunAJ, hariJawa, namaWindu }`
- `getPeruntungan(date)` → number 0–6 (key ke `PERUNTUNGAN_INFO`)
- `calculatePadangan(date1, date2)` → `{ sisa, totalNeptu, neptuPria, neptuWanita, wetonPria, wetonWanita }`
- `findGoodDays(startDate, endDate, eventKey, userDate?)` → array hari baik terurut skor
- `getWuku(date)` → `{ index, urutan, hariKe, nama, dewa, watak, deskripsi }`

**Titik referensi perhitungan (JANGAN diubah tanpa verifikasi):**
- Pasaran: 1 Jan 1970 (epoch) = Wage. Modulo 5 dari hari sejak epoch.
- Wuku: **7 Sep 2025 = Wuku Sinta hari-1** (anchor terverifikasi, sumber Kemenag RI).
- Tahun Jawa (AJ): tahun Hijriah (AH) + 512. Hijriah dihitung tabular via Julian Day.
- Semua konversi tanggal pakai **UTC** (`Date.UTC`) untuk hindari off-by-one timezone.

---

## 6. Data `primbonData.js` (yang diexport)

`UNSUR_INFO`, `ARAH_INFO`, `WARNA_INFO`, `PASARAN_INFO`, `neptuWatak`, `getPrimbonInsight(neptu)`,
`BULAN_JAWA` (array 12), `WINDU_NAMES` (array 8), `PERUNTUNGAN_INFO` (7 entri, key 0–6),
`PADANGAN_INFO` (9 entri, key 0–8), `DEWASA_AYU_INFO` (5 jenis acara).

`wukuData.js` → `WUKU_DATA` (array 30, urut Sinta→Watugunung).

---

## 7. Konvensi UI / Styling

- **Tema:** Dark Royal Javanese. Warna di `theme.js`: `secondary` = emas (#D4AF37), `primary` = krem,
  `text` = off-white, background gradient coklat gelap.
- **Kartu:** `BlurView` (glassmorphism) + border tipis + `borderRadius` besar (18–24).
- **Animasi:** fade + slide-up pakai `Animated` (`useNativeDriver: true`).
- **Layout:** `centerWrapper` maxWidth 500 agar rapi di web/tablet.
- **StyleSheet** per screen (tidak ada style global selain theme tokens).
- Setiap screen ikuti pola kartu yang sama — tiru screen existing saat buat yang baru.

---

## 8. Cara Menambah Fitur (WORKFLOW WAJIB)

1. **Tulis rencana ke `plan.md` DULU** (urut prioritas), baru implementasi. Ini aturan dari user.
2. **Update `plan.md`** setelah rencana disepakati (tandai sedang dikerjakan).
3. **Update `konteks.md`** setelah selesai perubahan — simpan konteks terbaru agar AI agent lain bisa langsung lanjut.
4. Data statis → tambah ke `primbonData.js` / file data baru di `src/data/`.
5. Logika hitung → tambah fungsi murni ke `javaneseLogic.js`.
6. UI → screen baru di `src/screens/` (tiru pola screen existing) atau kartu di screen lama.
7. Tab baru → daftar di `App.js` (import + kondisi render + TouchableOpacity di tab bar).
8. Tandai `[x]` di `plan.md` saat selesai.

---

## 9. Menjalankan

```bash
npm start        # Expo dev server (pilih platform)
npm run web      # Web
npm run android  # Android
npm run ios      # iOS
```

---

## 10. Catatan Penting

- **AGENTS.md**: baca docs Expo versi 57 (`https://docs.expo.dev/versions/v57.0.0/`) sebelum tulis kode Expo.
- Konten ramalan/primbon bersifat **panduan tradisi**, bukan kepastian — beri disclaimer di UI (lihat DewasaAyuScreen).
- Belum ada test — verifikasi manual via `npm start` dan cek konsistensi hasil (mis. peruntungan hari ini
  di kartu Hari Ini harus sama dengan di detail card).
- Roadmap tersisa (P4): Splash screen, Onboarding, Dark/Light toggle, Notifikasi harian, Pranata Mangsa, Deployment.

---

## 11. Riwayat Perubahan

### 10 Jul 2026 — Fix Bug Batch 1
- **Bug 1**: Validasi tanggal kombinasi invalid (30 Feb dll) — tambah `isValidDate()` di `javaneseLogic.js`, semua screen pakai fungsi itu, hapus `parseDate()` manual di KecocokanScreen & DewasaAyuScreen
- **Bug 2**: Duplikasi `PERUNTUNGAN_SKOR` — pindah field `skor` ke `PERUNTUNGAN_INFO` di `primbonData.js`, hapus `PERUNTUNGAN_SKOR` dari `javaneseLogic.js`, `findGoodDays()` baca dari `PERUNTUNGAN_INFO[key].skor` & `.baik`
- **Bug 3**: Mangsa off-by-1 di tahun kabisat — tambah `isLeapYear()`, `dayOfYear()` sekarang terima parameter `year` dan +1 jika leap & month > 2, `getMangsa()` pass year
- **Bug 4**: `KeyboardAvoidingView` behavior `'height'` di Android — ganti jadi `undefined` di 3 screen (Weton, Kecocokan, DewasaAyu)
- **Build Config**: tambah Hermes + ProGuard di `app.json`, buat `eas.json`, hapus `@react-native-async-storage/async-storage` (tdk dipakai), ignore `.claude/` + `AGENTS.md` + `CLAUDE.md`
