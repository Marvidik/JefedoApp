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

// ── Icon SVG-like components using Text ──────────────────────────────
const UserIcon = () => <Text style={styles.icon}>👤</Text>;
const MailIcon = () => <Text style={styles.icon}>✉️</Text>;
const LockIcon = () => <Text style={styles.icon}>🔒</Text>;
const PhoneIcon = () => <Text style={styles.icon}>📞</Text>;

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    // TODO: POST to backend  { firstName, lastName, email, phone, password }
    setTimeout(() => {
      setLoading(false);
      // ── No OTP after register — go straight to login ──
      router.replace('/(auth)/login');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join thousands of shoppers on Jefedo
          </Text>

          {/* ── First Name ── */}
          <Text style={styles.label}>
            First Name <Text style={styles.req}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <UserIcon />
            <TextInput
              style={styles.input}
              placeholder="Aria"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* ── Last Name ── */}
          <Text style={styles.label}>
            Last Name <Text style={styles.req}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <UserIcon />
            <TextInput
              style={styles.input}
              placeholder="Vance"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* ── Email ── */}
          <Text style={styles.label}>
            Email Address <Text style={styles.req}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <MailIcon />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* ── Phone (optional) ── */}
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputRow}>
            <PhoneIcon />
            <TextInput
              style={styles.input}
              placeholder="+234 801 234 5678"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* ── Password ── */}
          <Text style={styles.label}>
            Password <Text style={styles.req}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <LockIcon />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
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

          {/* ── Confirm Password ── */}
          <Text style={styles.label}>
            Confirm Password <Text style={styles.req}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <LockIcon />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm(!showConfirm)}
              style={styles.eyeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.eyeIcon}>{showConfirm ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.terms}>
            By registering, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Use</Text> &{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.cta, loading && styles.ctaDisabled]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.ctaText}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </Text>
          </TouchableOpacity>



          {/* Login link */}
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            style={styles.loginLink}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginHighlight}>Sign In</Text>
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
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  req: { color: Colors.primary },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    marginBottom: 14,
    height: 52,
  },
  icon: { fontSize: 16, marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    height: 52,
  },
  eyeBtn: { paddingLeft: 8 },
  eyeIcon: { fontSize: 16 },
  terms: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },
  termsLink: { color: Colors.primary, fontWeight: '600' },
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
  fbBtn: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  fbF: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    width: 24,
    textAlign: 'center',
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  loginLink: { alignItems: 'center', marginTop: 12 },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginHighlight: { color: Colors.primary, fontWeight: '700' },
});
