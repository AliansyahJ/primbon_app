import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getJavaneseDate, getNasibSemuaWeton } from '../utils/javaneseLogic';
import { typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Halaman Cek Nasib: nasib semua 35 weton pada satu tanggal —
// dibuka dari detail tanggal di CalendarScreen (gate render lokal).
export default function NasibScreen({ date, onClose }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const { javanese, baik, buruk } = useMemo(() => {
    const semua = getNasibSemuaWeton(date);
    const sortSkor = (a, b) => (b.peruntungan?.skor || 0) - (a.peruntungan?.skor || 0);
    return {
      javanese: getJavaneseDate(date),
      baik: semua.filter((s) => s.peruntungan?.baik).sort(sortSkor),
      buruk: semua.filter((s) => !s.peruntungan?.baik).sort(sortSkor),
    };
  }, [date]);

  const renderItem = (item) => (
    <View key={item.weton} style={styles.itemRow}>
      <Text style={styles.itemIkon}>{item.peruntungan?.ikon}</Text>
      <View style={styles.itemBody}>
        <View style={styles.itemTitleRow}>
          <Text style={styles.itemWeton}>{item.weton}</Text>
          {item.isWetonUlang && (
            <View style={[styles.flagBadge, styles.badgeUlang]}>
              <Text style={styles.flagBadgeText}>Weton Ulang</Text>
            </View>
          )}
          {item.isNaas && (
            <View style={[styles.flagBadge, styles.badgeNaas]}>
              <Text style={styles.flagBadgeText}>Hari Naas</Text>
            </View>
          )}
        </View>
        <Text style={styles.itemDetail}>
          Neptu {item.totalNeptu} ·{' '}
          <Text style={{ color: item.peruntungan?.baik ? colors.secondary : '#E63946', fontWeight: '800' }}>
            {item.peruntungan?.nama}
          </Text>
          {' — '}{item.peruntungan?.ringkasan}
        </Text>
      </View>
    </View>
  );

return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={[styles.inner, { paddingTop: insets.top + 12 }]}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={colors.secondary} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.title}>Cek Nasib Weton</Text>
            <Text style={styles.subtitle}>
              {date.getDate()} {MONTH_NAMES[date.getMonth()]} {date.getFullYear()} · {javanese.weton}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centerWrapper}>
            <Text style={styles.explainText}>
              Gabungan neptu tiap weton lahir dengan neptu hari ini ({javanese.totalNeptu}),
              dihitung sisa bagi 7 — rumus yang sama dengan keselarasan weton di pencari hari baik.
            </Text>

            <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.cardBaik]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sunny" size={18} color={colors.secondary} />
                <Text style={styles.sectionTitle}>Selaras — {baik.length} weton</Text>
              </View>
              {baik.map(renderItem)}
            </BlurView>

            <BlurView intensity={20} tint={colors.blurTint} style={[styles.card, styles.cardBuruk]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="cloudy-night" size={18} color="#E63946" />
                <Text style={[styles.sectionTitle, { color: '#E63946' }]}>
                  Kurang Selaras — {buruk.length} weton
                </Text>
              </View>
              {buruk.map(renderItem)}
            </BlurView>

            <Text style={styles.disclaimer}>
              * Panduan tradisi primbon, bukan kepastian. Badge "Weton Ulang" / "Hari Naas"
              menandai weton yang tanggal ini termasuk hari pantangannya.
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
  explainText: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
  },
  cardBaik: {
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  cardBuruk: {
    borderColor: 'rgba(230, 57, 70, 0.3)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213, 189, 175, 0.08)',
  },
  itemIkon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 1,
  },
  itemBody: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  itemWeton: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  itemDetail: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
    marginTop: 2,
  },
  flagBadge: {
    borderRadius: 7,
    paddingVertical: 2,
    paddingHorizontal: 7,
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
  flagBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
    opacity: 0.7,
    paddingHorizontal: 10,
  },
});
