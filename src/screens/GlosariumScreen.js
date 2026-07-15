import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GLOSARIUM } from '../data/edukasiData';
import { typography } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Halaman mandiri glosarium istilah Jawa — dibuka dari tombol ? di header.
export default function GlosariumScreen({ onClose }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <View style={[styles.inner, { paddingTop: insets.top + 12 }]}>
        <View style={styles.header}>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.title}>Glosarium</Text>
            <Text style={styles.subtitle}>Istilah penanggalan & primbon Jawa</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.centerWrapper}>
            {GLOSARIUM.map((item, i) => {
              const open = openIndex === i;
              return (
                <BlurView key={item.istilah} intensity={20} tint={colors.blurTint} style={styles.card}>
                  <TouchableOpacity style={styles.itemHeader} onPress={() => toggle(i)} activeOpacity={0.7}>
                    <Text style={styles.itemIkon}>{item.ikon}</Text>
                    <Text style={styles.itemTitle}>{item.istilah}</Text>
                    <Ionicons
                      name={open ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.textLight}
                    />
                  </TouchableOpacity>
                  {open && <Text style={styles.itemBody}>{item.penjelasan}</Text>}
                </BlurView>
              );
            })}
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
    fontSize: 28,
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
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: colors.cardBg,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  itemIkon: {
    fontSize: 18,
    marginRight: 10,
  },
  itemTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  itemBody: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 23,
    paddingBottom: 16,
    paddingLeft: 28,
    opacity: 0.9,
  },
});
