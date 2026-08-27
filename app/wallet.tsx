import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { getWallet, initiateFunding, getTransactions } from '../services/walletService';
import { useAuth } from '../context/AuthContext';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

export default function WalletScreen() {
  useRequireAuth();
  const { user } = useAuth();
  
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [fundingLoading, setFundingLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletData, txs] = await Promise.all([
        getWallet(),
        getTransactions()
      ]);
      setWallet(walletData);
      setTransactions(txs.slice(0, 3)); // Only show recent 3
    } catch (err: any) {
      console.error(err);
      // It might be a 404 if wallet is not created yet, etc.
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || isNaN(Number(topUpAmount)) || Number(topUpAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    setFundingLoading(true);
    try {
      const res = await initiateFunding(Number(topUpAmount));
      if (res.payment_url) {
        setPaymentUrl(res.payment_url);
      } else {
        Alert.alert('Error', 'Failed to generate payment link');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to initiate funding');
    } finally {
      setFundingLoading(false);
    }
  };

  const handlePaymentNavigation = (navState: any) => {
    if (navState.url.includes('callback') || navState.url.includes('verify')) {
      // For simplicity, just close webview and refresh wallet data when it redirects
      setPaymentUrl(null);
      setTopUpModalVisible(false);
      setTopUpAmount('');
      fetchWalletData();
      Alert.alert('Success', 'Payment process completed. Your wallet balance should update shortly.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (paymentUrl) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setPaymentUrl(null)}>
            <Ionicons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fund Wallet</Text>
          <View style={{ width: 32 }} />
        </View>
        <WebView 
          source={{ uri: paymentUrl }} 
          style={{ flex: 1 }}
          onNavigationStateChange={handlePaymentNavigation}
        />
      </SafeAreaView>
    );
  }

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
          <Text style={styles.balanceAmount}>₦{Number(wallet?.balance || 0).toLocaleString()}</Text>
          
          <View style={styles.cardInfo}>
            <View>
              <Text style={styles.cardLabel}>Account Holder</Text>
              <Text style={styles.cardValue}>{user?.first_name} {user?.last_name}</Text>
            </View>
            <View style={styles.logoWrap}>
              <Text style={styles.logoText}>J</Text>
            </View>
          </View>
        </View>

        {/* Action Row - Top Up and Add Card */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setTopUpModalVisible(true)}>
            <View style={[styles.actionIconWrap, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="add" size={24} color="#16a34a" />
            </View>
            <Text style={styles.actionText}>Top Up Balance</Text>
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

          {transactions.length === 0 ? (
            <Text style={{ textAlign: 'center', color: Colors.textMuted, marginTop: 20 }}>No recent transactions</Text>
          ) : (
            transactions.map((item) => (
              <View key={item.id} style={styles.transactionCard}>
                <View style={styles.txLeft}>
                  <View style={styles.txIconWrap}>
                    <Ionicons name={item.transaction_type === 'credit' ? 'arrow-down' : 'arrow-up'} size={20} color={Colors.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.txTitle}>{item.description || item.transaction_type}</Text>
                    <Text style={styles.txDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                  </View>
                </View>
                <Text style={[styles.txAmount, { color: item.transaction_type === 'credit' ? '#16a34a' : Colors.danger }]}>
                  {item.transaction_type === 'credit' ? '+' : '-'}₦{Number(item.amount).toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Top Up Modal */}
      <Modal visible={topUpModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fund Wallet</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount (₦)"
              keyboardType="numeric"
              value={topUpAmount}
              onChangeText={setTopUpAmount}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setTopUpModalVisible(false)} disabled={fundingLoading}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.fundBtn} onPress={handleTopUp} disabled={fundingLoading}>
                {fundingLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.fundBtnText}>Fund Now</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' }, 
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
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: Colors.white, borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: Colors.textPrimary },
  input: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelBtnText: { color: Colors.textMuted, fontWeight: '600' },
  fundBtn: { backgroundColor: Colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  fundBtnText: { color: Colors.white, fontWeight: 'bold' }
});
