import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { getTransactions } from '../services/walletService';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function WalletHistoryScreen() {
  useRequireAuth();
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const txs = await getTransactions();
      setTransactions(txs);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {transactions.length === 0 ? (
            <Text style={{ textAlign: 'center', color: Colors.textMuted, marginTop: 20 }}>No transactions found.</Text>
          ) : (
            transactions.map((item) => (
              <View key={item.id} style={styles.transactionCard}>
                <View style={styles.txLeft}>
                  <View style={styles.txIconWrap}>
                    <Ionicons name={item.transaction_type === 'credit' ? 'arrow-down' : 'arrow-up'} size={20} color={Colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.txTitle}>{item.description || item.transaction_type}</Text>
                    <Text style={styles.txDate}>{new Date(item.created_at).toLocaleString()}</Text>
                  </View>
                </View>
                {(() => {
                  const isPending = item.status?.toLowerCase() === 'pending';
                  const isCredit = item.transaction_type === 'credit';
                  const amountColor = isPending ? Colors.textMuted : (isCredit ? '#16a34a' : Colors.danger);
                  return (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.txAmount, { color: amountColor }]}>
                        {isCredit ? '+' : '-'}₦{Number(item.amount).toLocaleString()}
                      </Text>
                      {isPending && <Text style={{ fontSize: 11, color: Colors.textMuted }}>Pending</Text>}
                    </View>
                  );
                })()}
              </View>
            ))
          )}
        </ScrollView>
      )}
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
