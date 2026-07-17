import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getJavaneseDate, isValidDate, getWatakWeton, getPancasuda, getWuku, getMangsa, getHariNaas } from '../utils/javaneseLogic';
import { getPrimbonInsight, PASARAN_INFO, UNSUR_INFO, ARAH_INFO, WARNA_INFO, DINA_INFO } from '../data/primbonData';
import { typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import PantanganScreen from './PantanganScreen';

export default function WetonCalculatorScreen() {
  const { colors } = useTheme();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState(null);
  const [showPantangan, setShowPantangan] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const styles = useMemo(() => getStyles(colors), [colors]);

  const calculateWeton = () => {
    if (!isValidDate(year, month, day)) {
      alert('Masukkan tanggal, bulan, dan tahun yang valid!');
      return;
    }

    const inputDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    const javaneseData = getJavaneseDate(inputDate);
    const insight = getPrimbonInsight(javaneseData.totalNeptu);
    const pasaranInfo = PASARAN_INFO[javaneseData.pasaran] || {};
    const dinaInfo = DINA_INFO[javaneseData.dina] || {};

    setResult({
      dateStr: `${parseInt(day, 10)} / ${parseInt(month, 10)} / ${parseInt(year, 10)}`,
      birthDate: inputDate,
      ...javaneseData,
      insight,
      pasaranInfo,
      dinaInfo,
      watakWeton: getWatakWeton(inputDate),
      pancasuda: getPancasuda(inputDate),
      wukuLahir: getWuku(inputDate),
      mangsaLahir: getMangsa(inputDate),
      hariNaas: getHariNaas(inputDate),
    });

    fadeAnim.setValue(0);
    slideAnim.setValue(30);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Halaman detail tanggal pantangan (gate render lokal, pola GlosariumScreen)
  if (showPantangan && result) {
    return <PantanganScreen birthDate={result.birthDate} onClose={() => setShowPantangan(false)} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.centerWrapper}>
          <View style={styles.header}>
            <Text style={styles.title}>Kalkulator Weton</Text>
            <Text style={styles.subtitle}>Cari tahu weton dan karakter Anda</Text>
          </View>

          {/* === Form Input === */}
          <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
            <Text style={styles.label}>
              <Ionicons name="calendar-outline" size={16} color={colors.primary} /> Tanggal Lahir Masehi
            </Text>

            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputHint}>Tanggal</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="numeric"
                  value={day}
                  onChangeText={setDay}
                  maxLength={2}
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputHint}>Bulan</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="numeric"
                  value={month}
                  onChangeText={setMonth}
                  maxLength={2}
                />
              </View>
              <View style={[styles.inputWrapper, styles.inputYearWrapper]}>
                <Text style={styles.inputHint}>Tahun</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="numeric"
                  value={year}
                  onChangeText={setYear}
                  maxLength={4}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={calculateWeton} activeOpacity={0.8}>
              <Ionicons name="sparkles" size={20} color="#1A120B" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Cek Watak Saya</Text>
            </TouchableOpacity>
          </BlurView>

          {/* === Hasil Perhitungan === */}
          {result && (
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>

              {/* Kartu Weton Utama */}
              <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.resultMainCard]}>
                <View style={styles.resultHeader}>
                  <Ionicons name="star" size={28} color={colors.secondary} />
                  <Text style={styles.resultWetonLabel}>Weton Anda</Text>
                </View>
                <Text style={styles.resultWeton}>{result.weton}</Text>
                <Text style={styles.resultDate}>Lahir: {result.dateStr}</Text>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{result.totalNeptu}</Text>
                    <Text style={styles.statLabel}>Total Neptu</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{result.neptuDina}</Text>
                    <Text style={styles.statLabel}>Neptu Dina</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{result.neptuPasaran}</Text>
                    <Text style={styles.statLabel}>Neptu Pasaran</Text>
                  </View>
                </View>
              </BlurView>

              {/* ===== MAKNA KOMPONEN ===== */}
              <View style={styles.horoskopDivider}>
                <Text style={styles.horoskopDividerText}>✦ MAKNA KOMPONEN ✦</Text>
              </View>

              {/* Kartu Info Dina (Hari) */}
              {result.dinaInfo?.arti && (
                <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.pasaranIkon}>{result.dinaInfo.ikon}</Text>
                    <Text style={styles.sectionTitle}>Hari {result.dina} — {result.dinaInfo.arti}</Text>
                  </View>
                  <Text style={styles.detailPhilosophy}>{result.dinaInfo.filosofi}</Text>
                  <View style={styles.detailSubSection}>
                    <Text style={styles.detailSubLabel}>Watak</Text>
                    <Text style={styles.detailSubText}>{result.dinaInfo.watak}</Text>
                  </View>
                  <View style={styles.detailSubSection}>
                    <Text style={styles.detailSubLabel}>Unsur · Keterangan</Text>
                    <Text style={styles.detailSubText}>{result.dinaInfo.unsur} — {result.dinaInfo.keterangan}</Text>
                  </View>
                </BlurView>
              )}

              {/* Kartu Makna Pasaran — gabungan arti, watak pemilik, unsur, arah, warna */}
              <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="compass" size={18} color={colors.secondary} />
                  <Text style={styles.sectionTitle}>Makna Pasaran {result.pasaran}</Text>
                </View>
                {result.pasaranInfo.penjelasanArti && (
                  <Text style={styles.detailPhilosophy}>{result.pasaranInfo.penjelasanArti}</Text>
                )}
                <View style={styles.pasaranGrid}>
                  <View style={styles.pasaranItem}>
                    <Text style={styles.pasaranItemLabel}>Arti</Text>
                    <Text style={styles.pasaranItemValue}>{result.pasaranInfo.arti || '-'}</Text>
                  </View>
                  <View style={styles.pasaranItem}>
                    <Text style={styles.pasaranItemLabel}>Unsur</Text>
                    <Text style={styles.pasaranItemValue}>{result.pasaranInfo.unsur || '-'}</Text>
                  </View>
                  <View style={styles.pasaranItem}>
                    <Text style={styles.pasaranItemLabel}>Arah</Text>
                    <Text style={styles.pasaranItemValue}>{result.pasaranInfo.arah || '-'}</Text>
                  </View>
                  <View style={styles.pasaranItem}>
                    <Text style={styles.pasaranItemLabel}>Warna</Text>
                    <Text style={styles.pasaranItemValue}>{result.pasaranInfo.warna || '-'}</Text>
                  </View>
                </View>
                {result.pasaranInfo.watakPemilik && (
                  <View style={styles.detailSubSection}>
                    <Text style={styles.detailSubLabel}>Watak Pemilik Pasaran</Text>
                    <Text style={styles.detailSubText}>{result.pasaranInfo.watakPemilik}</Text>
                  </View>
                )}
                {result.pasaranInfo.keterangan && (
                  <View style={styles.detailSubSection}>
                    <Text style={styles.detailSubLabel}>Keterangan</Text>
                    <Text style={styles.detailSubText}>{result.pasaranInfo.keterangan}</Text>
                  </View>
                )}

                {UNSUR_INFO[result.pasaranInfo.unsur] && (
                  <>
                    <View style={styles.insightDivider} />
                    <View style={styles.sectionHeader}>
                      <Text style={styles.pasaranIkon}>{UNSUR_INFO[result.pasaranInfo.unsur].ikon}</Text>
                      <Text style={styles.sectionTitle}>Unsur {result.pasaranInfo.unsur}</Text>
                    </View>
                    <Text style={styles.detailPhilosophy}>{UNSUR_INFO[result.pasaranInfo.unsur].filosofi}</Text>
                    <View style={styles.detailSubSection}>
                      <Text style={styles.detailSubLabel}>Sifat</Text>
                      <Text style={styles.detailSubText}>{UNSUR_INFO[result.pasaranInfo.unsur].sifat}</Text>
                    </View>
                    <View style={styles.detailSubSection}>
                      <Text style={styles.detailSubLabel}>Kelemahan</Text>
                      <Text style={styles.detailSubText}>{UNSUR_INFO[result.pasaranInfo.unsur].kelemahan}</Text>
                    </View>
                  </>
                )}

                {ARAH_INFO[result.pasaranInfo.arah] && (
                  <>
                    <View style={styles.insightDivider} />
                    <View style={styles.sectionHeader}>
                      <Text style={styles.pasaranIkon}>{ARAH_INFO[result.pasaranInfo.arah].ikon}</Text>
                      <Text style={styles.sectionTitle}>Arah {result.pasaranInfo.arah}</Text>
                    </View>
                    <Text style={styles.detailPhilosophy}>{ARAH_INFO[result.pasaranInfo.arah].filosofi}</Text>
                    <View style={styles.detailSubSection}>
                      <Text style={styles.detailSubLabel}>Makna</Text>
                      <Text style={styles.detailSubText}>{ARAH_INFO[result.pasaranInfo.arah].makna}</Text>
                    </View>
                  </>
                )}

                {WARNA_INFO[result.pasaranInfo.warna] && (
                  <>
                    <View style={styles.insightDivider} />
                    <View style={styles.sectionHeader}>
                      <Text style={styles.pasaranIkon}>{WARNA_INFO[result.pasaranInfo.warna].ikon}</Text>
                      <Text style={styles.sectionTitle}>Warna {result.pasaranInfo.warna}</Text>
                    </View>
                    <Text style={styles.detailPhilosophy}>{WARNA_INFO[result.pasaranInfo.warna].filosofi}</Text>
                    <View style={styles.detailSubSection}>
                      <Text style={styles.detailSubLabel}>Makna</Text>
                      <Text style={styles.detailSubText}>{WARNA_INFO[result.pasaranInfo.warna].makna}</Text>
                    </View>
                  </>
                )}
              </BlurView>

              {/* ===== WATAK & NASIB KELAHIRAN ===== */}
              <View style={styles.horoskopDivider}>
                <Text style={styles.horoskopDividerText}>✦ WATAK & NASIB KELAHIRAN ✦</Text>
              </View>

              {/* Kartu Watak Primbon (menurut neptu) */}
              <BlurView intensity={40} tint={colors.blurTint} style={[styles.card, styles.insightCard]}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="book" size={18} color={colors.secondary} />
                  <Text style={styles.sectionTitle}>Watak Primbon</Text>
                </View>
                <Text style={styles.sourceLabel}>Menurut hitungan neptu — 12 golongan (neptu {result.totalNeptu})</Text>
                <Text style={styles.insightName}>{result.insight.nama}</Text>
                <Text style={styles.insightSummary}>"{result.insight.ringkasan}"</Text>
                <View style={styles.insightDivider} />
                <Text style={styles.insightDetail}>{result.insight.detail}</Text>
                {result.insight.rejeki && result.insight.rejeki !== '-' && (
                  <>
                    <View style={styles.horoGrid}>
                      <View style={styles.horoItem}>
                        <Text style={styles.detailSubLabel}>💰 Rejeki</Text>
                        <Text style={styles.detailSubText}>{result.insight.rejeki}</Text>
                      </View>
                      <View style={styles.horoItem}>
                        <Text style={styles.detailSubLabel}>❤️ Jodoh</Text>
                        <Text style={styles.detailSubText}>{result.insight.jodoh}</Text>
                      </View>
                      <View style={styles.horoItem}>
                        <Text style={styles.detailSubLabel}>💼 Karier</Text>
                        <Text style={styles.detailSubText}>{result.insight.karier}</Text>
                      </View>
                    </View>
                    <View style={styles.saranBox}>
                      <Ionicons name="bulb-outline" size={14} color={colors.secondary} />
                      <Text style={styles.saranText}>{result.insight.saran}</Text>
                    </View>
                  </>
                )}
              </BlurView>

              {/* Kartu Watak Weton (35 Weton) */}
              {result.watakWeton && (
                <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.horoskopCard]}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.pasaranIkon}>🔮</Text>
                    <Text style={styles.sectionTitle}>Watak Weton {result.weton}</Text>
                  </View>
                  <Text style={styles.sourceLabel}>Menurut kombinasi 35 weton (dina × pasaran)</Text>
                  <Text style={styles.detailPhilosophy}>{result.watakWeton.watak}</Text>
                  <View style={styles.horoGrid}>
                    <View style={styles.horoItem}>
                      <Text style={styles.detailSubLabel}>💰 Rejeki</Text>
                      <Text style={styles.detailSubText}>{result.watakWeton.rejeki}</Text>
                    </View>
                    <View style={styles.horoItem}>
                      <Text style={styles.detailSubLabel}>❤️ Jodoh</Text>
                      <Text style={styles.detailSubText}>{result.watakWeton.jodoh}</Text>
                    </View>
                    <View style={styles.horoItem}>
                      <Text style={styles.detailSubLabel}>💼 Karier</Text>
                      <Text style={styles.detailSubText}>{result.watakWeton.karier}</Text>
                    </View>
                  </View>
                  <View style={styles.plusMinusRow}>
                    <View style={styles.plusBox}>
                      <Text style={styles.detailSubLabel}>Kelebihan</Text>
                      <Text style={styles.detailSubText}>{result.watakWeton.kelebihan}</Text>
                    </View>
                    <View style={styles.minusBox}>
                      <Text style={styles.detailSubLabel}>Kekurangan</Text>
                      <Text style={styles.detailSubText}>{result.watakWeton.kekurangan}</Text>
                    </View>
                  </View>
                  <View style={styles.saranBox}>
                    <Ionicons name="bulb-outline" size={14} color={colors.secondary} />
                    <Text style={styles.saranText}>{result.watakWeton.saran}</Text>
                  </View>
                </BlurView>
              )}

              {/* Kartu Pancasuda */}
              {result.pancasuda && (
                <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.horoskopCard]}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.pasaranIkon}>{result.pancasuda.ikon}</Text>
                    <Text style={styles.sectionTitle}>Pancasuda</Text>
                  </View>
                  <Text style={styles.sourceLabel}>Menurut siklus 7 nasib dari total neptu</Text>
                  <Text style={[styles.insightName, { color: result.pancasuda.baik ? colors.secondary : '#E67E22' }]}>
                    {result.pancasuda.nama}
                  </Text>
                  <Text style={styles.insightSummary}>"{result.pancasuda.makna}"</Text>
                  <View style={styles.insightDivider} />
                  <Text style={styles.detailPhilosophy}>{result.pancasuda.watak}</Text>
                  <View style={styles.detailSubSection}>
                    <Text style={styles.detailSubLabel}>Nasib</Text>
                    <Text style={styles.detailSubText}>{result.pancasuda.nasib}</Text>
                  </View>
                  <View style={styles.saranBox}>
                    <Ionicons name="bulb-outline" size={14} color={colors.secondary} />
                    <Text style={styles.saranText}>{result.pancasuda.saran}</Text>
                  </View>
                </BlurView>
              )}

              {/* Kartu Wuku Lahir */}
              {result.wukuLahir && (
                <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.horoskopCard]}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.pasaranIkon}>🗓️</Text>
                    <Text style={styles.sectionTitle}>Wuku Lahir — {result.wukuLahir.nama}</Text>
                  </View>
                  <Text style={styles.sourceLabel}>Menurut siklus Pawukon 210 hari</Text>
                  <Text style={styles.wukuDewaText}>Pelindung: {result.wukuLahir.dewa}</Text>
                  <Text style={styles.detailPhilosophy}>{result.wukuLahir.deskripsi}</Text>
                  <View style={styles.horoGrid}>
                    <View style={styles.horoItem}>
                      <Text style={styles.detailSubLabel}>🎯 Bakat</Text>
                      <Text style={styles.detailSubText}>{result.wukuLahir.bakat}</Text>
                    </View>
                    <View style={styles.horoItem}>
                      <Text style={styles.detailSubLabel}>🍀 Keberuntungan</Text>
                      <Text style={styles.detailSubText}>{result.wukuLahir.keberuntungan}</Text>
                    </View>
                    <View style={styles.horoItem}>
                      <Text style={styles.detailSubLabel}>⛔ Pantangan</Text>
                      <Text style={styles.detailSubText}>{result.wukuLahir.pantangan}</Text>
                    </View>
                    <View style={styles.horoItem}>
                      <Text style={styles.detailSubLabel}>🌳 Pohon / 🐦 Burung</Text>
                      <Text style={styles.detailSubText}>{result.wukuLahir.pohon} · {result.wukuLahir.burung}</Text>
                    </View>
                  </View>
                </BlurView>
              )}

              {/* Kartu Zodiak Mangsa */}
              {result.mangsaLahir && (
                <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.horoskopCard]}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.pasaranIkon}>{result.mangsaLahir.ikon}</Text>
                    <Text style={styles.sectionTitle}>Zodiak Mangsa — {result.mangsaLahir.nama}</Text>
                  </View>
                  <Text style={styles.sourceLabel}>Menurut Pranata Mangsa — musim saat kelahiran</Text>
                  <Text style={styles.wukuDewaText}>{result.mangsaLahir.rentang} · Elemen {result.mangsaLahir.elemen}</Text>
                  <Text style={styles.detailPhilosophy}>{result.mangsaLahir.watak}</Text>
                  <View style={styles.detailSubSection}>
                    <Text style={styles.detailSubLabel}>🍀 Keberuntungan</Text>
                    <Text style={styles.detailSubText}>{result.mangsaLahir.keberuntungan}</Text>
                  </View>
                </BlurView>
              )}

              {/* ===== HARI PANTANGAN ===== */}
              <View style={styles.horoskopDivider}>
                <Text style={styles.horoskopDividerText}>✦ HARI PANTANGAN ✦</Text>
              </View>

              {/* Kartu Hari Pantangan (Naas) */}
              {result.hariNaas && (
                <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.horoskopCard]}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.pasaranIkon}>⛔</Text>
                    <Text style={styles.sectionTitle}>Hari Pantangan (Naas)</Text>
                  </View>
                  <Text style={styles.detailPhilosophy}>
                    Menurut tradisi, hari-hari berikut kurang baik bagi pemilik weton {result.weton} untuk memulai hajat besar (pernikahan, pindah rumah, buka usaha).
                  </Text>
                  <View style={styles.horoGrid}>
                    <View style={styles.horoItem}>
                      <Text style={styles.detailSubLabel}>🔁 Weton Ulang</Text>
                      <Text style={styles.detailSubText}>
                        Setiap {result.hariNaas.wetonLahir} (berulang tiap 35 hari) — hari kelahiran sendiri, baiknya untuk laku prihatin/introspeksi, bukan hajatan.
                      </Text>
                    </View>
                    <View style={styles.horoItem}>
                      <Text style={styles.detailSubLabel}>⚠️ Naas Dina & Pasaran</Text>
                      <Text style={styles.detailSubText}>
                        Hari {result.hariNaas.naasDina} dan pasaran {result.hariNaas.naasPasaran} (telung dinane lan telung pasarane). Paling dihindari saat keduanya bertemu: {result.hariNaas.naasKombinasi}.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.saranBox}>
                    <Ionicons name="bulb-outline" size={14} color={colors.secondary} />
                    <Text style={styles.saranText}>
                      Perhitungan naas memiliki banyak varian antar daerah dan kitab — jadikan panduan tradisi, bukan kepastian.
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.pantanganButton}
                    onPress={() => setShowPantangan(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="calendar" size={16} color="#1A120B" style={styles.buttonIcon} />
                    <Text style={styles.pantanganButtonText}>Lihat Tanggal Pantangan 90 Hari</Text>
                  </TouchableOpacity>
                </BlurView>
              )}

              <Text style={styles.horoskopDisclaimer}>
                * Horoskop Jawa adalah panduan tradisi primbon, bukan kepastian.
              </Text>

            </Animated.View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingTop: 40,
    paddingBottom: 100,
  },
  centerWrapper: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: colors.secondary,
    fontSize: 32,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: {
    ...typography.subtitle,
    marginTop: 5,
    color: '#D5BDAF',
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },
  inputYearWrapper: {
    flex: 1.5,
    marginRight: 0,
  },
  inputHint: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 6,
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 55,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: 'rgba(213, 189, 175, 0.2)',
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '700',
  },
  button: {
    backgroundColor: colors.secondary,
    height: 55,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#1A120B',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  /* === Result Main Card === */
  resultMainCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  resultWetonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  resultWeton: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  resultDate: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.secondary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: 'rgba(213, 189, 175, 0.2)',
  },

  /* === Pasaran Card === */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sourceLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontStyle: 'italic',
    marginTop: -10,
    marginBottom: 12,
  },
  pantanganButton: {
    backgroundColor: colors.secondary,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  pantanganButtonText: {
    color: '#1A120B',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pasaranGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pasaranItem: {
    width: '50%',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  pasaranItemLabel: {
    fontSize: 11,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pasaranItemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },

  /* === Insight Card === */
  insightCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  insightName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  insightSummary: {
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  insightDivider: {
    height: 1,
    backgroundColor: 'rgba(213, 189, 175, 0.15)',
    marginBottom: 16,
  },
  insightDetail: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 26,
    textAlign: 'center',
  },
  pasaranIkon: {
    fontSize: 20,
    marginRight: 8,
  },
  detailPhilosophy: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  detailSubSection: {
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 4,
  },
  detailSubLabel: {
    fontSize: 10,
    color: colors.secondary,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  detailSubText: {
    fontSize: 14,
    color: colors.primary,
    lineHeight: 22,
  },

  /* === Horoskop === */
  horoskopDivider: {
    alignItems: 'center',
    marginVertical: 20,
  },
  horoskopDividerText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: 3,
  },
  horoskopCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  horoGrid: {
    marginTop: 4,
  },
  horoItem: {
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 14,
  },
  plusMinusRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  plusBox: {
    flex: 1,
    backgroundColor: 'rgba(120, 180, 120, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  minusBox: {
    flex: 1,
    backgroundColor: 'rgba(230, 126, 34, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  saranBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  saranText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  wukuDewaText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: -8,
  },
  horoskopDisclaimer: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
