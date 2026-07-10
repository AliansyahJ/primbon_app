// src/utils/javaneseLogic.js
import { BULAN_JAWA, WINDU_NAMES, DEWASA_AYU_INFO, PERUNTUNGAN_INFO } from '../data/primbonData';
import { WUKU_DATA } from '../data/wukuData';
import { PRANATA_MANGSA } from '../data/mangsaData';
import { WATAK_WETON } from '../data/watakWetonData';
import { PANCASUDA_INFO } from '../data/pancasudaData';

const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const MONTH_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const dayOfYear = (month, day, year) => {
  const base = MONTH_CUMULATIVE[month - 1] + day;
  return (isLeapYear(year) && month > 2) ? base + 1 : base;
};

export const isValidDate = (year, month, day) => {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10) - 1;
  const y = parseInt(year, 10);
  if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || m < 0 || m > 11 || y < 1000) return false;
  const date = new Date(y, m, d);
  return date.getDate() === d && date.getMonth() === m && date.getFullYear() === y;
};

// Anchor Pawukon: 7 September 2025 = hari pertama Wuku Sinta (index 0)
const WUKU_ANCHOR_DAYS = Math.floor(Date.UTC(2025, 8, 7) / (1000 * 60 * 60 * 24));

const PASARAN_NAMES = ['Wage', 'Kliwon', 'Legi', 'Pahing', 'Pon'];
const PASARAN_NEPTU = [4, 8, 5, 9, 7]; // Sesuai urutan Wage, Kliwon, Legi, Pahing, Pon

const DINA_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DINA_NEPTU = [5, 4, 3, 7, 8, 6, 9]; // Sesuai urutan Minggu-Sabtu

/**
 * Mendapatkan selisih hari dari 1 Januari 1970 (Epoch)
 * @param {Date} date - Tanggal yang ingin dihitung
 * @returns {number} Selisih hari
 */
const getDaysSinceEpoch = (date) => {
  // Menggunakan UTC agar timezone lokal tidak menyebabkan off-by-one error
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(utc / (1000 * 60 * 60 * 24));
};

/**
 * Mendapatkan detail Javanese (Pasaran, Dina, Neptu) untuk suatu tanggal
 * @param {Date} date - Tanggal yang ingin dicari (Masehi)
 * @returns {Object} Javanese Date Details
 */
export const getJavaneseDate = (date) => {
  const daysSinceEpoch = getDaysSinceEpoch(date);
  
  // Pasaran cycle is 5 days. 1 Jan 1970 was Wage (Index 0)
  // Menangani modulo angka negatif dengan benar di JS
  const pasaranIndex = ((daysSinceEpoch % 5) + 5) % 5;
  const dinaIndex = date.getDay(); // 0: Sunday, 6: Saturday

  const pasaranName = PASARAN_NAMES[pasaranIndex];
  const pasaranNeptu = PASARAN_NEPTU[pasaranIndex];
  
  const dinaName = DINA_NAMES[dinaIndex];
  const dinaNeptu = DINA_NEPTU[dinaIndex];

  const totalNeptu = pasaranNeptu + dinaNeptu;

  return {
    dina: dinaName,
    pasaran: pasaranName,
    neptuDina: dinaNeptu,
    neptuPasaran: pasaranNeptu,
    totalNeptu: totalNeptu,
    weton: `${dinaName} ${pasaranName}`,
  };
};

/**
 * Konversi Gregorian ke Julian Day Number
 */
const gregorianToJD = (year, month, day) => {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
};

/**
 * Konversi Julian Day Number ke tanggal Hijriah (kalender tabular)
 */
const jdToHijri = (jd) => {
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hMonth = Math.floor((24 * l3) / 709);
  const hDay = l3 - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;
  return { year: hYear, month: hMonth, day: hDay };
};

/**
 * Mendapatkan bulan Jawa, tahun AJ, dan nama windu dari tanggal Masehi
 * Offset: tahun Jawa (AJ) = tahun Hijriah (AH) + 512
 * Referensi: 1 Suro 1957 AJ = 19 Juli 2023 = 1 Muharram 1445 AH → offset = 1957 - 1445 = 512
 * @param {Date} date
 * @returns {{ bulanJawa, tahunAJ, hariJawa, namaWindu }}
 */
