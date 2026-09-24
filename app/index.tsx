import { useEffect, useRef } from 'react';
import {
  View, Image, Text, StyleSheet, Animated, Easing, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  // ── Animation values ──────────────────────────────────────────
  const bgFade         = useRef(new Animated.Value(0)).current;
  const logoOpacity    = useRef(new Animated.Value(0)).current;
  const logoScale      = useRef(new Animated.Value(0.55)).current;
  const logoTransY     = useRef(new Animated.Value(30)).current;
  const shimmerX       = useRef(new Animated.Value(-width)).current;
  const ring1Scale     = useRef(new Animated.Value(0.5)).current;
  const ring1Opacity   = useRef(new Animated.Value(0.8)).current;
  const ring2Scale     = useRef(new Animated.Value(0.5)).current;
  const ring2Opacity   = useRef(new Animated.Value(0.6)).current;
  const ring3Scale     = useRef(new Animated.Value(0.5)).current;
  const ring3Opacity   = useRef(new Animated.Value(0.4)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTransY  = useRef(new Animated.Value(20)).current;
  const dot1Scale      = useRef(new Animated.Value(0)).current;
  const dot2Scale      = useRef(new Animated.Value(0)).current;
  const dot3Scale      = useRef(new Animated.Value(0)).current;

  const makeRingLoop = (
    scaleAnim: Animated.Value,
    opacityAnim: Animated.Value,
    delay: number,
    startOpacity: number,
  ) =>
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 0.5, duration: 0, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: startOpacity, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );

  const shimmerLoop = () =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerX, {
          toValue: width * 2,
          duration: 1800,
          delay: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerX, { toValue: -width, duration: 0, useNativeDriver: true }),
      ])
    );

  useEffect(() => {
    // 1 — Screen fades in
    Animated.timing(bgFade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // 2 — Logo springs in
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1, tension: 80, friction: 7, useNativeDriver: true,
        }),
        Animated.timing(logoTransY, {
          toValue: 0, duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3 — Pulse rings
    Animated.sequence([
      Animated.delay(700),
      Animated.parallel([
        makeRingLoop(ring1Scale, ring1Opacity, 0,   0.8),
        makeRingLoop(ring2Scale, ring2Opacity, 380, 0.6),
        makeRingLoop(ring3Scale, ring3Opacity, 760, 0.4),
      ]),
    ]).start();

    // 4 — Shimmer
    Animated.delay(900).start(() => shimmerLoop().start());

    // 5 — Tagline slides up
    Animated.sequence([
      Animated.delay(900),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1, duration: 550,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(taglineTransY, {
          toValue: 0, duration: 550,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 6 — Loading dots stagger in
    Animated.sequence([
      Animated.delay(1350),
      Animated.stagger(160, [
        Animated.spring(dot1Scale, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }),
        Animated.spring(dot2Scale, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }),
        Animated.spring(dot3Scale, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();

    // 7 — Navigate after 3.2 s
    const timer = setTimeout(async () => {
      try {
        const hasOpened = await AsyncStorage.getItem('hasOpenedBefore');
        router.replace(hasOpened ? '/(tabs)' : '/onboarding');
      } catch {
        router.replace('/onboarding');
      }
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: bgFade }]}>
      <StatusBar style="light" />

      {/* Decorative blobs */}
      <View style={[styles.blob, styles.blobTR]} />
      <View style={[styles.blob, styles.blobBL]} />
      <View style={[styles.blob, styles.blobMid]} />

      {/* Pulse rings */}
      <View style={styles.ringWrapper} pointerEvents="none">
        <Animated.View
          style={[styles.ring, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]}
        />
        <Animated.View
          style={[styles.ring, styles.ring2, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]}
        />
        <Animated.View
          style={[styles.ring, styles.ring3, { transform: [{ scale: ring3Scale }], opacity: ring3Opacity }]}
        />
      </View>

      {/* Logo card */}
      <Animated.View
        style={[
          styles.logoCard,
          { opacity: logoOpacity, transform: [{ scale: logoScale }, { translateY: logoTransY }] },
        ]}
      >
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        {/* Shimmer sweep */}
        <Animated.View
          pointerEvents="none"
          style={[styles.shimmer, { transform: [{ translateX: shimmerX }] }]}
        />
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={[styles.taglineBlock, { opacity: taglineOpacity, transform: [{ translateY: taglineTransY }] }]}
      >
        <Text style={styles.tagline}>Multi-Vendor Marketplace</Text>
        <Text style={styles.subTagline}>Shop smart · Live better</Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { transform: [{ scale: dot1Scale }] }]} />
        <Animated.View style={[styles.dot, styles.dotMid, { transform: [{ scale: dot2Scale }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ scale: dot3Scale }] }]} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.version}>Jefedo v1.0.0</Text>
      </View>
    </Animated.View>
  );
}

const RING = 240;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Blobs
  blob: { position: 'absolute', borderRadius: 999 },
  blobTR: { width: 340, height: 340, top: -110, right: -110, backgroundColor: Colors.primaryDark, opacity: 0.45 },
  blobBL: { width: 260, height: 260, bottom: -80, left: -80, backgroundColor: Colors.primaryDark, opacity: 0.3 },
  blobMid: { width: 140, height: 140, bottom: height * 0.28, right: -30, backgroundColor: '#fff', opacity: 0.07 },

  // Rings
  ringWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: RING,
    height: RING,
  },
  ring: {
    position: 'absolute',
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  ring2: {
    width: RING * 1.4,
    height: RING * 1.4,
    borderRadius: (RING * 1.4) / 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  ring3: {
    width: RING * 1.85,
    height: RING * 1.85,
    borderRadius: (RING * 1.85) / 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // Logo card
  logoCard: {
    width: 260,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.38,
    shadowRadius: 36,
    elevation: 24,
    padding: 16,
  },
  logo: { width: 220, height: 88 },

  // Shimmer
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.32)',
    transform: [{ skewX: '-18deg' }],
  },

  // Tagline
  taglineBlock: { alignItems: 'center', marginTop: 26 },
  tagline: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 5,
    opacity: 0.95,
  },
  subTagline: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.4,
    fontStyle: 'italic',
  },

  // Dots
  dotsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 42, gap: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotMid: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },

  // Footer
  footer: { position: 'absolute', bottom: 50 },
  version: { color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: 0.5 },
});

