# Konteks Proyek — Primbon Jawa (primbon-app)

> Nama project: `primbon-app` (package.json) / display "Primbon Jawa" (app.json).
> Folder repo: `O:\Project\primbon-app`.

> File ini adalah **referensi menyeluruh & detil** proyek. Tujuannya: AI agent / developer baru
> bisa langsung kerja TANPA membaca semua file dulu. Baca ini + `plan.md` (roadmap) sudah cukup
> untuk mayoritas tugas. Kalau mengubah file tertentu, baru baca file itu.

---

## 1. Apa Ini

Aplikasi **Kalender Jawa / Primbon** — React Native (Expo SDK 57), universal (Web + Mobile).
Menampilkan penanggalan Masehi dengan informasi Jawa (Pasaran, Weton, Neptu, Primbon, Wuku,
Mangsa) secara **100% offline** — tanpa backend, database, atau API. Semua perhitungan & data di klien.

**Bahasa UI:** Indonesia. **Target:** masyarakat umum — cek weton, watak, kecocokan jodoh, hari baik.

---

## 2. Aturan Kerja (WAJIB, baca dulu)

- **1 BRANCH SAJA (`master`)** — commit langsung ke `master`. JANGAN bikin `dev`/`feat/*`. (Override aturan global `~/.claude/CLAUDE.md` #2.)
- **JANGAN pakai trailer `Co-Authored-By: Claude`** di commit — commit murni atas nama user.
- **Commit granular** — atomic per unit logis, Conventional Commits (`feat:`/`fix:`/`docs:`/`ci:`/`chore:`). Commit/push hanya saat user minta.
- **plan.md dulu** — tulis rencana + minta persetujuan sebelum implementasi. Tandai progres.
- **Update konteks.md** tiap selesai perubahan berarti.
- **CI build APK MANUAL saja** (`workflow_dispatch`) — push TIDAK memicu build. Actions tab → "Build APK" → Run workflow.
- **AGENTS.md**: baca docs Expo v57 (`https://docs.expo.dev/versions/v57.0.0/`) sebelum tulis kode Expo.
- Konten ramalan = **panduan tradisi**, bukan kepastian → selalu beri disclaimer di UI.
- Tanggal riwayat: cek `date` device, jangan menebak.

---

## 3. Tech Stack & Dependencies

| Aspek | Pilihan |
|---|---|
| Framework | React Native 0.86.0 + Expo ~57.0.4 |
| Entry | `index.js` → `App.js` |
| Navigasi | **Custom tab bar** di `App.js` (state `activeTab`; BUKAN react-navigation) |
| UI | Glassmorphism: `expo-blur` (BlurView) + `expo-linear-gradient` + `Animated` API |
| Ikon | `@expo/vector-icons` (Ionicons) + `assets/icon-wayang.png` (tab bar) |
| Safe area | `react-native-safe-area-context` ~5.7.0 (`useSafeAreaInsets`) |
| Web | `react-native-web` ^0.21.2 |
| State | `useState`/`useRef` lokal per screen + `ThemeContext` global |
| Persistensi | `storage.js` — localStorage (web) / memory (native) |

**Versi penting (jangan asal ubah):** `react` 19.2.3 = `react-dom` 19.2.3 (HARUS exact sama — pernah error web gara-gara caret `^`). Node min 22.13.x (dipakai v24).

**Install dependency:** `npm install --ignore-scripts --legacy-peer-deps --no-package-lock`
(`~/.npmrc` user punya `allow-scripts` yang bikin `expo install` gagal `EALLOWSCRIPTS` — pakai flag di atas. Tak ada package-lock di repo, sengaja.)

Belum ada: routing lib, testing, TypeScript, linter.

---

## 4. Struktur File + Isi Detil

```
primbon-app/
├── App.js                    # Entry: providers + tab bar + gate onboarding/glosarium + tombol ? & tema
├── index.js                  # Expo entry standar
├── app.json                  # Expo config (lihat §9)
├── eas.json                  # Profil EAS Build (development, preview APK, production AAB)
├── plan.md                   # Roadmap ringkas & status (SELALU update)
├── konteks.md                # File ini
├── AGENTS.md / CLAUDE.md     # Instruksi: baca docs Expo v57
├── .github/workflows/build.yml  # Build APK — MANUAL only (workflow_dispatch)
├── assets/                   # icon-wayang.png (launcher+tab), splash-icon.png, android-icon-{background,monochrome}.png
└── src/
    ├── components/ (kosong — GlosariumCard dihapus 16 Jul, glosarium jadi screen)
    ├── screens/ (6 file: 4 tab + Onboarding + Glosarium)
    ├── utils/ (javaneseLogic.js, storage.js)
    ├── data/ (6 file)
    └── theme/ (theme.js, ThemeContext.js)
```

### App.js
- `TABS` = 4 entri `{key, label}`: calendar/weton/kecocokan/hariBaik. Ikon tab = `WAYANG_ICON` (require icon-wayang.png) di-`tintColor`: aktif `colors.secondary` (emas), non-aktif `colors.textLight`.
- `AppContent`: cek `storageGet('onboarding_seen')` saat mount → `OnboardingScreen` bila belum. Toggle tema kanan-atas (Ionicons sunny/moon).
- Safe area: `useSafeAreaInsets()` → `paddingTop: insets.top` (container) & `paddingBottom: insets.bottom + 10` (tab bar). TIDAK pakai `SafeAreaView`.
- Root: `<SafeAreaProvider><ThemeProvider><AppContent/></ThemeProvider></SafeAreaProvider>`.

### src/utils/javaneseLogic.js — SEMUA algoritma (murni, tanpa UI)

Konstanta internal:
- `PASARAN_NAMES = ['Wage','Kliwon','Legi','Pahing','Pon']` (urut SIKLUS HARIAN, index 0 = Wage krn epoch) · `PASARAN_NEPTU = [4,8,5,9,7]`
- `DINA_NAMES = ['Minggu'..'Sabtu']` (index = `getDay()`) · `DINA_NEPTU = [5,4,3,7,8,6,9]`
- `WUKU_ANCHOR_DAYS` = hari-sejak-epoch utk 7 Sep 2025

Export (signature → return):
| Fungsi | Return / catatan |
|---|---|
| `isValidDate(y,m,d)` | boolean; tolak 30 Feb dll; dipakai SEMUA form |
| `getJavaneseDate(date)` | `{dina, pasaran, neptuDina, neptuPasaran, totalNeptu, weton}` — pasaran = `daysSinceEpoch % 5` (epoch 1 Jan 1970 = Wage), dina = `date.getDay()` |
| `getJavaneseCalendar(date)` | `{bulanJawa, tahunAJ, hariJawa, namaWindu}` — Gregorian→JD→Hijri tabular; AJ = AH + 512; windu = `(tahunAJ-1) % 8` |
| `getPeruntungan(date)` | number 0–6 = `totalNeptu % 7` → key `PERUNTUNGAN_INFO` |
| `calculatePadangan(d1,d2)` | `{sisa (mod 9), totalNeptu, neptuPria, neptuWanita, wetonPria, wetonWanita}` |
| `getMangsa(date)` | entri `PRANATA_MANGSA` aktif — cari via `startDoy <= dayOfYear`; sebelum mangsa pertama = mangsa terakhir (lintas tahun); leap-year aware |
| `getWuku(date)` | `{index, urutan 1-30, hariKe 1-7, ...WUKU_DATA[i]}` — posisi `(days - anchor) % 210` |
| `getWatakWeton(date)` | `WATAK_WETON[weton]` atau null |
| `getPancasuda(date)` | `{index, ...PANCASUDA_INFO[i]}`, i = `(totalNeptu-1) % 7` |
| `getHariNaas(date)` | `{wetonLahir, naasDina, naasPasaran, naasKombinasi}` — offset +2 modulo (hitungan Jawa inklusif "telung dinane lan telung pasarane"); cth Senin Legi → Rabu Pon |
| `findGoodDays(start, end, eventKey, userDate?)` | array `{date, javanese, peruntungan, skor, kualitas, alasan[]}` sort skor desc; diskualifikasi bila kena `dinaPantang`/`pasaranPantang`; skor = peruntungan.skor + 2 (dinaBaik) + 2 (pasaranBaik) + 2 (selaras weton user); ambang tampil `skor >= 3`, "Sangat Baik" `>= 6` |
| `generateCalendarMonth(y, m)` | array sel `{date, day, isCurrentMonth, javanese}` termasuk padding bulan sebelah |

**ANCHOR — JANGAN diubah tanpa verifikasi:**
- Pasaran: 1 Jan 1970 (epoch) = **Wage**.
- Wuku: **7 Sep 2025 = Sinta hari-1** (Kemenag RI).
- AJ = AH + 512 (referensi: 1 Suro 1957 AJ = 19 Jul 2023 = 1 Muharram 1445 AH).
- Semua konversi pakai **UTC** (`Date.UTC`) hindari off-by-one timezone.

### src/utils/storage.js
`storageGet(key)` / `storageSet(key, value)` — async. Web: `window.localStorage`. Native: object memory (hilang saat app tutup — KNOWN LIMITATION, tema & onboarding tak persist di native). Ganti implementasi di file ini saja bila kelak pakai async-storage. Key terpakai: `theme_mode`, `onboarding_seen`.

### src/data/primbonData.js — export:
- `UNSUR_INFO` (5: Api/Bumi/Angin/Air/Ether) — `{nama, ikon, filosofi, sifat, kelemahan}`
- `ARAH_INFO` (5: Timur/Selatan/Barat/Utara/Tengah) — `{nama, ikon, filosofi, makna}`
- `WARNA_INFO` (5: Putih/Merah/Kuning/Hitam/'Kuning Emas') — `{ikon, filosofi, makna}`
- `DINA_INFO` (7, key 'Minggu'..'Sabtu') — `{arti, ikon, filosofi, watak, unsur, keterangan}` (arti = nama kuno+planet, mis. Minggu = 'Radite / Matahari')
- `PASARAN_INFO` (5, key 'Legi'..'Kliwon') — `{arti, penjelasanArti, unsur, arah, warna, watakPemilik, keterangan}`
- `neptuWatak` (12, key 7–18) — `{nama, ringkasan, detail, rejeki, jodoh, karier, saran}` (nama: 7=Pendok … 18=Paripurna)
- `getPrimbonInsight(neptu)` — `neptuWatak[n]` atau fallback 'Unik' (semua field terisi '-')
- `BULAN_JAWA` (12: Suro…Besar) · `WINDU_NAMES` (8: Alip…Jimakir)
- `PERUNTUNGAN_INFO` (7, key 0–6) — `{nama, ikon, ringkasan, detail, baik, skor}`; 1=Sri(+3) 2=Lungguh(+2) 3=Gedhong(+3) 4=Lara(-4) 5=Pati(-5) 6=Sida(+3) 0=Pegat(-2)
- `PADANGAN_INFO` (9, key 0–8) — `{nama, ikon, skor, ringkasan, detail, saran}`; 1=Lukar 2=Tulus 3=Rindu 4=Rogoh 5=Sempoyongan 6=Gembira 7=Cinta(10) 8=Celaka(1) 0=Bahagia(10)
- `DEWASA_AYU_INFO` (5 acara: pernikahan/pindah/usaha/hajatan/bepergian) — `{nama, ikon, deskripsi, dinaBaik[], pasaranBaik[], dinaPantang[], pasaranPantang[]}`

### src/data/ lainnya:
- `wukuData.js` → `WUKU_DATA` array 30 (Sinta→Watugunung) — `{nama, dewa, watak, deskripsi, bakat, keberuntungan, pantangan, pohon, burung}`
- `mangsaData.js` → `PRANATA_MANGSA` array 12 (Kasa mulai 22 Juni; durasi 23–43 hari) — `{no, nama, ikon, rentang, startMonth, startDay, durasi, ciri, deskripsi, watak, keberuntungan, elemen}`
- `watakWetonData.js` → `WATAK_WETON` object 35, key `"Dina Pasaran"` — `{watak, rejeki, jodoh, karier, kelebihan, kekurangan, saran}`
- `pancasudaData.js` → `PANCASUDA_INFO` array 7 — `{nama, ikon, makna, watak, nasib, saran, baik}` (Wasesa Segara, Tunggak Semi, Satria Wibawa, Sumur Sinaba, Satria Wirang, Bumi Kapetak, Lebu Katiup Angin)
- `edukasiData.js` → `GLOSARIUM` array 9 — `{istilah, ikon, penjelasan}` (Weton, Neptu, Dina, Pasaran, Wuku, Pancasuda, Pranata Mangsa, Padangan, Peruntungan)

**Status konten: MATANG — jangan tambah data lagi tanpa alasan kuat (resiko ngarang isi).**

### src/theme/
- `theme.js`: `darkColors` (default; bg #1A120B, emas #D4AF37, krem #D5BDAF) + `lightColors` (cream; emas gelap #B8860B) + `palettes` + `typography` (title 28/800, subtitle 16/500, body 14). Token per palet: background, surface, primary, secondary, text, textLight, border, pasaranText, holidayText, todayBackground, gradientStart/End, cardBg, cardBorder, inputBg, blurTint.
- `ThemeContext.js`: `ThemeProvider` + `useTheme()` → `{mode, colors, toggleMode}`. Persist ke storage key `theme_mode`.

### src/components/GlosariumCard.js
Kartu accordion "Apa Itu Istilah Ini?" — self-contained (punya `useTheme` sendiri, tanpa prop). Map `GLOSARIUM`, satu terbuka (state `openIndex`), `LayoutAnimation` (+ enable eksperimental Android). Dipasang di WetonCalculatorScreen (paling bawah) + CalendarScreen (paling bawah).

### src/screens/ — struktur per screen

**CalendarScreen.js** (Tab 1 Kalender)
- State: `currentDate`, `calendarDays`, `selectedDay`, `fadeAnim`. `maxWidth` = min(width, 500).
- Bagian atas: kartu "Hari Ini" — weton, neptu, unsur/arah, peruntungan (`getPeruntungan`), wuku+dewa, mangsa.
- Grid: header nav bulan (chevron prev/next + nama bulan Masehi + bulan Jawa/tahun AJ via `getJavaneseCalendar`), 7 kolom, sel = tanggal + pasaran, hari ini di-highlight emas.
- Tap tanggal → detail card: tanggal Masehi + Jawa (hariJawa bulanJawa tahunAJ AJ · windu), weton, neptu (rincian), arti pasaran, unsur, **Makna Hari (DINA_INFO: ikon arti unsur filosofi)**, Makna Pasaran (penjelasanArti), kotak Peruntungan (warna border merah bila buruk), kotak Wuku (urutan/hariKe/nama/dewa/deskripsi), kotak Mangsa.
- Paling bawah: `GlosariumCard`.

**WetonCalculatorScreen.js** (Tab 2 Cek Weton)
- Input DD/MM/YYYY → `calculateWeton()` → validasi `isValidDate` → set `result` (spread `getJavaneseDate` + insight + pasaranInfo + dinaInfo + watakWeton + pancasuda + wukuLahir + mangsaLahir + hariNaas) → animasi fade+slide.
- **Urutan kartu hasil**: (1) Weton utama + stats neptu; (2) Info Dina [ikon arti, filosofi, watak, unsur·keterangan]; (3) Info Pasaran [grid arti/unsur/arah/warna + watakPemilik]; (4) Watak Primbon [neptuWatak: nama, ringkasan, detail + horoGrid rejeki/jodoh/karier + saranBox]; (5) Makna Pasaran; (6) Detail Unsur; (7) Detail Arah & Warna; (8) divider "✦ HOROSKOP JAWA ✦"; (9) Watak Weton 35 [watak + rejeki/jodoh/karier + kelebihan/kekurangan (plusBox/minusBox) + saran]; (10) Pancasuda [nama diwarnai baik/buruk]; (11) Wuku Lahir [dewa, deskripsi, bakat/keberuntungan/pantangan/pohon·burung]; (12) Zodiak Mangsa; (13) **Hari Pantangan (Naas)** [weton ulang + naas dina&pasaran + saranBox disclaimer]; (14) disclaimer; (15) GlosariumCard.

**KecocokanScreen.js** (Tab 3 Kecocokan)
- Helper `DateInput` di luar komponen — terima `styles` + `colors` via prop (konvensi!).
- 2 input tanggal (pria/wanita) → `calculatePadangan` → kartu weton pria & wanita + kartu hasil `PADANGAN_INFO[sisa]` (nama, ringkasan, detail, saranBox).

**DewasaAyuScreen.js** (Tab 4 Hari Baik)
- Picker acara (`EVENT_KEYS` dari DEWASA_AYU_INFO), rentang 30/90/180 hari, tanggal mulai (default hari ini), weton user opsional → `findGoodDays` → list hasil (tanggal, weton, kualitas, alasan[]) + disclaimer.

**OnboardingScreen.js**
- 3 slide (`SLIDES`: kalender / weton&kecocokan / hari baik), ScrollView horizontal paging, dots, tombol Lanjut/Mulai + Lewati → `onFinish` → set flag `onboarding_seen`.

---

## 5. Konvensi UI / Styling (WAJIB diikuti screen baru)

- Tiap screen/komponen: `const { colors } = useTheme()` lalu `const styles = useMemo(() => getStyles(colors), [colors])`. Styles = factory `const getStyles = (colors) => StyleSheet.create({...})` — BUKAN statis.
- Kartu: `BlurView intensity={20}` (kartu biasa) / `40` (highlight), `tint={colors.blurTint}`, borderRadius 24, padding 22, bg `colors.cardBg`, border `colors.cardBorder`, `overflow: 'hidden'`, marginBottom 16.
- Pola sub-elemen umum: `sectionHeader` (ikon + judul uppercase emas), `detailSubSection` (kotak gelap label+teks), `horoGrid`/`horoItem`, `plusBox`/`minusBox` (hijau/oranye), `saranBox` (ikon bulb + teks italic).
- Animasi: `Animated` fade + slide-up, `useNativeDriver: true`.
- Layout: `centerWrapper` maxWidth 500.
- Komponen helper di luar komponen utama → WAJIB terima `styles` + `colors` via prop (kecuali komponen self-contained spt GlosariumCard yang panggil useTheme sendiri).
- `KeyboardAvoidingView` behavior: iOS `'padding'`, Android `undefined` (JANGAN 'height').
- Screen baru → daftarkan di `App.js` (import + render kondisional + entri TABS).

---

## 6. Menjalankan & Build

```bash
npm start        # Expo dev server
npm run web      # Web (kalau modul aneh: npm run web -- -c buat clear cache)
npm run android  # Android
```
- Install deps: `npm install --ignore-scripts --legacy-peer-deps --no-package-lock`
- Build APK: GitHub Actions manual (Run workflow) — JDK 17, `expo prebuild`, `gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a` → APK ~12-15MB, artifact `primbon-jawa-apk`. Debug-signed (belum bisa Play Store).
- EAS alternatif: `npx eas-cli build -p android --profile preview` (projectId di app.json).

---

## 7. app.json — poin penting

- `icon` & `web.favicon`: `./assets/icon-wayang.png`
- `splash`: `./assets/splash-icon.png`, bg `#1A120B`
- `android.adaptiveIcon`: foreground `icon-wayang.png`, background & monochrome masih file android-icon-*.png
- `android.package`: `com.anonymous.kalender_jawa` — **JANGAN ganti** (putus identitas EAS/kredensial)
- Hermes + ProGuard + shrinkResources aktif; `userInterfaceStyle: automatic`
- `extra.eas.projectId`: 3926df7b-1add-4f64-b73c-483f9ba8f380

---

## 8. Status & Sisa Pekerjaan

**SELESAI:** P1–P5 (kalender, weton, kecocokan, peruntungan, bulan/tahun Jawa, dewasa ayu, wuku, mangsa, tema, onboarding, horoskop lengkap) · P6 (perkaya data: DINA_INFO, neptuWatak+, PASARAN_INFO+, glosarium) · P7 (hari pantangan/naas) · icon wayang · fix react-dom mismatch · safe-area tab bar · CI manual.

**SISA (lihat plan.md):** build APK rilis (signing key buat Play Store), deploy web Vercel/Netlify, notifikasi harian (butuh expo-notifications), animasi transisi antar tab, lockfile (deps masih ngambang), persistensi native (storage masih memory).

---

## 9. Riwayat Perubahan (ringkas, terbaru dulu)

### 16 Jul 2026 — P8: Glosarium Halaman Mandiri + Mulai Mentoring
- `GlosariumScreen.js` baru — full-screen mandiri (gradient, header + tombol X, accordion per istilah). Dibuka via tombol `?` di header App.js (state `showGlossary`, gate render sebelum tab, pola sama onboarding).
- `GlosariumCard` dicabut dari WetonCalculatorScreen & CalendarScreen, file komponen DIHAPUS — `src/components/` kosong lagi.
- **Mode Mentor aktif** (lihat plan.md): user belajar JS dari nol. Progres: JS-1..3 lulus, JS-4 (modulo) berhenti di 3 soal terakhir.

### 15 Jul 2026 — P7: Hari Pantangan per Weton
- `getHariNaas(date)` di javaneseLogic — weton ulang (35 hari) + naas telung dina/pasaran (offset +2 inklusif). Verified: Senin Legi → Rabu Pon.
- Kartu "Hari Pantangan (Naas)" di WetonCalculatorScreen + disclaimer varian tradisi.

### 13 Jul 2026 — Fix Tab Bar + Kebijakan Repo
- `react-native-safe-area-context` ~5.7.0 dipasang (sebelumnya diblok; bypass via `--ignore-scripts`). App.js pakai `useSafeAreaInsets` — ganti hardcode padding Platform. Fix tab bar ketutup nav sistem HP.
- History rewrite: strip semua trailer `Co-Authored-By: Claude` (20 commit) + force push; aturan anti-trailer dicatat global + project.
- Konvensi 1-branch `master` ditetapkan; branch `dev` dihapus; CI jadi manual-only (`workflow_dispatch`).
- Hapus 3 PNG mati (icon.png, favicon.png, android-icon-foreground.png); 3 yang masih direferensikan app.json dipertahankan.

### 13 Jul 2026 — P6: Perkaya Data Makna
- `DINA_INFO` baru (7 hari); `neptuWatak` + rejeki/jodoh/karier/saran; `PASARAN_INFO` + watakPemilik/keterangan; `edukasiData.js` GLOSARIUM 9 istilah + `GlosariumCard` accordion (komponen pertama di src/components/). 12 commit atomic.

### 12 Jul 2026 — Icon Wayang + Fix Web + CI
- Launcher + tab bar pakai `icon-wayang.png` (tintColor). Fix `react-dom` pin exact 19.2.3 (error "Incompatible React versions" di web). CI: paths-ignore md, concurrency, actions v5 (lalu jadi manual-only 13 Jul).

### 11 Jul 2026 — Horoskop Jawa Lengkap + Rename
- 4 sistem horoskop (Watak 35 Weton, Wuku Lahir diperluas, Pancasuda, Zodiak Mangsa diperluas) sebagai kartu di WetonCalculatorScreen. Rename package/app → primbon-app (android.package DIBIARKAN). Tab bar padding Android (digantikan safe-area 13 Jul).

### 10 Jul 2026 — Fix Bug Batch 1 + Build Infra
- `isValidDate()` semua form; dedup PERUNTUNGAN_SKOR → field `skor` di PERUNTUNGAN_INFO; mangsa leap-year fix; KeyboardAvoidingView Android `undefined`; Hermes+ProGuard+eas.json; GitHub Actions build APK; APK arm64-only ~12-15MB; hapus package-lock dari repo.
