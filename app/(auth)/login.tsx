import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';

const MailIcon = () => <Text style={styles.icon}>✉️</Text>;
const LockIcon = () => <Text style={styles.icon}>🔒</Text>;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);

    // TODO: POST { email, password } to backend
    // On success → navigate to OTP verification
    setTimeout(() => {
      setLoading(false);
      // ── OTP verification is AFTER login ──
      router.push({
        pathname: '/(auth)/verify-login',
        params: { email },
      });
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <Text style={styles.title}>Login Account</Text>
          <Text style={styles.subtitle}>
            Please login with your registered account
          </Text>

          {/* Email */}
          <Text style={styles.label}>Email or Phone Number</Text>
          <View style={styles.inputRow}>
            <MailIcon />
            <TextInput
              style={styles.input}
              placeholder="Enter your email or phone number"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <LockIcon />
            <TextInput
              style={styles.input}
              placeholder="Create your password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotWrap}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[styles.cta, loading && styles.ctaDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.ctaText}>
              {loading ? 'Signing In…' : 'Sign In'}
            </Text>
          </TouchableOpacity>



          {/* Register link */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            style={styles.registerLink}
            activeOpacity={0.7}
          >
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerHighlight}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  backIcon: { fontSize: 18, color: Colors.textPrimary },
  logoWrap: { alignItems: 'center', marginBottom: 12 },
  logo: { width: 160, height: 55 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    marginBottom: 16,
    height: 52,
  },
  icon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary, height: 52 },
  eyeBtn: { paddingLeft: 8 },
  eyeIcon: { fontSize: 16 },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  cta: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  divLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  divText: { fontSize: 12, color: Colors.textMuted },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: 10,
    gap: 10,
  },
  googleG: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EA4335',
    width: 24,
    textAlign: 'center',
  },
  fbBtn: { backgroundColor: '#1877F2', borderColor: '#1877F2' },
  fbF: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    width: 24,
    textAlign: 'center',
  },
  socialText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  registerLink: { alignItems: 'center', marginTop: 12 },
  registerText: { fontSize: 14, color: Colors.textSecondary },
  registerHighlight: { color: Colors.primary, fontWeight: '700' },
});
