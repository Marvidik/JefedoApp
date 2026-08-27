import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { changeAccountPassword, getTwoFactorStatus, toggleTwoFactor } from '../services/accountService';
import { useRequireAuth } from '../lib/useRequireAuth';

export default function SecurityScreen() {
  const isLoggedIn = useRequireAuth();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(true);
  const [twoFAToggling, setTwoFAToggling] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    getTwoFactorStatus()
      .then(res => setTwoFAEnabled(res.two_factor_enabled))
      .catch(() => {})
      .finally(() => setTwoFALoading(false));
  }, [isLoggedIn]);

  const handleUpdate = async () => {
    if (!current || !newPass || !confirm) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    if (newPass !== confirm) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    if (newPass.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await changeAccountPassword({ old_password: current, new_password: newPass });
      Alert.alert('Success', 'Password updated successfully!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) {
      Alert.alert('Error', err.detail || err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    const newValue = !twoFAEnabled;
    setTwoFAToggling(true);
    try {
      const res = await toggleTwoFactor(newValue);
      setTwoFAEnabled(res.two_factor_enabled);
      Alert.alert('2FA ' + (res.two_factor_enabled ? 'Enabled' : 'Disabled'), res.detail || `Two-factor authentication has been ${res.two_factor_enabled ? 'enabled' : 'disabled'}.`);
    } catch (err: any) {
      Alert.alert('Error', err.detail || err.message || 'Failed to toggle 2FA.');
    } finally {
      setTwoFAToggling(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Two-Factor Authentication */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>TWO-FACTOR AUTHENTICATION (2FA)</Text>
          {twoFALoading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginVertical: 16 }} />
          ) : (
            <View style={styles.twoFARow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.twoFATitle}>
                  {twoFAEnabled ? '🔒 2FA is Enabled' : '🔓 2FA is Disabled'}
                </Text>
                <Text style={styles.twoFADesc}>
                  {twoFAEnabled
                    ? 'Your account is protected with an OTP sent to your email on login.'
                    : 'Enable 2FA to receive an OTP on every login for extra security.'}
                </Text>
              </View>
              {twoFAToggling ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Switch
                  value={twoFAEnabled}
                  onValueChange={handleToggle2FA}
                  trackColor={{ false: Colors.borderLight, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              )}
            </View>
          )}
        </View>

        {/* Change Password */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>CHANGE PASSWORD</Text>
          <TouchableOpacity style={styles.showPasswordRow} onPress={() => setShowAll(!showAll)}>
            <Ionicons name={showAll ? 'eye-off' : 'eye'} size={16} color={Colors.primary} />
            <Text style={styles.showPasswordText}>{showAll ? 'Hide Passwords' : 'Show Passwords'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>CURRENT PASSWORD</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={!showAll}
            value={current}
            onChangeText={setCurrent}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>NEW PASSWORD</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={!showAll}
            value={newPass}
            onChangeText={setNewPass}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={!showAll}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
          />

          <TouchableOpacity style={[styles.updateBtn, loading && { opacity: 0.6 }]} onPress={handleUpdate} disabled={loading}>
            {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.updateBtnText}>Update Password</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.textPrimary },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', marginBottom: 16, letterSpacing: 0.5 },
  card: { backgroundColor: Colors.white, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: Colors.borderLight, marginBottom: 16 },
  twoFARow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  twoFATitle: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  twoFADesc: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
  showPasswordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20 },
  showPasswordText: { color: Colors.primary, fontSize: 13, fontWeight: '600', marginLeft: 6 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 4, height: 44, paddingHorizontal: 12, color: Colors.textPrimary },
  updateBtn: { backgroundColor: Colors.primary, height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  updateBtnText: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
});
