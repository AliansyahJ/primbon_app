// src/utils/storage.js
//
// Penyimpanan ringan lintas platform TANPA dependency native.
// - Web: pakai window.localStorage (persisten antar sesi).
// - Native: fallback ke memori (hanya bertahan selama sesi aplikasi berjalan).
//
// Catatan: async-storage tidak dipakai karena policy environment memblokir
// install native module. Bila kelak butuh persistensi penuh di mobile,
// ganti implementasi di sini saja — API-nya sudah async.

const memoryStore = {};

const hasLocalStorage = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch (e) {
    return false;
  }
};

export const storageGet = async (key) => {
  try {
    if (hasLocalStorage()) return window.localStorage.getItem(key);
    return key in memoryStore ? memoryStore[key] : null;
  } catch (e) {
    return null;
  }
};

export const storageSet = async (key, value) => {
  try {
    if (hasLocalStorage()) {
      window.localStorage.setItem(key, value);
      return;
    }
    memoryStore[key] = value;
  } catch (e) {
    // abaikan kegagalan penyimpanan
  }
};
