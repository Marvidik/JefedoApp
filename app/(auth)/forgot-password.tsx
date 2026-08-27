import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';
import { requestPasswordReset } from '../../services/authService';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset({ email });
      router.push({ pathname: '/(auth)/forgot-otp', params: { email } });
    } catch (err: any) {
      Alert.alert('Error', err.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.body}>
          <View style={styles.iconWrap}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🔑</Text>
            </View>
          </View>

          <Text style={styles.title}>Forgot Your Password?</Text>
          <Text style={styles.subtitle}>
            Enter your registered email and we'll send a verification code to reset your password.
          </Text>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity
            style={[styles.cta, loading && styles.ctaDisabled]}
            onPress={handleSend}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.ctaText}>
              {loading ? 'Sending Code…' : 'Send Verification Code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/(auth)/login')} activeOpacity={0.7}>
            <Text style={styles.backToLoginText}>
              Remembered your password?{' '}
              <Text style={styles.backToLoginLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 32, alignItems: 'center' },
  iconWrap: { marginBottom: 24 },
  iconCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 6, borderColor: `${Colors.primary}20`,
  },
  iconEmoji: { fontSize: 36 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 8 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, alignSelf: 'flex-start' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bg, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, height: 52, width: '100%', marginBottom: 24,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary, height: 52 },
  cta: {
    width: '100%', height: 52, backgroundColor: Colors.primary,
    borderRadius: 30, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28,
    shadowRadius: 12, elevation: 6,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  backToLoginText: { fontSize: 14, color: Colors.textSecondary },
  backToLoginLink: { color: Colors.primary, fontWeight: '700' },
});
