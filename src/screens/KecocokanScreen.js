import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getJavaneseDate, calculatePadangan, isValidDate } from '../utils/javaneseLogic';
import { PADANGAN_INFO, PASARAN_INFO } from '../data/primbonData';
import { typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

function DateInput({ label, day, month, year, onDay, onMonth, onYear, styles, colors }) {
  return (
    <View style={styles.dateInputGroup}>
      <Text style={styles.inputGroupLabel}>
        <Ionicons name="person" size={13} color={colors.secondary} /> {label}
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
            onChangeText={onDay}
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
            onChangeText={onMonth}
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
            onChangeText={onYear}
            maxLength={4}
          />
        </View>
      </View>
    </View>
  );
}

export default function KecocokanScreen() {
  const { colors } = useTheme();
  const [pD, setPD] = useState('');
  const [pM, setPM] = useState('');
  const [pY, setPY] = useState('');
  const [wD, setWD] = useState('');
  const [wM, setWM] = useState('');
  const [wY, setWY] = useState('');
  const [result, setResult] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const styles = useMemo(() => getStyles(colors), [colors]);

  const hitung = () => {
    if (!isValidDate(pY, pM, pD)) { alert('Tanggal lahir Pria tidak valid!'); return; }
    if (!isValidDate(wY, wM, wD)) { alert('Tanggal lahir Wanita tidak valid!'); return; }

    const datePria = new Date(parseInt(pY, 10), parseInt(pM, 10) - 1, parseInt(pD, 10));
    const dateWanita = new Date(parseInt(wY, 10), parseInt(wM, 10) - 1, parseInt(wD, 10));

    const padangan = calculatePadangan(datePria, dateWanita);
    const hasilPadangan = PADANGAN_INFO[padangan.sisa] || PADANGAN_INFO[0];

    const wetonPriaDetail = getJavaneseDate(datePria);
    const wetonWanitaDetail = getJavaneseDate(dateWanita);
    const pasaranPria = PASARAN_INFO[wetonPriaDetail.pasaran] || {};
    const pasaranWanita = PASARAN_INFO[wetonWanitaDetail.pasaran] || {};

    setResult({
      ...padangan,
      hasilPadangan,
      pasaranPria,
      pasaranWanita,
      wetonPriaDetail,
      wetonWanitaDetail,
      tanggalPria: `${parseInt(pD)} / ${parseInt(pM)} / ${pY}`,
      tanggalWanita: `${parseInt(wD)} / ${parseInt(wM)} / ${wY}`,
    });

    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
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
            <Text style={styles.title}>Kecocokan Jodoh</Text>
            <Text style={styles.subtitle}>Petungan weton dua insan</Text>
          </View>

          {/* Form Input */}
          <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
            <Text style={styles.cardTitle}>
              <Ionicons name="heart" size={16} color={colors.secondary} /> Masukkan Tanggal Lahir
            </Text>
            <DateInput
              label="Pria"
              day={pD} month={pM} year={pY}
              onDay={setPD} onMonth={setPM} onYear={setPY}
              styles={styles} colors={colors}
            />
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Ionicons name="infinite" size={20} color={colors.secondary} />
              <View style={styles.dividerLine} />
            </View>
            <DateInput
              label="Wanita"
              day={wD} month={wM} year={wY}
              onDay={setWD} onMonth={setWM} onYear={setWY}
              styles={styles} colors={colors}
            />
            <TouchableOpacity style={styles.button} onPress={hitung} activeOpacity={0.8}>
              <Ionicons name="heart" size={20} color="#1A120B" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Cek Kecocokan</Text>
            </TouchableOpacity>
          </BlurView>

          {/* Hasil */}
          {result && (
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>

              {/* Kartu Weton Pria & Wanita */}
              <View style={styles.wetonRow}>
                <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.wetonCard]}>
                  <Text style={styles.wetonGender}>♂ Pria</Text>
                  <Text style={styles.wetonName}>{result.wetonPriaDetail.weton}</Text>
                  <Text style={styles.wetonSub}>{result.tanggalPria}</Text>
                  <Text style={styles.wetonNeptu}>Neptu {result.neptuPria}</Text>
                  <Text style={styles.wetonUnsur}>{result.pasaranPria.unsur || '-'} · {result.pasaranPria.arah || '-'}</Text>
                </BlurView>
                <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.wetonCard]}>
                  <Text style={styles.wetonGender}>♀ Wanita</Text>
                  <Text style={styles.wetonName}>{result.wetonWanitaDetail.weton}</Text>
                  <Text style={styles.wetonSub}>{result.tanggalWanita}</Text>
                  <Text style={styles.wetonNeptu}>Neptu {result.neptuWanita}</Text>
                  <Text style={styles.wetonUnsur}>{result.pasaranWanita.unsur || '-'} · {result.pasaranWanita.arah || '-'}</Text>
                </BlurView>
              </View>

              {/* Kartu Hasil Padangan */}
              <BlurView
                intensity={40}
                tint={colors.blurTint}
                style={[styles.card, styles.hasilCard,
                  result.hasilPadangan.skor >= 7
                    ? styles.hasilBaik
                    : result.hasilPadangan.skor >= 4
                      ? styles.hasilSedang
                      : styles.hasilBuruk
                ]}
              >
                <View style={styles.hasilHeader}>
                  <Text style={styles.hasilIkon}>{result.hasilPadangan.ikon}</Text>
                  <View>
                    <Text style={styles.hasilLabel}>Hasil Padangan</Text>
                    <Text style={styles.hasilNama}>{result.hasilPadangan.nama}</Text>
                  </View>
                </View>

                <View style={styles.neptuBadge}>
                  <Text style={styles.neptuBadgeText}>
                    {result.neptuPria} + {result.neptuWanita} = {result.totalNeptu} → sisa {result.sisa}
                  </Text>
                </View>

                <Text style={styles.hasilRingkasan}>"{result.hasilPadangan.ringkasan}"</Text>
                <View style={styles.hasilDivider} />
                <Text style={styles.hasilDetail}>{result.hasilPadangan.detail}</Text>

                <View style={styles.saranBox}>
                  <Ionicons name="bulb-outline" size={14} color={colors.secondary} />
                  <Text style={styles.saranText}>{result.hasilPadangan.saran}</Text>
                </View>
              </BlurView>

            </Animated.View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1 },
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
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  dateInputGroup: {
    marginBottom: 4,
  },
  inputGroupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    height: 50,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: 'rgba(213, 189, 175, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: colors.secondary,
    height: 55,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  buttonIcon: { marginRight: 10 },
  buttonText: {
    color: '#1A120B',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  /* Weton Cards */
  wetonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  wetonCard: {
    flex: 1,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  wetonGender: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  wetonName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  wetonSub: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  wetonNeptu: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.secondary,
    marginBottom: 4,
  },
  wetonUnsur: {
    fontSize: 11,
    color: colors.primary,
    textAlign: 'center',
  },

  /* Hasil Card */
  hasilCard: {
    borderWidth: 1.5,
  },
  hasilBaik: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  hasilSedang: {
    backgroundColor: 'rgba(213, 189, 175, 0.06)',
    borderColor: 'rgba(213, 189, 175, 0.3)',
  },
  hasilBuruk: {
    backgroundColor: 'rgba(230, 57, 70, 0.06)',
    borderColor: 'rgba(230, 57, 70, 0.3)',
  },
  hasilHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  hasilIkon: {
    fontSize: 36,
    marginRight: 14,
  },
  hasilLabel: {
    fontSize: 11,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  hasilNama: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.secondary,
  },
  neptuBadge: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  neptuBadgeText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  hasilRingkasan: {
    fontSize: 16,
    color: colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 14,
  },
  hasilDivider: {
    height: 1,
    backgroundColor: 'rgba(213, 189, 175, 0.15)',
    marginBottom: 14,
  },
  hasilDetail: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  saranBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  saranText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
