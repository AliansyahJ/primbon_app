import React, { useState, useMemo, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import CalendarScreen from './src/screens/CalendarScreen';
import WetonCalculatorScreen from './src/screens/WetonCalculatorScreen';
import KecocokanScreen from './src/screens/KecocokanScreen';
import DewasaAyuScreen from './src/screens/DewasaAyuScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { storageGet, storageSet } from './src/utils/storage';

const TABS = [
  { key: 'calendar', label: 'Kalender', icon: 'calendar' },
  { key: 'weton', label: 'Cek Weton', icon: 'sparkles' },
  { key: 'kecocokan', label: 'Kecocokan', icon: 'heart' },
  { key: 'hariBaik', label: 'Hari Baik', icon: 'star' },
];

function AppContent() {
  const { colors, mode, toggleMode } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState('calendar');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const seen = await storageGet('onboarding_seen');
      if (seen !== 'true') {
        setShowOnboarding(true);
      }
      setLoading(false);
    })();
  }, []);

  const finishOnboarding = async () => {
    await storageSet('onboarding_seen', 'true');
    setShowOnboarding(false);
  };

  if (loading) return null;
  if (showOnboarding) return <OnboardingScreen onFinish={finishOnboarding} />;

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

        {/* Tombol Toggle Tema */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggleMode} activeOpacity={0.7}>
          <Ionicons
            name={mode === 'dark' ? 'sunny' : 'moon'}
            size={20}
            color={colors.secondary}
          />
        </TouchableOpacity>

        {/* Content Area */}
        <View style={styles.content}>
          {activeTab === 'calendar' && <CalendarScreen />}
          {activeTab === 'weton' && <WetonCalculatorScreen />}
          {activeTab === 'kecocokan' && <KecocokanScreen />}
          {activeTab === 'hariBaik' && <DewasaAyuScreen />}
        </View>

        {/* Custom Bottom Tab Bar with Glassmorphism */}
        <BlurView intensity={40} tint={colors.blurTint} style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            {TABS.map((tab, i) => {
              const active = activeTab === tab.key;
              return (
                <React.Fragment key={tab.key}>
                  {i > 0 && <View style={styles.tabDivider} />}
                  <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => setActiveTab(tab.key)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={active ? tab.icon : `${tab.icon}-outline`}
                      size={24}
                      color={active ? colors.secondary : colors.textLight}
                    />
                    <Text style={[styles.tabText, active && styles.activeTabText]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        </BlurView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    top: 12,
    right: 14,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    // Ruang ekstra bawah agar tidak bertabrakan dengan navigasi sistem
    // (gesture bar / tombol navigasi Android). SafeAreaView menangani iOS notch.
    height: Platform.OS === 'android' ? 88 : 70,
    paddingBottom: Platform.OS === 'android' ? 28 : 10,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 5,
  },
  tabText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
    marginTop: 4,
  },
  activeTabText: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
});
