import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

const ORDERS = [
  {
    id: 'ORD-8923-456',
    date: 'Jul 18, 2026',
    status: 'Delivered',
    total: '₦45,000',
    items: 2,
    image: require('../assets/onboarding1.jpg'),
  },
  {
    id: 'ORD-3412-887',
    date: 'Jul 15, 2026',
    status: 'Processing',
    total: '₦12,500',
    items: 1,
    image: require('../assets/onboarding3.jpg'),
  },
  {
    id: 'ORD-1192-334',
    date: 'Jun 28, 2026',
    status: 'Cancelled',
    total: '₦8,000',
    items: 1,
    image: require('../assets/onboarding2.jpg'),
  }
];

const TABS = ['All', 'Processing', 'Delivered', 'Cancelled'];

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredOrders = ORDERS.filter(order => 
    activeTab === 'All' ? true : order.status === activeTab
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#16a34a';
      case 'Processing': return '#ea580c';
      case 'Cancelled': return Colors.danger;
      default: return Colors.textSecondary;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Delivered': return '#dcfce7';
      case 'Processing': return '#ffedd5';
      case 'Cancelled': return '#fee2e2';
      default: return '#f1f5f9';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color={Colors.borderLight} />
            <Text style={styles.emptyText}>No orders found.</Text>
          </View>
        ) : (
          filteredOrders.map(order => (
            <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.8}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBg(order.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.cardBody}>
                <Image source={order.image} style={styles.orderImage} />
                <View style={styles.orderDetails}>
                  <Text style={styles.itemCount}>{order.items} {order.items > 1 ? 'items' : 'item'}</Text>
                  <Text style={styles.orderTotal}>Total: {order.total}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: Colors.white },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  
  tabsContainer: { backgroundColor: Colors.white, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  tabsScroll: { paddingHorizontal: 20, gap: 12 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight },
  tabBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: Colors.white, fontWeight: 'bold' },

  scrollContent: { padding: 20 },
  
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: Colors.textMuted, marginTop: 12 },

  orderCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  orderDate: { fontSize: 13, color: Colors.textMuted },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 16 },
  
  cardBody: { flexDirection: 'row', alignItems: 'center' },
  orderImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#f1f5f9' },
  orderDetails: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  itemCount: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
});
