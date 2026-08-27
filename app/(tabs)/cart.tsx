import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { router } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartScreen() {
  const { cartItems, updateQty, removeFromCart, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please log in to proceed to checkout.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/(auth)/login') },
      ]);
      return;
    }
    router.push('/checkout');
  };

  const subtotal = cartTotal;
  const total = subtotal;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="bag-handle-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 }}>
            <Ionicons name="bag-outline" size={64} color={Colors.borderLight} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 16 }}>Your cart is empty</Text>
            <Text style={{ fontSize: 14, color: Colors.textMuted, marginTop: 8, marginBottom: 24 }}>Browse products and add them to your cart</Text>
            <TouchableOpacity style={{ backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 }} onPress={() => router.push('/(tabs)')}>
              <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 15 }}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemImageContainer}>
                <Image
                  source={item.image ? { uri: item.image } : require('../../assets/onboarding1.jpg')}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemPrice}>₦{(item.price * item.qty).toLocaleString()}</Text>

                <View style={styles.qtyControls}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty - 1)}>
                    <Ionicons name="remove" size={16} color={Colors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.qty + 1)}>
                    <Ionicons name="add" size={16} color={Colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Sheet Summary Overlay */}
      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />

        {/* <View style={styles.promoWrap}>
          <Ionicons name="pricetag-outline" size={20} color={Colors.textMuted} style={styles.promoIcon} />
          <TextInput 
            style={styles.promoInput}
            placeholder="Enter your promo code"
            placeholderTextColor={Colors.textMuted}
          />
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </View> */}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₦{subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Calculated by seller</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total amount</Text>
          <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
        </View>

        <TouchableOpacity style={[styles.checkoutBtn, cartItems.length === 0 && { opacity: 0.5 }]} disabled={cartItems.length === 0} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 350 },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  checkboxWrap: { marginRight: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  itemImageContainer: { width: 80, height: 80, borderRadius: 16, overflow: 'hidden', marginRight: 16 },
  itemImage: { width: '100%', height: '100%' },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  itemColor: { fontSize: 13, color: Colors.textMuted, marginBottom: 12 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderRadius: 20, paddingHorizontal: 6, paddingVertical: 4, alignSelf: 'flex-start' },
  qtyBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  qtyText: { width: 30, textAlign: 'center', fontSize: 14, fontWeight: 'bold' },
  rightActions: { height: 80, justifyContent: 'space-between', alignItems: 'flex-end', paddingVertical: 4 },
  deleteBtn: { padding: 4 },
  itemPrice: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 90 : 70, paddingTop: 12, shadowColor: Colors.black, shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 24 },
  dragHandle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
  promoWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderRadius: 12, paddingHorizontal: 16, height: 56, marginBottom: 24 },
  promoIcon: { marginRight: 12 },
  promoInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 8, borderStyle: 'dashed' },
  totalLabel: { fontSize: 15, color: Colors.textSecondary },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary },
  checkoutBtn: { backgroundColor: Colors.primary, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  checkoutBtnText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});
