import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { generateCalendarMonth, getJavaneseDate, getJavaneseCalendar, getPeruntungan, getWuku, getMangsa } from '../utils/javaneseLogic';
import { PASARAN_INFO, PERUNTUNGAN_INFO, DINA_INFO } from '../data/primbonData';
import { typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import GlosariumCard from '../components/GlosariumCard';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  const maxWidth = width > 500 ? 500 : width;

  // Hari ini info
  const todayJavanese = getJavaneseDate(new Date());
  const todayPasaranInfo = PASARAN_INFO[todayJavanese.pasaran] || {};
  const todayPeruntunganKey = getPeruntungan(new Date());
  const todayPeruntungan = PERUNTUNGAN_INFO[todayPeruntunganKey] || {};
  const todayWuku = getWuku(new Date());
  const todayMangsa = getMangsa(new Date());

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      const days = generateCalendarMonth(currentDate.getFullYear(), currentDate.getMonth());
      setCalendarDays(days);
      setSelectedDay(null);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  }, [currentDate]);

  const styles = useMemo(() => getStyles(colors), [colors]);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const handleDayPress = (item) => {
    if (!item.isCurrentMonth) return;
    setSelectedDay(item);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.centerWrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Kalender Jawa</Text>
          <Text style={styles.subtitle}>Penanggalan Masehi & Pasaran</Text>
        </View>

        {/* === Kartu Weton Hari Ini === */}
        <BlurView intensity={20} tint={colors.blurTint} style={[styles.todayCard, { maxWidth: maxWidth - 30 }]}>
          <View style={styles.todayHeader}>
            <Ionicons name="sunny" size={20} color={colors.secondary} />
            <Text style={styles.todayTitle}>Hari Ini</Text>
          </View>
          <Text style={styles.todayWeton}>{todayJavanese.weton}</Text>
          <View style={styles.todayDetails}>
            <View style={styles.todayDetailItem}>
              <Text style={styles.todayDetailLabel}>Neptu</Text>
              <Text style={styles.todayDetailValue}>{todayJavanese.totalNeptu}</Text>
            </View>
            <View style={styles.todayDivider} />
            <View style={styles.todayDetailItem}>
              <Text style={styles.todayDetailLabel}>Unsur</Text>
              <Text style={styles.todayDetailValue}>{todayPasaranInfo.unsur || '-'}</Text>
            </View>
            <View style={styles.todayDivider} />
            <View style={styles.todayDetailItem}>
              <Text style={styles.todayDetailLabel}>Arah</Text>
              <Text style={styles.todayDetailValue}>{todayPasaranInfo.arah || '-'}</Text>
            </View>
          </View>
          {todayPeruntungan.nama && (
            <View style={styles.peruntunganRow}>
              <Text style={styles.peruntunganIkon}>{todayPeruntungan.ikon}</Text>
              <View style={styles.peruntunganInfo}>
                <Text style={styles.peruntunganLabel}>Peruntungan Hari Ini</Text>
                <Text style={[
                  styles.peruntunganNama,
                  { color: todayPeruntungan.baik ? colors.secondary : '#E63946' }
                ]}>
                  {todayPeruntungan.nama} — {todayPeruntungan.ringkasan}
                </Text>
              </View>
            </View>
          )}
          <View style={styles.peruntunganRow}>
            <Text style={styles.peruntunganIkon}>🗓️</Text>
            <View style={styles.peruntunganInfo}>
              <Text style={styles.peruntunganLabel}>Wuku ke-{todayWuku.urutan} · hari ke-{todayWuku.hariKe}</Text>
              <Text style={[styles.peruntunganNama, { color: colors.secondary }]}>
                {todayWuku.nama} — {todayWuku.dewa}
              </Text>
            </View>
          </View>
          <View style={styles.peruntunganRow}>
            <Text style={styles.peruntunganIkon}>{todayMangsa.ikon}</Text>
            <View style={styles.peruntunganInfo}>
              <Text style={styles.peruntunganLabel}>Mangsa {todayMangsa.no} · {todayMangsa.rentang}</Text>
              <Text style={[styles.peruntunganNama, { color: colors.secondary }]}>
                {todayMangsa.nama} — {todayMangsa.ciri}
              </Text>
            </View>
          </View>
        </BlurView>

        {/* === Kartu Kalender Utama === */}
        <BlurView intensity={30} tint={colors.blurTint} style={[styles.calendarCard, { maxWidth: maxWidth - 30 }]}>
          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={goToPrevMonth} style={styles.navButton} activeOpacity={0.6}>
              <Ionicons name="chevron-back" size={22} color={colors.secondary} />
            </TouchableOpacity>
            <View style={styles.monthTextContainer}>
              <Text style={styles.monthText}>
                {MONTH_NAMES[currentDate.getMonth()]}
              </Text>
              <Text style={styles.yearText}>
                {currentDate.getFullYear()}
              </Text>
              {(() => {
                const jc = getJavaneseCalendar(new Date(currentDate.getFullYear(), currentDate.getMonth(), 15));
                return (
                  <Text style={styles.javaMasaText}>
                    {jc.bulanJawa} {jc.tahunAJ} AJ
                  </Text>
                );
              })()}
            </View>
            <TouchableOpacity onPress={goToNextMonth} style={styles.navButton} activeOpacity={0.6}>
              <Ionicons name="chevron-forward" size={22} color={colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Days Header */}
          <View style={styles.daysHeaderRow}>
            {DAY_NAMES.map((day, index) => (
              <View key={index} style={styles.dayHeaderCell}>
                <Text style={[styles.dayHeaderText, index === 0 && styles.sundayHeaderText]}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <Animated.View style={[styles.gridContainer, { opacity: fadeAnim }]}>
            {calendarDays.map((item, index) => {
              const isSunday = item.date.getDay() === 0;
              const todayStatus = isToday(item.date);
              const isSelected = selectedDay && item.isCurrentMonth &&
                item.date.getDate() === selectedDay.date.getDate();

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.cellWrapper}
                  onPress={() => handleDayPress(item)}
                  activeOpacity={item.isCurrentMonth ? 0.6 : 1}
                >
                  <View
                    style={[
                      styles.cell,
                      !item.isCurrentMonth && styles.cellDisabled,
                      todayStatus && styles.cellToday,
                      isSelected && !todayStatus && styles.cellSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        isSunday && item.isCurrentMonth && styles.sundayText,
                        !item.isCurrentMonth && styles.disabledText,
                        todayStatus && styles.todayDateText,
                      ]}
                    >
                      {item.day}
                    </Text>

                    <Text
                      style={[
                        styles.pasaranText,
                        !item.isCurrentMonth && styles.disabledText,
                        todayStatus && { color: '#FFF' },
                      ]}
                      numberOfLines={1}
                    >
                      {item.javanese.pasaran}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </BlurView>

        {/* === Detail Tanggal yang Dipilih === */}
        {selectedDay && (
          <BlurView intensity={20} tint={colors.blurTint} style={[styles.detailCard, { maxWidth: maxWidth - 30 }]}>
            <View style={styles.detailHeader}>
              <Ionicons name="information-circle" size={20} color={colors.secondary} />
              <Text style={styles.detailTitle}>Detail Tanggal</Text>
            </View>
            <Text style={styles.detailDate}>
              {selectedDay.day} {MONTH_NAMES[selectedDay.date.getMonth()]} {selectedDay.date.getFullYear()}
            </Text>
            {(() => {
              const sj = getJavaneseCalendar(selectedDay.date);
              return (
                <Text style={styles.detailJavaDate}>
                  {sj.hariJawa} {sj.bulanJawa} {sj.tahunAJ} AJ · {sj.namaWindu}
                </Text>
              );
            })()}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weton</Text>
              <Text style={styles.detailValue}>{selectedDay.javanese.weton}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Neptu</Text>
              <Text style={styles.detailValue}>
                {selectedDay.javanese.totalNeptu} ({selectedDay.javanese.neptuDina} + {selectedDay.javanese.neptuPasaran})
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Arti Pasaran</Text>
              <Text style={styles.detailValue}>{PASARAN_INFO[selectedDay.javanese.pasaran]?.arti || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Unsur</Text>
              <Text style={styles.detailValue}>{PASARAN_INFO[selectedDay.javanese.pasaran]?.unsur || '-'}</Text>
            </View>
            {DINA_INFO[selectedDay.javanese.dina] && (
              <View style={styles.detailArtiBox}>
                <Text style={styles.detailArtiLabel}>
                  Makna Hari {selectedDay.javanese.dina}
                </Text>
                <Text style={styles.detailWukuDewa}>
                  {DINA_INFO[selectedDay.javanese.dina].ikon} {DINA_INFO[selectedDay.javanese.dina].arti} · Unsur {DINA_INFO[selectedDay.javanese.dina].unsur}
                </Text>
                <Text style={styles.detailArtiText}>{DINA_INFO[selectedDay.javanese.dina].filosofi}</Text>
              </View>
            )}
            {PASARAN_INFO[selectedDay.javanese.pasaran]?.penjelasanArti && (
              <View style={styles.detailArtiBox}>
                <Text style={styles.detailArtiLabel}>Makna Pasaran</Text>
                <Text style={styles.detailArtiText}>{PASARAN_INFO[selectedDay.javanese.pasaran].penjelasanArti}</Text>
              </View>
            )}
            {(() => {
              const selPeruntungan = PERUNTUNGAN_INFO[getPeruntungan(selectedDay.date)] || {};
              if (!selPeruntungan.nama) return null;
              return (
                <View style={[
                  styles.detailPeruntunganBox,
                  { borderColor: selPeruntungan.baik ? 'rgba(212, 175, 55, 0.35)' : 'rgba(230, 57, 70, 0.35)' }
                ]}>
                  <View style={styles.detailPeruntunganHeader}>
                    <Text style={styles.detailPeruntunganIkon}>{selPeruntungan.ikon}</Text>
                    <View style={styles.detailPeruntunganTitle}>
                      <Text style={styles.detailArtiLabel}>Peruntungan Hari</Text>
                      <Text style={[
                        styles.detailPeruntunganNama,
                        { color: selPeruntungan.baik ? colors.secondary : '#E63946' }
                      ]}>
                        {selPeruntungan.nama} — {selPeruntungan.ringkasan}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.detailArtiText}>{selPeruntungan.detail}</Text>
                </View>
              );
            })()}
            {(() => {
              const selWuku = getWuku(selectedDay.date);
              return (
                <View style={styles.detailWukuBox}>
                  <Text style={styles.detailArtiLabel}>
                    Wuku ke-{selWuku.urutan} (hari ke-{selWuku.hariKe})
                  </Text>
                  <Text style={styles.detailWukuNama}>{selWuku.nama}</Text>
                  <Text style={styles.detailWukuDewa}>Pelindung: {selWuku.dewa}</Text>
                  <Text style={styles.detailArtiText}>{selWuku.deskripsi}</Text>
                </View>
              );
            })()}
            {(() => {
              const selMangsa = getMangsa(selectedDay.date);
              return (
                <View style={styles.detailMangsaBox}>
                  <Text style={styles.detailArtiLabel}>
                    Pranata Mangsa {selMangsa.no} · {selMangsa.rentang}
                  </Text>
                  <Text style={styles.detailWukuNama}>{selMangsa.ikon} Mangsa {selMangsa.nama}</Text>
                  <Text style={styles.detailArtiText}>{selMangsa.deskripsi}</Text>
                </View>
              );
            })()}
          </BlurView>
        )}

        <View style={{ width: '100%', maxWidth, alignSelf: 'center' }}>
          <GlosariumCard />
        </View>

      </View>
    </ScrollView>
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
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
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

  /* === Today Card === */
  todayCard: {
    width: '100%',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    overflow: 'hidden',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    marginBottom: 16,
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  todayTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  todayWeton: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 14,
  },
  todayDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  todayDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  todayDetailLabel: {
    fontSize: 11,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  todayDetailValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  todayDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(213, 189, 175, 0.2)',
  },
  peruntunganRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 10,
  },
  peruntunganIkon: {
    fontSize: 24,
    marginRight: 10,
  },
  peruntunganInfo: {
    flex: 1,
  },
  peruntunganLabel: {
    fontSize: 10,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  peruntunganNama: {
    fontSize: 14,
    fontWeight: '800',
  },

  /* === Calendar Card === */
  calendarCard: {
    width: '100%',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
    marginBottom: 16,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  navButton: {
    padding: 10,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderRadius: 14,
  },
  monthTextContainer: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  yearText: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '600',
    marginTop: 2,
  },
  javaMasaText: {
    fontSize: 11,
    color: 'rgba(212, 175, 55, 0.7)',
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213, 189, 175, 0.15)',
    paddingBottom: 8,
  },
  dayHeaderCell: {
    width: '14.28%',
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B0A695',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sundayHeaderText: {
    color: '#E63946',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellWrapper: {
    width: '14.28%',
    aspectRatio: 0.75,
    padding: 1.5,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  cellDisabled: {
    opacity: 0.15,
    backgroundColor: 'transparent',
  },
  cellToday: {
    backgroundColor: colors.secondary,
    borderWidth: 0,
  },
  cellSelected: {
    backgroundColor: 'rgba(213, 189, 175, 0.2)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  todayDateText: {
    color: '#1A120B',
  },
  sundayText: {
    color: '#E63946',
  },
  pasaranText: {
    fontSize: 9,
    color: '#B0A695',
    marginTop: 3,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  disabledText: {
    color: colors.textLight,
  },

  /* === Detail Card === */
  detailCard: {
    width: '100%',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailDate: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213, 189, 175, 0.1)',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  detailArtiBox: {
    marginTop: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  detailArtiLabel: {
    fontSize: 10,
    color: colors.secondary,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  detailArtiText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  detailJavaDate: {
    fontSize: 12,
    color: 'rgba(212, 175, 55, 0.75)',
    fontWeight: '600',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  detailPeruntunganBox: {
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  detailPeruntunganHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailPeruntunganIkon: {
    fontSize: 26,
    marginRight: 12,
  },
  detailPeruntunganTitle: {
    flex: 1,
  },
  detailPeruntunganNama: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  detailWukuBox: {
    marginTop: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  detailWukuNama: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.secondary,
    marginTop: 2,
  },
  detailWukuDewa: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailMangsaBox: {
    marginTop: 12,
    backgroundColor: 'rgba(120, 180, 120, 0.06)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(120, 180, 120, 0.2)',
  },
});
