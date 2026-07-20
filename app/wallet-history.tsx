import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

const TRANSACTIONS = [
  { id: '1', title: 'Payment for Shoes', type: 'debit', amount: '-$120.00', date: 'Today, 10:30 AM', icon: 'cart' },
  { id: '2', title: 'Top up wallet', type: 'credit', amount: '+$500.00', date: 'Yesterday, 02:15 PM', icon: 'wallet' },
  { id: '3', title: 'Payment for Repairs', type: 'debit', amount: '-$50.00', date: '18 Jul, 09:00 AM', icon: 'hammer' },
  { id: '4', title: 'Refund for Services', type: 'credit', amount: '+$30.00', date: '15 Jul, 11:20 AM', icon: 'refresh-circle' },
  { id: '5', title: 'Payment for Cleaning', type: 'debit', amount: '-$80.00', date: '10 Jul, 04:00 PM', icon: 'color-wand' },
  { id: '6', title: 'Top up wallet', type: 'credit', amount: '+$200.00', date: '01 Jul, 09:15 AM', icon: 'wallet' },
  { id: '7', title: 'Payment for Snickers', type: 'debit', amount: '-$45.00', date: '28 Jun, 01:30 PM', icon: 'cart' },
];

export default function WalletHistoryScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {TRANSACTIONS.map((item) => (
          <View key={item.id} style={styles.transactionCard}>
            <View style={styles.txLeft}>
              <View style={styles.txIconWrap}>
                <Ionicons name={item.icon as any} size={20} color={Colors.textSecondary} />
              </View>
              <View>
                <Text style={styles.txTitle}>{item.title}</Text>
                <Text style={styles.txDate}>{item.date}</Text>
              </View>
            </View>
            <Text style={[styles.txAmount, { color: item.type === 'credit' ? '#16a34a' : Colors.danger }]}>
              {item.amount}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  scrollContent: { padding: 20 },
  
  transactionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.borderLight },
  txLeft: { flexDirection: 'row', alignItems: 'center' },
  txIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  txDate: { fontSize: 12, color: Colors.textMuted },
  txAmount: { fontSize: 15, fontWeight: 'bold' },
});
