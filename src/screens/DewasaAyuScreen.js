import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { findGoodDays, isValidDate } from '../utils/javaneseLogic';
import { DEWASA_AYU_INFO } from '../data/primbonData';
import { typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const EVENT_KEYS = Object.keys(DEWASA_AYU_INFO);
const RANGE_OPTIONS = [
  { label: '1 Bulan', hari: 30 },
  { label: '3 Bulan', hari: 90 },
  { label: '6 Bulan', hari: 180 },
];

export default function DewasaAyuScreen() {
  const { colors } = useTheme();
  const today = new Date();
  const [eventKey, setEventKey] = useState('pernikahan');
  const [rangeHari, setRangeHari] = useState(90);

  // Tanggal mulai (default hari ini)
  const [sD, setSD] = useState(String(today.getDate()));
  const [sM, setSM] = useState(String(today.getMonth() + 1));
  const [sY, setSY] = useState(String(today.getFullYear()));

  // Weton pengguna (opsional)
  const [uD, setUD] = useState('');
  const [uM, setUM] = useState('');
  const [uY, setUY] = useState('');

  const [results, setResults] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const styles = useMemo(() => getStyles(colors), [colors]);

  const cari = () => {
    if (!isValidDate(sY, sM, sD)) { alert('Tanggal mulai tidak valid!'); return; }
    const start = new Date(parseInt(sY, 10), parseInt(sM, 10) - 1, parseInt(sD, 10));

    const end = new Date(start);
    end.setDate(end.getDate() + rangeHari);

    const userDate = (uD && uM && uY && isValidDate(uY, uM, uD))
      ? new Date(parseInt(uY, 10), parseInt(uM, 10) - 1, parseInt(uD, 10))
      : null;

    const found = findGoodDays(start, end, eventKey, userDate);
    setResults(found);

    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const event = DEWASA_AYU_INFO[eventKey];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.centerWrapper}>
          <View style={styles.header}>
            <Text style={styles.title}>Pencari Hari Baik</Text>
            <Text style={styles.subtitle}>Dewasa Ayu menurut primbon Jawa</Text>
          </View>

          {/* Pilih Acara */}
          <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
            <Text style={styles.cardTitle}>
              <Ionicons name="albums" size={16} color={colors.secondary} /> Jenis Acara
            </Text>
            <View style={styles.chipWrap}>
              {EVENT_KEYS.map((key) => {
                const ev = DEWASA_AYU_INFO[key];
                const active = key === eventKey;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setEventKey(key)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.chipIkon}>{ev.ikon}</Text>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{ev.nama}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.eventDesc}>{event.deskripsi}</Text>
          </BlurView>

          {/* Rentang & Tanggal Mulai */}
          <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
            <Text style={styles.cardTitle}>
              <Ionicons name="calendar" size={16} color={colors.secondary} /> Cari Mulai Tanggal
            </Text>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputHint}>Tanggal</Text>
                <TextInput style={styles.input} placeholder="DD" placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="numeric" value={sD} onChangeText={setSD} maxLength={2} />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputHint}>Bulan</Text>
                <TextInput style={styles.input} placeholder="MM" placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="numeric" value={sM} onChangeText={setSM} maxLength={2} />
              </View>
              <View style={[styles.inputWrapper, styles.inputYearWrapper]}>
                <Text style={styles.inputHint}>Tahun</Text>
                <TextInput style={styles.input} placeholder="YYYY" placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="numeric" value={sY} onChangeText={setSY} maxLength={4} />
              </View>
            </View>

            <Text style={styles.inputHint}>Dalam Rentang</Text>
            <View style={styles.rangeRow}>
              {RANGE_OPTIONS.map((opt) => {
                const active = opt.hari === rangeHari;
                return (
                  <TouchableOpacity
                    key={opt.hari}
                    style={[styles.rangeChip, active && styles.chipActive]}
                    onPress={() => setRangeHari(opt.hari)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BlurView>

          {/* Weton Pengguna (opsional) */}
          <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
            <Text style={styles.cardTitle}>
              <Ionicons name="person" size={16} color={colors.secondary} /> Weton Anda (opsional)
            </Text>
            <Text style={styles.optionalHint}>Isi untuk mempertimbangkan keselarasan dengan weton Anda</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputHint}>Tanggal</Text>
                <TextInput style={styles.input} placeholder="DD" placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="numeric" value={uD} onChangeText={setUD} maxLength={2} />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputHint}>Bulan</Text>
                <TextInput style={styles.input} placeholder="MM" placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="numeric" value={uM} onChangeText={setUM} maxLength={2} />
              </View>
              <View style={[styles.inputWrapper, styles.inputYearWrapper]}>
                <Text style={styles.inputHint}>Tahun</Text>
                <TextInput style={styles.input} placeholder="YYYY" placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="numeric" value={uY} onChangeText={setUY} maxLength={4} />
              </View>
            </View>
          </BlurView>

          <TouchableOpacity style={styles.button} onPress={cari} activeOpacity={0.8}>
            <Ionicons name="search" size={20} color="#1A120B" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Cari Hari Baik</Text>
          </TouchableOpacity>

          {/* Hasil */}
          {results && (
            <Animated.View style={{ opacity: fadeAnim, width: '100%', marginTop: 16 }}>
              {results.length === 0 ? (
                <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
                  <Text style={styles.emptyText}>
                    Tidak ada hari yang cukup baik untuk {event.nama.toLowerCase()} dalam rentang ini.
                    Coba perpanjang rentang pencarian.
                  </Text>
                </BlurView>
              ) : (
                <>
                  <Text style={styles.resultCount}>
                    {results.length} hari baik ditemukan {event.ikon}
                  </Text>
                  {results.slice(0, 20).map((item, i) => (
                    <BlurView
                      key={i}
                      intensity={20}
                      tint={colors.blurTint}
                      style={[
                        styles.resultCard,
                        item.kualitas === 'Sangat Baik' ? styles.resultTop : styles.resultNormal,
                      ]}
                    >
                      <View style={styles.resultHeader}>
                        <View style={styles.resultDateBox}>
                          <Text style={styles.resultDay}>{item.date.getDate()}</Text>
                          <Text style={styles.resultMonth}>{MONTH_NAMES[item.date.getMonth()].slice(0, 3)}</Text>
                          <Text style={styles.resultYear}>{item.date.getFullYear()}</Text>
                        </View>
                        <View style={styles.resultInfo}>
                          <Text style={styles.resultWeton}>{item.javanese.weton}</Text>
                          <View style={[
                            styles.kualitasBadge,
                            item.kualitas === 'Sangat Baik' ? styles.kualitasTop : styles.kualitasNormal,
                          ]}>
                            <Text style={styles.kualitasText}>{item.peruntungan.ikon} {item.kualitas}</Text>
                          </View>
                        </View>
                      </View>
                      {item.alasan.length > 0 && (
                        <View style={styles.alasanBox}>
                          {item.alasan.map((a, j) => (
                            <Text key={j} style={styles.alasanText}>• {a}</Text>
                          ))}
                        </View>
                      )}
                    </BlurView>
                  ))}
                  {results.length > 20 && (
                    <Text style={styles.moreText}>… dan {results.length - 20} hari baik lainnya</Text>
                  )}
                </>
              )}
              <Text style={styles.disclaimer}>
                * Panduan berdasarkan primbon Jawa umum. Keputusan akhir tetap di tangan Anda.
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 15, paddingTop: 40, paddingBottom: 100 },
  centerWrapper: { alignItems: 'center', width: '100%', maxWidth: 500, alignSelf: 'center' },
  header: { marginBottom: 24, alignItems: 'center' },
  title: {
    ...typography.title, fontSize: 30, color: colors.secondary,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10,
  },
  subtitle: { ...typography.subtitle, marginTop: 5, color: '#D5BDAF' },
  card: {
    width: '100%', borderRadius: 24, padding: 20, borderWidth: 1,
    borderColor: colors.cardBorder, marginBottom: 16,
    overflow: 'hidden', backgroundColor: colors.cardBg,
  },
  cardTitle: {
    fontSize: 15, fontWeight: '700', color: colors.primary,
    marginBottom: 16, letterSpacing: 0.5,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 12,
    paddingVertical: 8, paddingHorizontal: 12,
    borderWidth: 1, borderColor: 'rgba(213, 189, 175, 0.15)',
  },
  chipActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: colors.secondary,
  },
  chipIkon: { fontSize: 15, marginRight: 6 },
  chipText: { fontSize: 13, color: colors.textLight, fontWeight: '600' },
  chipTextActive: { color: colors.secondary, fontWeight: '800' },
  eventDesc: {
    fontSize: 13, color: colors.text, lineHeight: 20,
    marginTop: 14, fontStyle: 'italic', opacity: 0.85,
  },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  inputWrapper: { flex: 1, marginRight: 10 },
  inputYearWrapper: { flex: 1.5, marginRight: 0 },
  inputHint: {
    fontSize: 11, color: colors.textLight, marginBottom: 6, marginLeft: 5,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    height: 50, backgroundColor: colors.inputBg, borderWidth: 1,
    borderColor: 'rgba(213, 189, 175, 0.2)', borderRadius: 12,
    paddingHorizontal: 10, fontSize: 18, color: colors.text,
    textAlign: 'center', fontWeight: '700',
  },
  rangeRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  rangeChip: {
    flex: 1, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(213, 189, 175, 0.15)',
  },
  optionalHint: {
    fontSize: 12, color: colors.textLight, marginBottom: 14,
    marginTop: -8, fontStyle: 'italic',
  },
  button: {
    width: '100%', backgroundColor: colors.secondary, height: 55, borderRadius: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.secondary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12,
  },
  buttonIcon: { marginRight: 10 },
  buttonText: { color: '#1A120B', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },

  resultCount: {
    fontSize: 15, fontWeight: '800', color: colors.secondary,
    marginBottom: 14, textAlign: 'center', letterSpacing: 0.5,
  },
  resultCard: {
    width: '100%', borderRadius: 18, padding: 16, borderWidth: 1,
    marginBottom: 12, overflow: 'hidden',
  },
  resultTop: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  resultNormal: {
    backgroundColor: 'rgba(44, 30, 22, 0.5)',
    borderColor: 'rgba(213, 189, 175, 0.2)',
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center' },
  resultDateBox: {
    alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14, marginRight: 14,
  },
  resultDay: { fontSize: 24, fontWeight: '900', color: colors.text, lineHeight: 26 },
  resultMonth: {
    fontSize: 11, color: colors.secondary, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  resultYear: { fontSize: 10, color: colors.textLight },
  resultInfo: { flex: 1 },
  resultWeton: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 6 },
  kualitasBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8 },
  kualitasTop: { backgroundColor: 'rgba(212, 175, 55, 0.2)' },
  kualitasNormal: { backgroundColor: 'rgba(213, 189, 175, 0.12)' },
  kualitasText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  alasanBox: {
    marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(213, 189, 175, 0.12)',
  },
  alasanText: { fontSize: 12, color: colors.textLight, lineHeight: 20 },
  moreText: {
    fontSize: 13, color: colors.textLight, textAlign: 'center',
    marginTop: 4, marginBottom: 8, fontStyle: 'italic',
  },
  emptyText: { fontSize: 14, color: colors.text, lineHeight: 22, textAlign: 'center' },
  disclaimer: {
    fontSize: 11, color: colors.textLight, textAlign: 'center',
    marginTop: 12, lineHeight: 18, fontStyle: 'italic', opacity: 0.7,
  },
});
