import { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate based on onboarding state
    const checkOnboarding = async () => {
      try {
        const hasOpened = await AsyncStorage.getItem('hasOpenedBefore');
        if (hasOpened) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } catch (error) {
        router.replace('/onboarding');
      }
    };

    const timer = setTimeout(() => {
      checkOnboarding();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background circles for depth */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>Multi-Vendor Ecommerce Marketplace</Text>
        <Text style={styles.subTagline}>Shop smart, live better.</Text>
      </Animated.View>

      {/* Version */}
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Decorative circles
  circle1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: Colors.primaryDark,
    opacity: 0.35,
    top: -80,
    right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.primaryDark,
    opacity: 0.2,
    bottom: -60,
    left: -60,
  },
  circle3: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.white,
    opacity: 0.05,
    bottom: 120,
    right: 40,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    width: 240,
    height: 100,
    marginBottom: 24,
    // White card behind logo for visibility
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logo: {
    width: 210,
    height: 80,
  },
  tagline: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    opacity: 0.9,
    marginBottom: 6,
  },
  subTagline: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.65,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 48,
  },
  version: {
    color: Colors.white,
    fontSize: 12,
    opacity: 0.55,
    letterSpacing: 0.4,
  },
});
