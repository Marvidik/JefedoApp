import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';

export default function ProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      Alert.alert('Logout', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          setIsLoggedIn(false);
        }},
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.sectionContainer}>
          <MenuItem icon="person-outline" title="Edit Profile" onPress={() => router.push('/edit-profile')} />
          <View style={styles.divider} />
          <MenuItem icon="cube-outline" title="Orders" onPress={() => router.push('/orders')} />
          <View style={styles.divider} />
          <MenuItem icon="location-outline" title="Addresses" onPress={() => router.push('/addresses')} />
          <View style={styles.divider} />
          <MenuItem icon="wallet-outline" title="Wallet" onPress={() => router.push('/wallet')} />
          <View style={styles.divider} />
          <MenuItem icon="gift-outline" title="Referral" onPress={() => router.push('/referral')} />
          <View style={styles.divider} />
          <MenuItem icon="shield-checkmark-outline" title="Security" onPress={() => router.push('/security')} />
          <View style={styles.divider} />
          <MenuItem icon="notifications-outline" title="Notifications" badge={3} onPress={() => router.push('/notifications')} />
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.sectionContainer}>
          <MenuItem icon="document-text-outline" title="Legal and Policies" onPress={() => Linking.openURL('https://www.jefedo.com/privacy-policy')} />
          <View style={styles.divider} />
          <MenuItem icon="help-circle-outline" title="Help & Support" onPress={() => Linking.openURL('https://www.jefedo.com/contact')} />
        </View>

        <View style={[styles.sectionContainer, { marginTop: 10 }]}>
          <MenuItem 
            icon={isLoggedIn ? "log-out-outline" : "log-in-outline"} 
            title={isLoggedIn ? "Logout" : "Login"} 
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
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  scrollContent: { padding: 20 },
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
});
