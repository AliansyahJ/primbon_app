# Konteks Proyek — Primbon Jawa (primbon-app)

> Nama project: `primbon-app` (package.json) / display "Primbon Jawa" (app.json).
> Folder repo sudah `O:\Project\primbon-app`.

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
| State | React `useState`/`useRef` lokal per screen + `ThemeContext` (global tema) |
| Persistensi | `storage.js` — localStorage (web) / memory (native); simpan pilihan tema & flag onboarding |

Belum ada: routing library, testing, TypeScript, linter config.

---

## 3. Struktur File

```
kalender_jawa/
├── App.js                      # Entry + ThemeProvider + custom tab bar (4 tab) + gate onboarding
├── plan.md                     # Roadmap & status fitur (SELALU update saat kerja)
├── konteks.md                  # File ini
├── AGENTS.md / CLAUDE.md       # Instruksi: baca docs Expo v57 sebelum coding
├── src/
│   ├── screens/
│   │   ├── CalendarScreen.js        # Tab 1: kalender bulanan + kartu Hari Ini + detail tanggal
│   │   ├── WetonCalculatorScreen.js # Tab 2: input tgl lahir → weton, neptu, watak, unsur/arah/warna
│   │   ├── KecocokanScreen.js       # Tab 3: 2 tgl lahir → padangan (kecocokan jodoh)
│   │   ├── DewasaAyuScreen.js       # Tab 4: cari hari baik per jenis acara
│   │   └── OnboardingScreen.js      # 3 slide tutorial (tampil sekali, flag di storage)
│   ├── utils/
│   │   ├── javaneseLogic.js    # SEMUA algoritma perhitungan (murni, tanpa UI)
│   │   └── storage.js          # Wrapper persistensi (localStorage web / memory native)
│   ├── data/
│   │   ├── primbonData.js      # Database primbon (objek/array export)
│   │   ├── wukuData.js         # 30 wuku Pawukon
│   │   ├── mangsaData.js       # 12 Pranata Mangsa (musim tani + zodiak)
│   │   ├── watakWetonData.js   # 35 watak weton (horoskop)
│   │   └── pancasudaData.js    # 7 pancasuda (ramalan nasib)
│   └── theme/
│       ├── theme.js            # darkColors + lightColors + typography (design tokens)
│       └── ThemeContext.js     # Provider + useTheme() hook (mode, colors, toggleMode)
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
| **Watak 35 Weton** | Ramalan karakter per kombinasi Dina×Pasaran (35) | `getWatakWeton()` |
| **Pancasuda** | Ramalan nasib dari total neptu (7 jenis) | `getPancasuda()` |
| **Pranata Mangsa** | Musim tani + zodiak mangsa lahir (12) | `getMangsa()` |

---

## 5. API `javaneseLogic.js` (fungsi yang diexport)

- `getJavaneseDate(date)` → `{ dina, pasaran, neptuDina, neptuPasaran, totalNeptu, weton }`
- `generateCalendarMonth(year, month)` → array sel kalender (termasuk padding bulan sebelah)
- `getJavaneseCalendar(date)` → `{ bulanJawa, tahunAJ, hariJawa, namaWindu }`
- `getPeruntungan(date)` → number 0–6 (key ke `PERUNTUNGAN_INFO`)
- `calculatePadangan(date1, date2)` → `{ sisa, totalNeptu, neptuPria, neptuWanita, wetonPria, wetonWanita }`
- `findGoodDays(startDate, endDate, eventKey, userDate?)` → array hari baik terurut skor
- `getWuku(date)` → `{ index, urutan, hariKe, nama, dewa, watak, deskripsi }`
- `getMangsa(date)` → data mangsa aktif dari `PRANATA_MANGSA` (nama, no, rentang, ciri, deskripsi, watak, elemen)
- `getWatakWeton(date)` → entri `WATAK_WETON[weton]` (watak, rejeki, jodoh, karier, kelebihan, kekurangan, saran) atau null
- `getPancasuda(date)` → `{ index, ...PANCASUDA_INFO[i] }` dari `(totalNeptu-1)%7`
- `isValidDate(year, month, day)` → boolean; tolak kombinasi mustahil (mis. 30 Feb). Dipakai semua form input.

**Titik referensi perhitungan (JANGAN diubah tanpa verifikasi):**
- Pasaran: 1 Jan 1970 (epoch) = Wage. Modulo 5 dari hari sejak epoch.
- Wuku: **7 Sep 2025 = Wuku Sinta hari-1** (anchor terverifikasi, sumber Kemenag RI).
- Tahun Jawa (AJ): tahun Hijriah (AH) + 512. Hijriah dihitung tabular via Julian Day.
- Semua konversi tanggal pakai **UTC** (`Date.UTC`) untuk hindari off-by-one timezone.

---

## 6. Data `primbonData.js` (yang diexport)

`UNSUR_INFO`, `ARAH_INFO`, `WARNA_INFO`, `PASARAN_INFO`, `neptuWatak`, `getPrimbonInsight(neptu)`,
`BULAN_JAWA` (array 12), `WINDU_NAMES` (array 8), `PERUNTUNGAN_INFO` (7 entri, key 0–6 — tiap entri punya `skor` + `baik`),
`PADANGAN_INFO` (9 entri, key 0–8), `DEWASA_AYU_INFO` (5 jenis acara).

`wukuData.js` → `WUKU_DATA` (array 30, urut Sinta→Watugunung; + bakat/keberuntungan/pantangan/pohon/burung).
`mangsaData.js` → `PRANATA_MANGSA` (array 12, Kasa→Sadha; + watak/keberuntungan/elemen).
`watakWetonData.js` → `WATAK_WETON` (35 entri, key `"Dina Pasaran"`).
`pancasudaData.js` → `PANCASUDA_INFO` (array 7).

Horoskop Jawa (watak weton, wuku lahir, pancasuda, zodiak mangsa) tampil sebagai kartu
tambahan di **WetonCalculatorScreen** setelah hasil weton — bukan tab terpisah.

---

## 7. Konvensi UI / Styling

- **Tema:** dua palet — `darkColors` (default, Dark Royal Javanese) + `lightColors`. Toggle via `useTheme()`.
  `secondary` = emas, `primary` = krem/coklat, `blurTint` ikut mode. Semua warna dari `colors` hasil `useTheme()`.
- **Pola styling wajib:** tiap screen ambil `const { colors } = useTheme()`, lalu
  `const styles = useMemo(() => getStyles(colors), [colors])`. Styles didefinisikan sebagai
  factory `const getStyles = (colors) => StyleSheet.create({...})` — BUKAN StyleSheet statis (agar ikut ganti tema).
- **Kartu:** `BlurView` (glassmorphism), `tint={colors.blurTint}`, bg `colors.cardBg`, border `colors.cardBorder`.
- **Animasi:** fade + slide-up pakai `Animated` (`useNativeDriver: true`).
- **Layout:** `centerWrapper` maxWidth 500 agar rapi di web/tablet.
- Setiap screen ikuti pola kartu yang sama — tiru screen existing saat buat yang baru.
- **Komponen helper di luar komponen utama** (mis. `DateInput` di KecocokanScreen) harus terima
  `styles` DAN `colors` sebagai prop — tidak ada akses scope useTheme di sana.

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
- **Status roadmap:** P1–P5 SELESAI (Kalender, Weton, Kecocokan, Peruntungan, Bulan/Tahun Jawa,
  Dewasa Ayu, Wuku, Pranata Mangsa, Dark/Light toggle, Splash + Onboarding, Horoskop Jawa lengkap). Bugfix batch 1 selesai.
- **Sisa:** Notifikasi harian (butuh `expo-notifications`), build APK via EAS, deploy web. Detail di `plan.md`.

---

## 11. Riwayat Perubahan

### 12 Jul 2026 — Icon Wayang + Fix Web + CI
- **Icon wayang**: launcher (`app.json` icon + Android `adaptiveIcon.foregroundImage` + web favicon) → `assets/icon-wayang.png`. Tab bar (`App.js`) ganti 4 Ionicons → `<Image>` wayang, `tintColor` emas (aktif) / redup (non-aktif). Ionicons tetap dipakai toggle tema. 4 tab pakai gambar sama (dibedakan label + warna).
- **Fix web**: `npm run web` error `Incompatible React versions` (react 19.2.3 vs react-dom 19.2.7). `package.json` pin `react-dom` exact `19.2.3`. Reinstall + `expo start --web -c`.
- **CI hardening** (`build.yml`): `paths-ignore` (`**.md`/`.claude`/`.gitignore`/`LICENSE` skip build), `concurrency` cancel-in-progress, `cache: gradle`, artifact rename → `primbon-jawa-apk`.
- **Belum**: lockfile (masih `--no-package-lock`, deps ngambang), signing key (masih debug key, tak bisa Play Store).

### 10 Jul 2026 — Fix Bug Batch 1
- **Bug 1**: Validasi tanggal kombinasi invalid (30 Feb dll) — tambah `isValidDate()` di `javaneseLogic.js`, semua screen pakai fungsi itu, hapus `parseDate()` manual di KecocokanScreen & DewasaAyuScreen
- **Bug 2**: Duplikasi `PERUNTUNGAN_SKOR` — pindah field `skor` ke `PERUNTUNGAN_INFO` di `primbonData.js`, hapus `PERUNTUNGAN_SKOR` dari `javaneseLogic.js`, `findGoodDays()` baca dari `PERUNTUNGAN_INFO[key].skor` & `.baik`
- **Bug 3**: Mangsa off-by-1 di tahun kabisat — tambah `isLeapYear()`, `dayOfYear()` sekarang terima parameter `year` dan +1 jika leap & month > 2, `getMangsa()` pass year
- **Bug 4**: `KeyboardAvoidingView` behavior `'height'` di Android — ganti jadi `undefined` di 3 screen (Weton, Kecocokan, DewasaAyu)
- **Build Config**: tambah Hermes + ProGuard di `app.json`, buat `eas.json`, hapus `@react-native-async-storage/async-storage` (tdk dipakai), ignore `.claude/` + `AGENTS.md` + `CLAUDE.md`
- **GitHub Actions**: workflow `.github/workflows/build.yml` — build APK otomatis tiap push ke master, APX bisa didownload dari Actions tab
- **Fix CI**: hapus `package-lock.json` dari repo (regenerate via `npm install` di CI), hapus `cache: npm` karena lock file bermasalah dengan `expo-dev-client`
- **APK size**: build hanya `arm64-v8a` + `shrinkResources` → APK turun dari ~32MB ke ~12-15MB

### 11 Jul 2026 — Horoskop Jawa Lengkap + Rename
- **Horoskop (P5)**: 4 sistem ramalan berbasis tanggal lahir digabung di WetonCalculatorScreen sebagai kartu:
  - Watak 35 Weton (`watakWetonData.js` → `WATAK_WETON`, `getWatakWeton()`)
  - Wuku Lahir (perluas `WUKU_DATA`: bakat/keberuntungan/pantangan/pohon/burung)
  - Pancasuda (`pancasudaData.js` → `PANCASUDA_INFO` 7 jenis, `getPancasuda()`)
  - Zodiak Mangsa (perluas `PRANATA_MANGSA`: watak/keberuntungan/elemen)
- **Fix UI**: tab bar Android height 88 + paddingBottom 28 agar tak bertabrakan navigasi sistem (safe-area-context tak dipakai, install diblok)
- **Rename**: `package.json` name → `primbon-app`, `app.json` name "Primbon Jawa" + slug `primbon-app`.
  `android.package` DIBIARKAN (ganti = putus EAS). Folder repo sudah di-rename → `O:\Project\primbon-app`.
- **Workflow final**: `npm install --legacy-peer-deps --ignore-scripts --no-package-lock`, gradle dengan `-PreactNativeArchitectures=arm64-v8a`

---

### 13 Jul 2026 — P6: Perkaya Data Makna (SELESAI, branch dev)
- **Fitur 17 — `DINA_INFO`**: export baru di `primbonData.js` (7 hari, `{ arti, ikon, filosofi, watak, unsur, keterangan }`). Render kartu "Makna Hari" di detail `CalendarScreen` + kartu "Info Dina" di `WetonCalculatorScreen`.
- **Fitur 18 — `neptuWatak`+**: 12 entri (neptu 7–18) tambah `rejeki/jodoh/karier/saran` (setara `WATAK_WETON`), fallback `getPrimbonInsight` diisi juga. Render di kartu Watak Primbon.
- **Fitur 19 — `PASARAN_INFO`+**: 5 pasaran tambah `watakPemilik` + `keterangan`. Render di kartu Info Pasaran.
- **Fitur 20 — Glossary**: `src/data/edukasiData.js` (`GLOSARIUM` 9 istilah) + komponen reusable `src/components/GlosariumCard.js` (accordion expand/collapse, LayoutAnimation). Dipasang di `WetonCalculatorScreen` + `CalendarScreen`.
- **Catatan**: `javaneseLogic.js` tak disentuh. Folder `src/components/` baru. Semua lolos `node --check`. Belum verifikasi visual `npm run web`. 11 commit atomic di branch `dev`, belum di-PR/merge ke master.

---

## 12. Riwayat P6 (arsip rencana — sudah selesai)

> Status: **SELESAI 13 Jul 2026** (lihat riwayat di atas). Bagian di bawah arsip rencana awal.
> Semua kerja di branch `dev`. Detail checklist di `plan.md` (Fitur 17–20).
> Sifat: **murni tambah data + wiring UI**. JANGAN sentuh algoritma `javaneseLogic.js` (anchor perhitungan aman).
> Keputusan user: **tanpa field `sumber`/sitasi** — cukup konten makna.

### Fitur 17 — `DINA_INFO` (7 hari)
- **Masalah**: Pasaran (5) punya `PASARAN_INFO` lengkap (arti, filosofi, unsur/arah/warna), tapi Dina (7 hari) cuma nama + neptu di `javaneseLogic.js` (`DINA_NAMES`, `DINA_NEPTU`). Asimetris.
- **Aksi**: export baru `DINA_INFO` di `primbonData.js`, keyed `Minggu`..`Sabtu`. Tiap entri: `{ arti, ikon, filosofi, watak, unsur, keterangan }` — mirror pola `PASARAN_INFO` + `UNSUR_INFO`.
- **Render**: detail card `CalendarScreen.js` (tap tanggal) + hasil `WetonCalculatorScreen.js`. Import `DINA_INFO`, akses `DINA_INFO[javanese.dina]`.

### Fitur 18 — Perkaya `neptuWatak` (12 entri, neptu 7–18)
- **Sekarang**: tiap entri `{ nama, ringkasan, detail }`.
- **Aksi**: tambah `rejeki`, `jodoh`, `karier`, `saran` — samakan struktur `WATAK_WETON` (`watakWetonData.js`) supaya konsisten.
- **Render**: kartu "Watak Primbon" di `WetonCalculatorScreen.js` (pakai `getPrimbonInsight(totalNeptu)`).

### Fitur 19 — Perkaya `PASARAN_INFO` (5 pasaran)
- **Sekarang**: `{ arti, penjelasanArti, unsur, arah, warna }`.
- **Aksi**: tambah `watakPemilik` (watak orang lahir di pasaran itu) + `keterangan`.
- **Render**: detail Pasaran di `CalendarScreen.js` (line ~256–265) + `WetonCalculatorScreen.js`.

### Fitur 20 — Glossary Edukasi
- **Aksi**: file baru `src/data/edukasiData.js` → export `GLOSARIUM` (array `{ istilah, ikon, penjelasan }`).
- **Istilah**: Weton, Neptu, Dina, Pasaran, Wuku, Pancasuda, Pranata Mangsa, Padangan, Peruntungan (9).
- **UI**: kartu accordion "Apa itu…?" — `BlurView` glassmorphism ikut pola kartu existing (`colors.cardBg`, `colors.cardBorder`, `tint={colors.blurTint}`), toggle expand via `useState`. Taruh di `WetonCalculatorScreen.js` + `CalendarScreen.js`. Helper accordion di luar komponen utama → terima `styles` + `colors` sebagai prop (konvensi wajib).

**Referensi struktur data existing** (tiru gaya penulisan makna):
- `PASARAN_INFO` / `UNSUR_INFO` di `primbonData.js` — pola filosofi + sifat.
- `WATAK_WETON` di `watakWetonData.js` — pola rejeki/jodoh/karier/saran.
