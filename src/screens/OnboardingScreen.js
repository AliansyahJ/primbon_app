import React, { useState, useRef, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'calendar',
    title: 'Kalender Jawa Lengkap',
    desc: 'Lihat tanggal Jawa (Dina, Pasaran, Wuku, Mangsa) untuk setiap hari. Ketahui hari-hari penting dan makna di baliknya.',
  },
  {
    icon: 'heart',
    title: 'Cek Weton & Kecocokan',
    desc: 'Hitung weton Anda, ketahui karakter dan peruntungan. Cek kecocokan jodoh dua insan berdasar petungan weton.',
  },
  {
    icon: 'star',
    title: 'Hari Baik & Dewasa Ayu',
    desc: 'Temukan hari-hari baik untuk hajatan, pernikahan, atau acara penting menurut primbon Jawa.',
  },
];

export default function OnboardingScreen({ onFinish }) {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const goToSlide = (index) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFinish} style={styles.skipButton}>
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={styles.slide}>
            <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
              <View style={styles.iconCircle}>
                <Ionicons name={slide.icon} size={64} color={colors.secondary} />
              </View>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideDesc}>{slide.desc}</Text>
            </BlurView>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, currentIndex === i && styles.dotActive]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.nextText}>
            {currentIndex === SLIDES.length - 1 ? 'Mulai' : 'Lanjut'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#1A120B" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  slideTitle: {
    ...typography.title,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDesc: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 50,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textLight,
    marginHorizontal: 4,
    opacity: 0.3,
  },
  dotActive: {
    backgroundColor: colors.secondary,
    opacity: 1,
    width: 24,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    gap: 8,
  },
  nextText: {
    color: '#1A120B',
    fontSize: 16,
    fontWeight: '700',
  },
});
