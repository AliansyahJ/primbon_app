import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { getJavaneseDate, isValidDate } from '../utils/javaneseLogic';
import { getPrimbonInsight, PASARAN_INFO, UNSUR_INFO, ARAH_INFO, WARNA_INFO } from '../data/primbonData';
import { typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

export default function WetonCalculatorScreen() {
  const { colors } = useTheme();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState(null);

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

    setResult({
      dateStr: `${parseInt(day, 10)} / ${parseInt(month, 10)} / ${parseInt(year, 10)}`,
      ...javaneseData,
      insight,
      pasaranInfo,
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

              {/* Kartu Info Pasaran */}
              <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="compass" size={18} color={colors.secondary} />
                  <Text style={styles.sectionTitle}>Info Pasaran {result.pasaran}</Text>
                </View>
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
              </BlurView>

              {/* Kartu Watak Primbon */}
              <BlurView intensity={40} tint={colors.blurTint} style={[styles.card, styles.insightCard]}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="book" size={18} color={colors.secondary} />
                  <Text style={styles.sectionTitle}>Watak Primbon</Text>
                </View>
                <Text style={styles.insightName}>{result.insight.nama}</Text>
                <Text style={styles.insightSummary}>"{result.insight.ringkasan}"</Text>
                <View style={styles.insightDivider} />
                <Text style={styles.insightDetail}>{result.insight.detail}</Text>
              </BlurView>

              {/* Kartu Makna Pasaran */}
              {result.pasaranInfo.penjelasanArti && (
                <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.pasaranIkon}>{PASARAN_INFO[result.pasaran]?.warna ? '📜' : '📜'}</Text>
                    <Text style={styles.sectionTitle}>Makna Pasaran {result.pasaran}</Text>
                  </View>
                  <Text style={styles.detailPhilosophy}>{result.pasaranInfo.penjelasanArti}</Text>
                </BlurView>
              )}

              {/* Kartu Detail Unsur */}
              {UNSUR_INFO[result.pasaranInfo.unsur] && (
                <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.pasaranIkon}>{UNSUR_INFO[result.pasaranInfo.unsur].ikon}</Text>
                    <Text style={styles.sectionTitle}>{UNSUR_INFO[result.pasaranInfo.unsur].nama}</Text>
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
                </BlurView>
              )}

              {/* Kartu Detail Arah & Warna */}
              {ARAH_INFO[result.pasaranInfo.arah] && (
                <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.pasaranIkon}>{ARAH_INFO[result.pasaranInfo.arah].ikon}</Text>
                    <Text style={styles.sectionTitle}>{ARAH_INFO[result.pasaranInfo.arah].nama}</Text>
                  </View>
                  <Text style={styles.detailPhilosophy}>{ARAH_INFO[result.pasaranInfo.arah].filosofi}</Text>
                  <View style={styles.detailSubSection}>
                    <Text style={styles.detailSubLabel}>Makna</Text>
                    <Text style={styles.detailSubText}>{ARAH_INFO[result.pasaranInfo.arah].makna}</Text>
                  </View>

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
              )}

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
});
