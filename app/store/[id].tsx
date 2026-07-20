import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const MOCK_PRODUCTS = [
  { id: '1', name: 'High Quality TCP Home Smoke Light', price: '₦20,000', oldPrice: '₦30,000', stock: '50 left', image: require('../../assets/onboarding3.jpg') },
  { id: '2', name: 'High quality Pop light 10-50W with buld', price: '₦10,000', oldPrice: '₦15,000', stock: '5000 left', image: require('../../assets/onboarding1.jpg') },
  { id: '3', name: 'High Quality PG Light LED COB', price: '₦80,000', oldPrice: '₦100,000', stock: '20 left', image: require('../../assets/onboarding2.jpg') },
];

export default function StoreScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('All Products');

  const renderProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.gridCard} 
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} resizeMode="cover" />
      </View>
      <View style={styles.productInfo}>
        <View style={styles.ratingRow}>
          <Text style={styles.stars}>★★★★★ <Text style={styles.reviewsText}>(0)</Text></Text>
        </View>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price}</Text>
          {item.oldPrice && <Text style={styles.oldPrice}>{item.oldPrice}</Text>}
          <Text style={styles.stock}>{item.stock}</Text>
        </View>
        <TouchableOpacity style={styles.addCartBtn}>
          <Text style={styles.addCartText}>+ Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <SafeAreaView edges={['top']}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Store Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>J</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.storeNameRow}>
                <Text style={styles.storeName}>JEFEDO</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ VERIFIED SHOP</Text>
                </View>
              </View>
              <Text style={styles.handle}>@jefedo</Text>
              <View style={styles.statsRow}>
                <Text style={styles.statText}>★ 0 <Text style={styles.statSub}>(0 reviews)</Text></Text>
                <Text style={styles.statText}>📍 Unknown</Text>
                <Text style={styles.statText}>📅 Joined 2026</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.contactBtn}>
            <Text style={styles.contactBtnText}>Contact Seller</Text>
          </TouchableOpacity>
        </View>

        {/* About Box */}
        <View style={styles.aboutBox}>
          <Text style={styles.aboutTitle}>ABOUT JEFEDO</Text>
          <Text style={styles.aboutSub}>Store Performance</Text>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>Positive Feedback</Text>
            <Text style={styles.perfValueGreen}>0.0%</Text>
          </View>
          <View style={styles.perfRow}>
            <Text style={styles.perfLabel}>Response Rate</Text>
            <Text style={styles.perfValue}>0%</Text>
          </View>
          <Text style={[styles.aboutSub, { marginTop: 16 }]}>Categories</Text>
          <Text style={styles.aboutCat}>Jeweries</Text>
          <Text style={styles.aboutCat}>Home</Text>
        </View>

        {/* Store Tabs */}
        <View style={styles.tabsContainer}>
          {['All Products', 'Best Sellers', 'New Arrivals'].map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Products Grid */}
        <View style={styles.gridContainer}>
          {MOCK_PRODUCTS.map(item => (
            <React.Fragment key={item.id}>
              {renderProductCard({ item })}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface2 },
  headerBackground: { height: 140, backgroundColor: '#0f172a', paddingHorizontal: 16 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  scrollContent: { paddingBottom: 40 },
  profileCard: { backgroundColor: Colors.white, marginHorizontal: 16, marginTop: -40, borderRadius: 16, padding: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, marginBottom: 16 },
  profileTopRow: { flexDirection: 'row', marginBottom: 16 },
  avatarWrap: { marginRight: 16 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: Colors.white },
  profileInfo: { flex: 1, justifyContent: 'center' },
  storeNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  storeName: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary, marginRight: 8 },
  verifiedBadge: { backgroundColor: Colors.success, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  verifiedText: { color: Colors.white, fontSize: 10, fontWeight: 'bold' },
  handle: { fontSize: 13, color: Colors.textMuted, marginBottom: 8 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statText: { fontSize: 12, color: Colors.textPrimary, fontWeight: '500' },
  statSub: { color: Colors.textMuted, fontWeight: 'normal' },
  contactBtn: { backgroundColor: Colors.primary, height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  contactBtnText: { color: Colors.white, fontSize: 14, fontWeight: 'bold' },
  aboutBox: { backgroundColor: Colors.white, marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight },
  aboutTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 16 },
  aboutSub: { fontSize: 12, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  perfRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  perfLabel: { fontSize: 13, color: Colors.textSecondary },
  perfValueGreen: { fontSize: 13, fontWeight: 'bold', color: Colors.success },
  perfValue: { fontSize: 13, fontWeight: 'bold', color: Colors.textPrimary },
  aboutCat: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, marginBottom: 16, gap: 16 },
  tab: { paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  activeTabText: { color: Colors.primary },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between' },
  gridCard: { width: '48%', backgroundColor: Colors.white, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  imageContainer: { width: '100%', height: 120, borderRadius: 8, overflow: 'hidden', marginBottom: 8, backgroundColor: '#f5f5f5' },
  productImage: { width: '100%', height: '100%' },
  productInfo: { flex: 1, justifyContent: 'space-between' },
  ratingRow: { marginBottom: 4 },
  stars: { color: '#eab308', fontSize: 12 },
  reviewsText: { color: Colors.textMuted, fontSize: 12 },
  productName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, minHeight: 36 },
  priceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  price: { fontSize: 15, fontWeight: 'bold', color: Colors.primary },
  oldPrice: { fontSize: 12, color: Colors.textMuted, textDecorationLine: 'line-through' },
  stock: { fontSize: 11, color: Colors.success, fontWeight: '600', marginLeft: 'auto' },
  addCartBtn: { width: '100%', backgroundColor: Colors.primary, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  addCartText: { color: Colors.white, fontSize: 13, fontWeight: 'bold' },
});
