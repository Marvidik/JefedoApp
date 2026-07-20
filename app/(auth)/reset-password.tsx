import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';

export default function ResetPasswordScreen() {
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    if (!password || !confirm) {
      Alert.alert('Missing Fields', 'Please fill in both fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Too Short', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    // TODO: POST { email, otp, newPassword: password } to backend
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Password Reset!', 'Your password has been updated. Please log in.', [
        { text: 'Sign In', onPress: () => router.replace('/(auth)/login') },
      ]);
    }, 1200);
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
          <Text style={styles.headerTitle}>Reset Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.body}>
          <View style={styles.iconWrap}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🔒</Text>
            </View>
          </View>

          <Text style={styles.title}>Create New Password</Text>
          <Text style={styles.subtitle}>
            Your new password must be different from your previous password.
          </Text>

          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputRow}>
            <Text style={styles.icon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPw}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPw(!showPw)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.eyeIcon}>{showPw ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputRow}>
            <Text style={styles.icon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showCf}
              value={confirm}
              onChangeText={setConfirm}
            />
            <TouchableOpacity onPress={() => setShowCf(!showCf)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.eyeIcon}>{showCf ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.cta, loading && styles.ctaDisabled]}
            onPress={handleReset}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.ctaText}>{loading ? 'Resetting…' : 'Reset Password'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 18, color: Colors.textPrimary },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 32, alignItems: 'center' },
  iconWrap: { marginBottom: 24 },
  iconCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    borderWidth: 6, borderColor: `${Colors.primary}20`,
  },
  iconEmoji: { fontSize: 36 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 28, paddingHorizontal: 8 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, alignSelf: 'flex-start' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bg, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, height: 52, width: '100%', marginBottom: 16,
  },
  icon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary, height: 52 },
  eyeIcon: { fontSize: 16, paddingLeft: 8 },
  cta: {
    width: '100%', height: 52, backgroundColor: Colors.primary,
    borderRadius: 30, alignItems: 'center', justifyContent: 'center',
    marginTop: 8, shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6,
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