export const getJavaneseCalendar = (date) => {
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const { year: hYear, month: hMonth, day: hDay } = jdToHijri(jd);
  const tahunAJ = hYear + 512;
  return {
    bulanJawa: BULAN_JAWA[hMonth - 1],
    tahunAJ,
    hariJawa: hDay,
    namaWindu: WINDU_NAMES[(tahunAJ - 1) % 8],
  };
};

/**
 * Hitung peruntungan harian (7 kemungkinan: Sri/Lungguh/Gedhong/Lara/Pati/Sida/Pegat)
 * Rumus: (neptu dina + neptu pasaran) mod 7
 * @param {Date} date
 * @returns {number} sisa mod 7 (0–6)
 */
export const getPeruntungan = (date) => {
  const { neptuDina, neptuPasaran } = getJavaneseDate(date);
  return (neptuDina + neptuPasaran) % 7;
};

/**
 * Hitung padangan (kecocokan jodoh)
 * Rumus: (totalNeptu pria + totalNeptu wanita) mod 9
 * @param {Date} date1 - tanggal lahir pria
 * @param {Date} date2 - tanggal lahir wanita
 * @returns {{ sisa, totalNeptu, neptaPria, neptuWanita }}
 */
export const calculatePadangan = (date1, date2) => {
  const j1 = getJavaneseDate(date1);
  const j2 = getJavaneseDate(date2);
  const total = j1.totalNeptu + j2.totalNeptu;
  return {
    sisa: total % 9,
    totalNeptu: total,
    neptuPria: j1.totalNeptu,
    neptuWanita: j2.totalNeptu,
    wetonPria: j1.weton,
    wetonWanita: j2.weton,
  };
};

// Mangsa terurut menurut hari-dalam-tahun awalnya (untuk pencarian)
// Pakai tahun kabisat untuk startDoy agar sorting konsisten
const MANGSA_BY_START = PRANATA_MANGSA
  .map((m) => ({ ...m, startDoy: dayOfYear(m.startMonth, m.startDay, 2024) }))
  .sort((a, b) => a.startDoy - b.startDoy);

/**
 * Hitung Pranata Mangsa (musim tani Jawa) untuk suatu tanggal
 * @param {Date} date
 * @returns {Object} data mangsa aktif dari PRANATA_MANGSA
 */
export const getMangsa = (date) => {
  const doy = dayOfYear(date.getMonth() + 1, date.getDate(), date.getFullYear());
  // Cari mangsa terakhir yang startDoy <= doy.
  // Jika tanggal sebelum mangsa pertama (awal tahun), berarti mangsa terakhir
  // dari daftar (Kapitu) yang bermula akhir Desember dan berlanjut ke tahun baru.
  let found = MANGSA_BY_START[MANGSA_BY_START.length - 1];
  for (const m of MANGSA_BY_START) {
    if (m.startDoy <= doy) found = m;
    else break;
  }
  return found;
};

/**
 * Hitung Wuku (siklus Pawukon 210 hari) untuk suatu tanggal
 * @param {Date} date
 * @returns {Object} { index, urutan, hariKe, ...WUKU_DATA[index] }
 */
export const getWuku = (date) => {
  const days = getDaysSinceEpoch(date);
  const diff = days - WUKU_ANCHOR_DAYS;
  // Posisi dalam siklus 210 hari (menangani modulo negatif)
  const posisi = ((diff % 210) + 210) % 210;
  const index = Math.floor(posisi / 7);
  const hariKe = (posisi % 7) + 1; // hari ke-1..7 dalam wuku

  return {
    index,
    urutan: index + 1,
    hariKe,
    ...WUKU_DATA[index],
  };
};

/**
 * Watak 35 Weton — ramalan karakter berdasar kombinasi Dina × Pasaran
 * @param {Date} date
 * @returns {Object|null} data watak weton atau null bila tidak ditemukan
 */
export const getWatakWeton = (date) => {
  const { weton } = getJavaneseDate(date);
  return WATAK_WETON[weton] || null;
};

