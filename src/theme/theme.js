// src/theme/theme.js

// ============================================================
// PALET GELAP (default) — Dark Royal Javanese
// ============================================================
export const darkColors = {
  background: '#1A120B',
  surface: 'rgba(60, 42, 33, 0.65)',
  primary: '#D5BDAF',
  secondary: '#D4AF37', // Emas
  text: '#F5EBE0',
  textLight: '#B0A695',
  border: 'rgba(213, 189, 175, 0.2)',
  pasaranText: '#E3D5CA',
  holidayText: '#E63946',
  todayBackground: 'rgba(212, 175, 55, 0.2)',
  gradientStart: '#2C1E16',
  gradientEnd: '#0F0A06',
  // Token turunan untuk kartu glassmorphism
  cardBg: 'rgba(44, 30, 22, 0.4)',
  cardBorder: 'rgba(213, 189, 175, 0.25)',
  inputBg: 'rgba(0,0,0,0.3)',
  blurTint: 'dark',
};

// ============================================================
// PALET TERANG — Cream & Gold
// ============================================================
export const lightColors = {
  background: '#F5EFE6',
  surface: 'rgba(255, 250, 240, 0.7)',
  primary: '#6B4F3A', // Coklat tua untuk teks utama
  secondary: '#B8860B', // Emas gelap agar kontras di latar terang
  text: '#2C1E16',
  textLight: '#8A7B6A',
  border: 'rgba(107, 79, 58, 0.2)',
  pasaranText: '#5A4632',
  holidayText: '#C0392B',
  todayBackground: 'rgba(184, 134, 11, 0.18)',
  gradientStart: '#FBF6EC',
  gradientEnd: '#EAD9C0',
  cardBg: 'rgba(255, 252, 245, 0.55)',
  cardBorder: 'rgba(107, 79, 58, 0.18)',
  inputBg: 'rgba(255,255,255,0.6)',
  blurTint: 'light',
};

export const palettes = { dark: darkColors, light: lightColors };

// Ekspor default `colors` = gelap, untuk kompatibilitas mundur bila ada
// modul yang meng-import langsung tanpa useTheme.
export const colors = darkColors;

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 14,
  },
};
