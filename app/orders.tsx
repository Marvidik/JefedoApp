import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { getMyOrders } from '../services/accountService';
import { useRequireAuth } from '../hooks/useRequireAuth';

const TABS = ['All', 'Processing', 'Delivered', 'Cancelled'];

export default function OrdersScreen() {
  useRequireAuth();
  
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All') return true;
    
    // Map backend status to our tabs if necessary
    const s = order.status?.toLowerCase() || '';
    if (activeTab === 'Processing') return s !== 'delivered' && s !== 'cancelled';
    if (activeTab === 'Delivered') return s === 'delivered';
    if (activeTab === 'Cancelled') return s === 'cancelled';
    return true;
  });

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'delivered': return '#16a34a';
      case 'processing': return '#ea580c';
      case 'pending': return '#0284c7';
      case 'cancelled': return Colors.danger;
      default: return Colors.textSecondary;
    }
  };

  const getStatusBg = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'delivered': return '#dcfce7';
      case 'processing': return '#ffedd5';
      case 'pending': return '#e0f2fe';
      case 'cancelled': return '#fee2e2';
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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color={Colors.borderLight} />
              <Text style={styles.emptyText}>No orders found.</Text>
            </View>
          ) : (
            filteredOrders.map(order => {
              const itemsCount = order.items?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 0;
              const imageUri = order.items?.[0]?.product?.images?.[0]?.image;
              
              return (
                <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.8}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.orderId}>#{order.id.toString().padStart(5, '0')}</Text>
                      <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusBg(order.status) }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status || 'Pending'}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.divider} />

                  <View style={styles.cardBody}>
                    <View style={styles.orderImageContainer}>
                      {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.orderImage} />
                      ) : (
                        <Ionicons name="cart-outline" size={30} color={Colors.textMuted} />
                      )}
                    </View>
                    <View style={styles.orderDetails}>
                      <Text style={styles.itemCount}>{itemsCount} {itemsCount > 1 ? 'items' : 'item'}</Text>
                      <Text style={styles.orderTotal}>Total: ₦{Number(order.total_amount).toLocaleString()}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
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
  statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 16 },
  
  cardBody: { flexDirection: 'row', alignItems: 'center' },
  orderImageContainer: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  orderImage: { width: '100%', height: '100%' },
  orderDetails: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  itemCount: { fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
});