/**
 * Pancasuda — ramalan nasib berdasar total neptu weton
 * @param {Date} date
 * @returns {Object} { index, ...PANCASUDA_INFO[index] }
 */
export const getPancasuda = (date) => {
  const { totalNeptu } = getJavaneseDate(date);
  // Hitung neptu melalui siklus 7 kategori Pancasuda
  const index = ((totalNeptu - 1) % 7 + 7) % 7;
  return { index, ...PANCASUDA_INFO[index] };
};

/**
 * Cari hari-hari baik (Dewasa Ayu) dalam rentang tanggal untuk suatu acara
 * @param {Date} startDate - tanggal mulai pencarian
 * @param {Date} endDate - tanggal akhir pencarian (inklusif)
 * @param {string} eventKey - kunci di DEWASA_AYU_INFO (pernikahan, pindah, usaha, ...)
 * @param {Date|null} userDate - opsional, tanggal lahir pengguna untuk keselarasan weton
 * @returns {Array} list hari baik terurut skor menurun
 */
export const findGoodDays = (startDate, endDate, eventKey, userDate = null) => {
  const event = DEWASA_AYU_INFO[eventKey];
  if (!event) return [];

  const userNeptu = userDate ? getJavaneseDate(userDate).totalNeptu : null;

  const results = [];
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  while (cursor <= end) {
    const date = new Date(cursor);
    const jd = getJavaneseDate(date);
    const peruntunganKey = (jd.neptuDina + jd.neptuPasaran) % 7;
    const peruntungan = PERUNTUNGAN_INFO[peruntunganKey] || {};

    // Pantangan → langsung diskualifikasi
    const kenaPantang =
      event.dinaPantang.includes(jd.dina) || event.pasaranPantang.includes(jd.pasaran);

    if (!kenaPantang) {
      let skor = peruntungan.skor || 0;
      const alasan = [];

      if (peruntungan.baik) {
        alasan.push(`Peruntungan ${peruntungan.nama} (${peruntungan.ringkasan})`);
      }
      if (event.dinaBaik.includes(jd.dina)) {
        skor += 2;
        alasan.push(`Hari ${jd.dina} baik untuk ${event.nama.toLowerCase()}`);
      }
      if (event.pasaranBaik.includes(jd.pasaran)) {
        skor += 2;
        alasan.push(`Pasaran ${jd.pasaran} cocok`);
      }

      // Keselarasan weton pengguna (opsional)
      if (userNeptu !== null) {
        const gabungan = (userNeptu + jd.totalNeptu) % 7;
        const gabunganInfo = PERUNTUNGAN_INFO[gabungan];
        if (gabunganInfo && gabunganInfo.baik) {
          skor += 2;
          alasan.push('Selaras dengan weton Anda');
        }
      }

      if (skor >= 3) {
        results.push({
          date,
          javanese: jd,
          peruntungan,
          skor,
          kualitas: skor >= 6 ? 'Sangat Baik' : 'Baik',
          alasan,
        });
      }
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  // Urutkan skor menurun, lalu tanggal menaik
  results.sort((a, b) => b.skor - a.skor || a.date - b.date);
  return results;
};

/**
 * Membuat list tanggal untuk kalender bulanan
 * @param {number} year - Tahun
 * @param {number} month - Bulan (0 - 11)
 * @returns {Array} List object hari
 */
export const generateCalendarMonth = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 for Sunday
  
  let calendarDays = [];
  
  // Padding for previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = 0; i < startingDayOfWeek; i++) {
    const d = new Date(year, month - 1, prevMonthLastDay - startingDayOfWeek + i + 1);
    const javanese = getJavaneseDate(d);
    calendarDays.push({
      date: d,
      day: d.getDate(),
      isCurrentMonth: false,
      javanese,
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const javanese = getJavaneseDate(d);
    calendarDays.push({
      date: d,
      day: i,
      isCurrentMonth: true,
      javanese,
    });
  }
  
  // Padding for next month
  const remainingSlots = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remainingSlots; i++) {
    const d = new Date(year, month + 1, i);
    const javanese = getJavaneseDate(d);
    calendarDays.push({
      date: d,
      day: i,
      isCurrentMonth: false,
      javanese,
    });
  }
  
  return calendarDays;
};
