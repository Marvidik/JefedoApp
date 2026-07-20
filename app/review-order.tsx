import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

export default function ReviewOrderScreen() {
  const [agreed, setAgreed] = useState(false);

  const handlePlaceOrder = () => {
    if (!agreed) {
      Alert.alert('Terms', 'Please agree to the Refund Policy and Privacy Policy to place your order.');
      return;
    }

    Alert.alert('Success', 'Order placed successfully!', [
      { text: 'OK', onPress: () => router.replace('/') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Your Order</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Delivery Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="location" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Service / Delivery Location</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressName}>John Doe</Text>
          <Text style={styles.addressText}>123 Main Street, Apt 4B, New York</Text>
          <Text style={styles.addressText}>United States · 08123456789</Text>
        </View>

        {/* Summary (1) */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="bag" size={16} color={Colors.textPrimary} style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Summary (1)</Text>
            </View>
          </View>
          
          <View style={styles.orderItem}>
            <Image source={require('../assets/onboarding3.jpg')} style={styles.orderItemImage} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.orderItemName} numberOfLines={2}>High Quality TCP Home Smoke Light</Text>
              <Text style={styles.orderItemQty}>Qty: 1</Text>
            </View>
            <Text style={styles.orderItemPrice}>₦20,000</Text>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₦20,000</Text>
          </View>
        </View>

        {/* Order Totals Block (Right side on web) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Order</Text>
          
          <View style={styles.promoWrap}>
            <TextInput style={styles.promoInput} placeholder="Coupon code" />
            <TouchableOpacity style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₦20,000</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping/Service Fee</Text>
            <Text style={styles.summaryValue}>Calculated by seller</Text>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>₦20,000</Text>
          </View>

          <View style={styles.secureBox}>
            <View style={styles.secureRow}>
              <Ionicons name="lock-closed" size={12} color="#f59e0b" style={{ marginRight: 6 }} />
              <Text style={styles.secureText}>Secured by SSL encryption</Text>
            </View>
            <View style={styles.paymentMethods}>
              <Text style={styles.payMethod}>💳 Cards</Text>
              <Text style={styles.payMethod}>🏦 Bank Transfer</Text>
              <Text style={styles.payMethod}>📱 Mobile Money</Text>
            </View>
          </View>
        </View>

        {/* Agreement */}
        <View style={styles.agreementRow}>
          <TouchableOpacity onPress={() => setAgreed(!agreed)} style={styles.checkbox}>
            {agreed && <Ionicons name="checkmark" size={16} color={Colors.primary} />}
          </TouchableOpacity>
          <Text style={styles.agreementText}>
            I agree to the <Text style={styles.linkText}>Refund Policy</Text> and <Text style={styles.linkText}>Privacy Policy</Text>. I confirm this order is correct.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.backButtonAction} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.placeOrderBtn, !agreed && { opacity: 0.5 }]} onPress={handlePlaceOrder}>
            <Text style={styles.placeOrderText}>✓ Place Order</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  editBtn: { color: Colors.primary, fontWeight: 'bold', fontSize: 14 },
  addressName: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  addressText: { fontSize: 13, color: Colors.textMuted, marginBottom: 4 },
  orderItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  orderItemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  orderItemName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  orderItemQty: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  orderItemPrice: { fontSize: 15, fontWeight: 'bold', color: Colors.primary, marginLeft: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 16 },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  promoWrap: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, paddingBottom: 20, borderStyle: 'dashed', marginTop: 12 },
  promoInput: { flex: 1, borderWidth: 1, borderColor: Colors.borderLight, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, paddingHorizontal: 12, height: 44 },
  applyBtn: { backgroundColor: Colors.primary, borderTopRightRadius: 8, borderBottomRightRadius: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, height: 44 },
  applyText: { color: Colors.white, fontWeight: 'bold' },
  finalTotalLabel: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  finalTotalValue: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  secureBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 16, marginTop: 20, borderWidth: 1, borderColor: Colors.borderLight },
  secureRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  secureText: { fontSize: 12, color: Colors.textMuted },
  paymentMethods: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  payMethod: { fontSize: 12, fontWeight: 'bold', color: Colors.textPrimary },
  agreementRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, paddingHorizontal: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  agreementText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  linkText: { color: Colors.primary, fontWeight: '600' },
  actionButtons: { flexDirection: 'row', gap: 12 },
  backButtonAction: { flex: 1, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight, backgroundColor: Colors.white },
  backButtonText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600' },
  placeOrderBtn: { flex: 2, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e2e8f0' },
  placeOrderText: { color: Colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
});
