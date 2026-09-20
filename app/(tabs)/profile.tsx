import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';
import { logout } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useAuth();

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      Alert.alert('Logout', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch {}
            setIsLoggedIn(false);
            setUser(null);
            router.replace('/(auth)/login');
          },
        },
      ]);
    } else {
      router.push('/(auth)/login');
    }
  };

  const MenuItem = ({ icon, title, value, onPress, isDestructive = false, badge = 0 }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color={isDestructive ? Colors.danger : Colors.textPrimary} style={{ width: 30 }} />
        <Text style={[styles.menuItemTitle, isDestructive && { color: Colors.danger }]}>{title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {badge > 0 && (
          <View style={styles.badgeWrap}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        {value && <Text style={styles.menuItemValue}>{value}</Text>}
        {!isDestructive && <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />}
      </View>
    </TouchableOpacity>
  );

  const requireLogin = (screen: string) => {
    if (!isLoggedIn) {
      router.push('/(auth)/login');
      return;
    }
    router.push(screen as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* User Card */}
        {isLoggedIn && user && (
          <View style={styles.userCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {(user.first_name?.[0] || user.email?.[0] || 'J').toUpperCase()}
              </Text>
            </View>
            <View style={{ marginLeft: 14 }}>
              <Text style={styles.userName}>{user.first_name} {user.last_name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        )}

        {!isLoggedIn && (
          <TouchableOpacity style={styles.loginBanner} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginBannerText}>👋 Sign in to access your account</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}

        {/* ── Sell on Jefedo Hero Banner ── */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => Linking.openURL('https://www.jefedo.com/auth')}
          style={styles.sellBannerWrapper}
        >
          <View
            style={[styles.sellBanner, { backgroundColor: '#E8001C' }]}
          >
            {/* Decorative blobs */}
            <View style={styles.blobTopRight} />
            <View style={styles.blobBottomLeft} />

            <View style={styles.sellBannerContent}>
              <View style={styles.sellIconCircle}>
                <Ionicons name="storefront" size={28} color="#E8001C" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sellBannerEyebrow}>🚀 START SELLING TODAY</Text>
                <Text style={styles.sellBannerTitle}>Sell on Jefedo</Text>
                <Text style={styles.sellBannerSub}>
                  Reach thousands of buyers — list your products and grow your business online.
                </Text>
              </View>
            </View>

            <View style={styles.sellBannerBtn}>
              <Text style={styles.sellBannerBtnText}>Open Seller Dashboard →</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.sectionContainer}>
          <MenuItem icon="person-outline" title="Edit Profile" onPress={() => requireLogin('/edit-profile')} />
          <View style={styles.divider} />
          <MenuItem icon="cube-outline" title="Orders" onPress={() => requireLogin('/orders')} />
          <View style={styles.divider} />
          <MenuItem icon="location-outline" title="Addresses" onPress={() => requireLogin('/addresses')} />
          <View style={styles.divider} />
          <MenuItem icon="wallet-outline" title="Wallet" onPress={() => requireLogin('/wallet')} />
          <View style={styles.divider} />
          <MenuItem icon="gift-outline" title="Referral" onPress={() => requireLogin('/referral')} />
          <View style={styles.divider} />
          <MenuItem icon="shield-checkmark-outline" title="Security" onPress={() => requireLogin('/security')} />
          <View style={styles.divider} />
          <MenuItem icon="notifications-outline" title="Notifications" onPress={() => requireLogin('/notifications')} />
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.sectionContainer}>
          <MenuItem icon="document-text-outline" title="Legal and Policies" onPress={() => Linking.openURL('https://www.jefedo.com/privacy-policy')} />
          <View style={styles.divider} />
          <MenuItem icon="help-circle-outline" title="Help & Support" onPress={() => Linking.openURL('https://www.jefedo.com/contact')} />
        </View>

        <View style={[styles.sectionContainer, { marginTop: 10 }]}>
          <MenuItem
            icon={isLoggedIn ? 'log-out-outline' : 'log-in-outline'}
            title={isLoggedIn ? 'Logout' : 'Login'}
            isDestructive={isLoggedIn}
            onPress={handleAuthAction}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  scrollContent: { padding: 20 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: Colors.borderLight },
  avatarCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Colors.white, fontSize: 22, fontWeight: 'bold' },
  userName: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  userEmail: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  loginBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: Colors.borderLight },
  loginBannerText: { fontSize: 15, color: Colors.primary, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12, marginTop: 10 },
  sectionContainer: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: Colors.borderLight },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  menuItemRight: { flexDirection: 'row', alignItems: 'center' },
  menuItemValue: { fontSize: 14, color: Colors.textMuted, marginRight: 8 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 50 },
  badgeWrap: { backgroundColor: Colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginRight: 8, minWidth: 20, alignItems: 'center' },
  badgeText: { color: Colors.white, fontSize: 12, fontWeight: 'bold' },

  // ── Sell on Jefedo Banner ──
  sellBannerWrapper: {
    marginBottom: 22,
    borderRadius: 22,
    shadowColor: '#E8001C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  sellBanner: {
    borderRadius: 22,
    padding: 20,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  blobTopRight: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  sellBannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
  sellIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  sellBannerEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  sellBannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  sellBannerSub: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 18,
  },
  sellBannerBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  sellBannerBtnText: {
    color: '#E8001C',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },
});
