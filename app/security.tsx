import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

export default function SecurityScreen() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const handleUpdate = () => {
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
    Alert.alert('Success', 'Password updated successfully!', [{ text: 'OK', onPress: () => router.back() }]);
  };

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
        <View style={styles.card}>
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

          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={styles.updateBtnText}>Update Password</Text>
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
  card: { backgroundColor: Colors.white, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: Colors.borderLight, maxWidth: 380 },
  showPasswordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20 },
  showPasswordText: { color: Colors.primary, fontSize: 13, fontWeight: '600', marginLeft: 6 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 4, height: 44, paddingHorizontal: 12, color: Colors.textPrimary },
  updateBtn: { backgroundColor: Colors.primary, height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  updateBtnText: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
});
