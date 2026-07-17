import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getJavaneseDate, getHariNaas, findBadDays } from '../utils/javaneseLogic';
import { typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const DAY_LONG = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const RANGE_HARI = 90;

// Halaman detail tanggal pantangan (naas) 90 hari ke depan — dibuka dari
// kartu Hari Pantangan di WetonCalculatorScreen (gate render lokal).
export default function PantanganScreen({ birthDate, onClose }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const { wetonLahir, naasKombinasi, badDays } = useMemo(() => {
    const start = new Date();
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + RANGE_HARI);
    return {
      wetonLahir: getJavaneseDate(birthDate).weton,
      naasKombinasi: getHariNaas(birthDate).naasKombinasi,
      badDays: findBadDays(birthDate, start, end),
    };
  }, [birthDate]);

  const formatDate = (d) =>
    `${DAY_LONG[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;

return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={[styles.inner, { paddingTop: insets.top + 12 }]}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={colors.secondary} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.title}>Tanggal Pantangan</Text>
            <Text style={styles.subtitle}>
              Weton {wetonLahir} · {RANGE_HARI} hari ke depan
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centerWrapper}>
            {/* Ringkasan rumus */}
            <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.infoCard]}>
              <View style={styles.infoRow}>
                <Text style={styles.infoIkon}>🔁</Text>
                <Text style={styles.infoText}>
                  <Text style={styles.infoBold}>Weton Ulang</Text> — setiap {wetonLahir}, berulang tiap 35 hari.
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoIkon}>⚠️</Text>
                <Text style={styles.infoText}>
                  <Text style={styles.infoBold}>Naas Kombinasi</Text> — setiap {naasKombinasi} (telung dinane lan telung pasarane), tiap 35 hari.
                </Text>
              </View>
            </BlurView>

            {/* List tanggal */}
            {badDays.map((item) => (
              <BlurView
                key={item.date.getTime()}
                intensity={20}
                tint={colors.blurTint}
                style={styles.card}
              >
                <View style={styles.itemRow}>
                  <Text style={styles.itemIkon}>{item.jenis === 'Weton Ulang' ? '🔁' : '⚠️'}</Text>
                  <View style={styles.itemBody}>
                    <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.itemWeton}>
                      {item.javanese.weton} · Neptu {item.javanese.totalNeptu}
                    </Text>
                    <View style={[
                      styles.jenisBadge,
                      item.jenis === 'Weton Ulang' ? styles.badgeUlang : styles.badgeNaas,
                    ]}>
                      <Text style={styles.jenisBadgeText}>{item.jenis}</Text>
                    </View>
                    <Text style={styles.itemAlasan}>{item.alasan}</Text>
                  </View>
                </View>
              </BlurView>
            ))}

            <Text style={styles.disclaimer}>
              * Hindari memulai hajat besar di tanggal-tanggal ini menurut tradisi.
              Perhitungan naas punya banyak varian antar daerah/kitab — panduan, bukan kepastian.
            </Text>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  headerTitleWrap: {
    flex: 1,
  },
  title: {
    ...typography.title,
    color: colors.secondary,
    fontSize: 26,
  },
  subtitle: {
    ...typography.subtitle,
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  centerWrapper: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
  },
  infoCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  infoIkon: {
    fontSize: 16,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '800',
    color: colors.primary,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemIkon: {
    fontSize: 22,
    marginRight: 12,
    marginTop: 2,
  },
  itemBody: {
    flex: 1,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  itemWeton: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
    marginTop: 2,
  },
  jenisBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 8,
    borderWidth: 1,
  },
  badgeUlang: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderColor: 'rgba(212, 175, 55, 0.35)',
  },
  badgeNaas: {
    backgroundColor: 'rgba(230, 57, 70, 0.12)',
    borderColor: 'rgba(230, 57, 70, 0.35)',
  },
  jenisBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemAlasan: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 19,
    fontStyle: 'italic',
    marginTop: 8,
    opacity: 0.85,
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    opacity: 0.7,
    paddingHorizontal: 10,
  },
});
