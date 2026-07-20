import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');
const OTP_LENGTH = 4;

export default function VerifyLoginScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const successScale = useRef(new Animated.Value(0)).current;
  const [success, setSuccess] = useState(false);

  // ── Countdown for resend ──────────────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ── Focus first box on mount ──────────────────────────────────────
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 400);
  }, []);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      Alert.alert('Incomplete', 'Please enter the full verification code.');
      return;
    }
    setLoading(true);

    // TODO: POST { email, otp: code } to backend for verification
    setTimeout(() => {
      setLoading(false);
      // ── Animate success state ──
      setSuccess(true);
      Animated.spring(successScale, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => router.replace('/'), 1800);
      });
    }, 1200);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    // TODO: POST { email } to backend to resend OTP
    Alert.alert('Code Sent', `A new code has been sent to ${email}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        {!success ? (
          <>
            {/* Envelope icon */}
            <View style={styles.iconWrap}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>✉️</Text>
              </View>
            </View>

            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.subtitle}>
              We have sent the code verification to{'\n'}
              <Text style={styles.emailHighlight}>{email || 'your email'}</Text>
            </Text>

            {/* OTP Boxes */}
            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => { inputRefs.current[i] = r; }}
                  style={[
                    styles.otpBox,
                    digit ? styles.otpBoxFilled : null,
                    otp[i] !== '' ? styles.otpBoxActive : null,
                  ]}
                  value={digit}
                  onChangeText={(t) => handleChange(t, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  textAlign="center"
                />
              ))}
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.cta, loading && styles.ctaDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.ctaText}>
                {loading ? 'Verifying…' : 'Submit'}
              </Text>
            </TouchableOpacity>

            {/* Resend */}
            <TouchableOpacity
              onPress={handleResend}
              disabled={resendTimer > 0}
              style={styles.resendWrap}
              activeOpacity={0.7}
            >
              <Text style={styles.resendText}>
                Didn't receive the code?{' '}
                <Text
                  style={[
                    styles.resendLink,
                    resendTimer > 0 && styles.resendDisabled,
                  ]}
                >
                  {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend'}
                </Text>
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          /* ── Success state ── */
          <View style={styles.successWrap}>
            <View style={styles.iconWrap}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>✉️</Text>
              </View>
            </View>
            <Text style={styles.title}>Verification Code</Text>
            <Animated.View
              style={[
                styles.successCircle,
                { transform: [{ scale: successScale }] },
              ]}
            >
              <Text style={styles.successCheck}>✓</Text>
            </Animated.View>
            <Text style={styles.successTitle}>Login Successful!</Text>
            <Text style={styles.successSub}>
              Congratulations! You're now logged in.{'\n'}Welcome to Jefedo Marketplace.
            </Text>
            <TouchableOpacity
              style={styles.cta}
              onPress={() => router.replace('/')}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaText}>Go to Homepage</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: Colors.textPrimary },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  iconWrap: {
    marginBottom: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: `${Colors.primary}20`,
  },
  iconEmoji: { fontSize: 36 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emailHighlight: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 36,
  },
  otpBox: {
    width: (width - 56 - 36) / OTP_LENGTH,
    height: 60,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  otpBoxActive: {
    borderColor: Colors.primary,
  },
  cta: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  resendWrap: { paddingVertical: 4 },
  resendText: { fontSize: 13, color: Colors.textSecondary },
  resendLink: { color: Colors.primary, fontWeight: '600' },
  resendDisabled: { color: Colors.textMuted },
  // ── Success state ──
  successWrap: { alignItems: 'center', width: '100%' },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  successCheck: { fontSize: 36, color: Colors.white, fontWeight: '900' },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  successSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
});
