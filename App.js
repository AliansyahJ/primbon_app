import React, { useState, useMemo, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import CalendarScreen from './src/screens/CalendarScreen';
import WetonCalculatorScreen from './src/screens/WetonCalculatorScreen';
import KecocokanScreen from './src/screens/KecocokanScreen';
import DewasaAyuScreen from './src/screens/DewasaAyuScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import GlosariumScreen from './src/screens/GlosariumScreen';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { storageGet, storageSet } from './src/utils/storage';

const WAYANG_ICON = require('./assets/icon-wayang.png');

const TABS = [
  { key: 'calendar', label: 'Kalender' },
  { key: 'weton', label: 'Cek Weton' },
  { key: 'kecocokan', label: 'Kecocokan' },
  { key: 'hariBaik', label: 'Hari Baik' },
];

function AppContent() {
  const { colors, mode, toggleMode } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState('calendar');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
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
  if (showGlossary) return <GlosariumScreen onClose={() => setShowGlossary(false)} />;

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

        {/* Tombol Toggle Tema */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggleMode} activeOpacity={0.7}>
          <Ionicons
            name={mode === 'dark' ? 'sunny' : 'moon'}
            size={20}
            color={colors.secondary}
          />
        </TouchableOpacity>

        {/* Tombol Glosarium */}
        <TouchableOpacity
          style={[styles.themeToggle, styles.glossaryButton]}
          onPress={() => setShowGlossary(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="help-circle-outline" size={22} color={colors.secondary} />
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
          <View style={[styles.tabBar, { paddingBottom: insets.bottom + 10 }]}>
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
                    <Image
                      source={WAYANG_ICON}
                      style={[
                        styles.tabIcon,
                        { tintColor: active ? colors.secondary : colors.textLight },
                      ]}
                      resizeMode="contain"
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
      </View>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
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
  glossaryButton: {
    right: 62, // di kiri tombol tema (14 + 40 + 8)
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
    // paddingBottom = insets.bottom + 10 (di-set inline) agar tab bar naik
    // di atas gesture bar / tombol navigasi sistem, presisi per perangkat.
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
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
