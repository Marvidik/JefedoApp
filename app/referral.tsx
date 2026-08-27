import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator, Alert, Clipboard, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { getMyCode, getReferralHistory, getReferralStats, claimReferral } from '../services/referralService';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function ReferralScreen() {
  useRequireAuth();
  
  const [activeTab, setActiveTab] = useState('Refer');
  const [referralCode, setReferralCode] = useState<string>('');
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claimCode, setClaimCode] = useState('');
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const [codeRes, histRes, statsRes] = await Promise.all([
        getMyCode(),
        getReferralHistory(),
        getReferralStats()
      ]);
      setReferralCode(codeRes?.code || 'N/A');
      setHistory(histRes || []);
      setStats(statsRes);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `https://jefedo.com/referral/${referralCode}`;

  const handleCopy = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Jefedo! Use my code: ${referralCode} or link: ${referralLink}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClaim = async () => {
    if (!claimCode.trim()) {
      Alert.alert('Error', 'Please enter a referral code.');
      return;
    }
    setClaiming(true);
    try {
      await claimReferral(claimCode.trim());
      Alert.alert('Success', 'Referral code claimed successfully!');
      setClaimCode('');
    } catch (err: any) {
      Alert.alert('Error', err.detail || 'Failed to claim referral code.');
    } finally {
      setClaiming(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'completed': return '#16a34a';
      case 'pending': return '#94a3b8';
      case 'signed up': return '#0284c7';
      case 'cancelled': return '#ea580c';
      default: return Colors.textMuted;
    }
  };

  const getStatusBg = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'completed': return '#dcfce7';
      case 'pending': return '#f1f5f9';
      case 'signed up': return '#e0f2fe';
      case 'cancelled': return '#ffedd5';
      default: return '#f1f5f9';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer and Earn</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Toggle Switch */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, activeTab === 'Refer' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('Refer')}
          >
            <Text style={[styles.toggleText, activeTab === 'Refer' && styles.toggleTextActive]}>Refer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, activeTab === 'Earn' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('Earn')}
          >
            <Text style={[styles.toggleText, activeTab === 'Earn' && styles.toggleTextActive]}>Earn</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'Refer' ? (
          <>
            {/* Gift Graphic */}
            <View style={styles.graphicContainer}>
              <Ionicons name="gift" size={100} color={Colors.primary} style={styles.giftIcon} />
            </View>

            {/* Claim Referral Form */}
            <View style={styles.claimBox}>
              <Text style={styles.claimTitle}>Have a referral code?</Text>
              <View style={styles.claimRow}>
                <TextInput 
                  style={styles.claimInput} 
                  placeholder="Enter code" 
                  value={claimCode} 
                  onChangeText={setClaimCode}
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.claimBtn} onPress={handleClaim} disabled={claiming}>
                  {claiming ? (
                    <ActivityIndicator color={Colors.white} size="small" />
                  ) : (
                    <Text style={styles.claimBtnText}>Claim</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.title}>Share Jefedo with Friends</Text>
            <Text style={styles.subtitle}>
              Refer a friend to Jefedo and earn rewards! When they sign up and make their first purchase, you'll both get a bonus.
            </Text>

            {/* Code Box */}
            <View style={styles.codeBox}>
              <View>
                <Text style={styles.codeLabel}>Referral code</Text>
                <Text style={styles.codeText}>{referralCode}</Text>
              </View>
              <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                <Ionicons name="copy-outline" size={18} color={Colors.primary} />
                <Text style={styles.copyBtnText}>Copy</Text>
              </TouchableOpacity>
            </View>

            {/* Share Buttons */}
            <Text style={styles.shareTitle}>Share via:</Text>
            <View style={styles.shareRow}>
              <TouchableOpacity style={styles.shareIconBtn} onPress={handleShare}>
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                <Text style={styles.shareIconText}>Whatsapp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIconBtn} onPress={handleShare}>
                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                <Text style={styles.shareIconText}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareIconBtn} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={24} color={Colors.textPrimary} />
                <Text style={styles.shareIconText}>Share</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.earnContainer}>
            <View style={styles.earnHeader}>
              <Text style={styles.earnTotalLabel}>Total Earned</Text>
              <Text style={styles.earnTotalAmount}>₦{Number(stats?.total_earned || 0).toLocaleString()}</Text>
              <Text style={styles.statsLabel}>Total Referrals: {stats?.total_referrals || 0}</Text>
              <Text style={styles.statsLabel}>Active Referrals: {stats?.active_referrals || 0}</Text>
            </View>
            
            <Text style={styles.listTitle}>Your invitations</Text>
            <View style={styles.listContainer}>
              {history.length === 0 ? (
                <Text style={{ textAlign: 'center', padding: 20, color: Colors.textMuted }}>No referrals yet.</Text>
              ) : (
                history.map((user) => (
                  <View key={user.id} style={styles.listItem}>
                    <View style={styles.listLeft}>
                      <Text style={styles.listEmail}>{user.referred_user?.email || 'Unknown User'}</Text>
                      {Number(user.reward_amount) > 0 && (
                        <Text style={styles.listAmount}>Earned: ₦{Number(user.reward_amount).toLocaleString()}</Text>
                      )}
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBg(user.status) }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>{user.status}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  scrollContent: { padding: 24, alignItems: 'center' },
  
  toggleContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 30, padding: 4, width: '100%', marginBottom: 30 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 26 },
  toggleBtnActive: { backgroundColor: Colors.primary },
  toggleText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  toggleTextActive: { color: Colors.white },

  graphicContainer: { marginVertical: 30, alignItems: 'center', justifyContent: 'center' },
  giftIcon: { textShadowColor: 'rgba(238, 18, 23, 0.3)', textShadowOffset: { width: 0, height: 10 }, textShadowRadius: 20 },

  title: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 30, paddingHorizontal: 10 },

  codeBox: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: Colors.borderLight, marginBottom: 40 },
  codeLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  codeText: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  copyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  copyBtnText: { color: Colors.primary, fontWeight: 'bold', marginLeft: 6 },

  claimBox: { width: '100%', backgroundColor: Colors.white, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.borderLight, marginBottom: 24 },
  claimTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 12 },
  claimRow: { flexDirection: 'row', gap: 10 },
  claimInput: { flex: 1, height: 44, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, paddingHorizontal: 12 },
  claimBtn: { backgroundColor: Colors.primary, paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center', alignItems: 'center', height: 44 },
  claimBtnText: { color: Colors.white, fontWeight: 'bold', fontSize: 14 },

  shareTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 16 },
  shareRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, width: '100%' },
  shareIconBtn: { alignItems: 'center', backgroundColor: Colors.white, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: Colors.borderLight, flex: 1 },
  shareIconText: { fontSize: 12, color: Colors.textSecondary, marginTop: 8, fontWeight: '500' },

  earnContainer: { width: '100%', marginTop: 10 },
  earnHeader: { backgroundColor: Colors.primary, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 30, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  earnTotalLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8 },
  earnTotalAmount: { color: Colors.white, fontSize: 36, fontWeight: 'bold', marginBottom: 8 },
  statsLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginBottom: 4 },
  
  listTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 16, paddingHorizontal: 4 },
  listContainer: { backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  listLeft: { flex: 1, marginRight: 12 },
  listEmail: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary, marginBottom: 4 },
  listAmount: { fontSize: 12, color: '#16a34a', fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize' },
});
