import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GLOSARIUM } from '../data/edukasiData';
import { useTheme } from '../theme/ThemeContext';

// Aktifkan LayoutAnimation di Android (expand/collapse halus)
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Kartu accordion "Apa itu…?" — daftar istilah Jawa yang bisa di-expand.
export default function GlosariumCard() {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <BlurView intensity={20} tint={colors.blurTint} style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="help-circle" size={18} color={colors.secondary} />
        <Text style={styles.headerTitle}>Apa Itu Istilah Ini?</Text>
      </View>
      <Text style={styles.subtitle}>Ketuk untuk memahami istilah penanggalan Jawa.</Text>

      {GLOSARIUM.map((item, i) => {
        const open = openIndex === i;
        return (
          <View key={item.istilah} style={styles.item}>
            <TouchableOpacity
              style={styles.itemHeader}
              onPress={() => toggle(i)}
              activeOpacity={0.7}
            >
              <Text style={styles.itemIkon}>{item.ikon}</Text>
              <Text style={styles.itemTitle}>{item.istilah}</Text>
              <Ionicons
                name={open ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textLight}
              />
            </TouchableOpacity>
            {open && <Text style={styles.itemBody}>{item.penjelasan}</Text>}
          </View>
        );
      })}
    </BlurView>
  );
}

const getStyles = (colors) => StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  item: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(213, 189, 175, 0.15)',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
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
