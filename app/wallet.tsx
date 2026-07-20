import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const RECENT_TRANSACTIONS = [
  { id: '1', title: 'Payment for Shoes', type: 'debit', amount: '-$120.00', date: 'Today, 10:30 AM', icon: 'cart' },
  { id: '2', title: 'Top up wallet', type: 'credit', amount: '+$500.00', date: 'Yesterday, 02:15 PM', icon: 'wallet' },
];

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/wallet-history')}>
          <Ionicons name="time-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>$3,851.59</Text>
          
          <View style={styles.cardInfo}>
            <View>
              <Text style={styles.cardLabel}>Card Holder</Text>
              <Text style={styles.cardValue}>Magdalena</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>Expires</Text>
              <Text style={styles.cardValue}>12/24</Text>
            </View>
            <View style={styles.logoWrap}>
              <Text style={styles.logoText}>J</Text>
            </View>
          </View>
        </View>

        {/* Action Row - Top Up and Add Card */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconWrap, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="add" size={24} color="#16a34a" />
            </View>
            <Text style={styles.actionText}>Top Up Balance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconWrap, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="card-outline" size={24} color="#0284c7" />
            </View>
            <Text style={styles.actionText}>Use a New Card</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions Section (No scroll, just recent) */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/wallet-history')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {RECENT_TRANSACTIONS.map((item) => (
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
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' }, // Dark theme for wallet
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.white },
  mainContent: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  balanceCard: { backgroundColor: Colors.primary, borderRadius: 24, padding: 24, marginBottom: 30, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8 },
  balanceAmount: { color: Colors.white, fontSize: 36, fontWeight: 'bold', marginBottom: 30 },
  cardInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4 },
  cardValue: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  logoWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  logoText: { color: Colors.white, fontSize: 20, fontWeight: 'bold', fontStyle: 'italic' },
  
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 40, marginBottom: 40, backgroundColor: '#1e293b', padding: 20, borderRadius: 20 },
  actionBtn: { alignItems: 'center' },
  actionIconWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionText: { color: Colors.white, fontSize: 13, fontWeight: '500' },

  transactionsSection: { flex: 1, backgroundColor: Colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, marginHorizontal: -20, marginBottom: -20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  seeAllText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  
  transactionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  txLeft: { flexDirection: 'row', alignItems: 'center' },
  txIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  txDate: { fontSize: 12, color: Colors.textMuted },
  txAmount: { fontSize: 15, fontWeight: 'bold' },
});
