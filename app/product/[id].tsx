import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const MOCK_IMAGES = [
  require('../../assets/onboarding3.jpg'),
  require('../../assets/onboarding1.jpg'),
  require('../../assets/onboarding2.jpg'),
];

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={() => router.push('/cart')}>
          <Ionicons name="bag-handle-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.imageSection}>
          <Image source={MOCK_IMAGES[activeImage]} style={styles.mainImage} resizeMode="cover" />
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomBtn}>
              <Ionicons name="add" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomBtn}>
              <Ionicons name="remove" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thumbnail row */}
        <View style={styles.thumbnailRow}>
          {MOCK_IMAGES.map((img, i) => (
            <TouchableOpacity key={i} style={[styles.thumbnail, activeImage === i && styles.activeThumbnail]} onPress={() => setActiveImage(i)}>
              <Image source={img} style={{ width: '100%', height: '100%' }} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.imageHint}>Scroll or use +/- to zoom · Drag to pan</Text>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.brand}>JEFEDO</Text>
          <Text style={styles.title}>High Quality TCP Home Smoke Light</Text>
          
          <View style={styles.statsRow}>
            <Text style={styles.stars}>★★★★★ <Text style={styles.statsText}>0 (0 reviews)</Text></Text>
            <Text style={styles.statsDivider}>|</Text>
            <Text style={styles.statsText}>0+ Sold</Text>
            <Text style={styles.statsDivider}>|</Text>
            <Text style={styles.inStock}>✓ In Stock</Text>
            <Text style={styles.statsText}>50 remaining</Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.price}>₦20,000</Text>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <View style={styles.qtyControl}>
              <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}>
                <Ionicons name="remove" size={18} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity onPress={() => setQty(qty + 1)} style={styles.qtyBtn}>
                <Ionicons name="add" size={18} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addToCartBtn}>
              <Text style={styles.addToCartText}>Add to Cart — ₦{(20000 * qty).toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.favBtn}>
              <Ionicons name="heart" size={24} color={Colors.borderLight} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.buyNowBtn}>
            <Text style={styles.buyNowText}>⚡ Buy It Now</Text>
          </TouchableOpacity>

          <View style={styles.noticeBox}>
            <Ionicons name="warning" size={18} color="#b45309" style={{ marginRight: 8 }} />
            <Text style={styles.noticeText}>Sales Taxes may apply at checkout. Final price will be confirmed before payment.</Text>
          </View>

          {/* Store Info */}
          <View style={styles.storeBox}>
            <View style={styles.storeLeft}>
              <View style={styles.storeIcon}>
                <Text style={styles.storeIconText}>24</Text>
              </View>
              <View>
                <Text style={styles.storeName}>JEFEDO</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.storeResponse}>0% Response Rate</Text>
                  <Text style={styles.storeStats}> Ships in 1-2 Days</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.visitStoreBtn} onPress={() => router.push('/store/1')}>
              <Text style={styles.visitStoreText}>Visit Store</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {['Description', 'Specifications', 'Reviews (0)'].map(tab => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {activeTab === 'Description' && (
              <View>
                <Text style={styles.tabTitle}>Product Overview</Text>
                <Text style={styles.tabBody}>Cop Srew / E27 / E5 64m lm bulb Holder 10cm From England.</Text>
              </View>
            )}
            {activeTab === 'Specifications' && (
              <View>
                <Text style={styles.tabTitle}>Specifications</Text>
                <Text style={styles.tabBody}>- Voltage: 220V{"\n"}- Type: E27{"\n"}- Material: Metal / Glass</Text>
              </View>
            )}
            {activeTab === 'Reviews (0)' && (
              <View>
                <Text style={styles.tabTitle}>Customer Reviews</Text>
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewScore}>0.0</Text>
                  <Text style={styles.stars}>☆☆☆☆☆</Text>
                  <Text style={styles.statsText}>Based on 0 reviews</Text>
                </View>

                <View style={styles.writeReviewBox}>
                  <Text style={styles.writeReviewTitle}>Write a Review</Text>
                  <Text style={styles.inputLabel}>Your Rating</Text>
                  <View style={styles.starSelection}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons key={star} name="star-outline" size={24} color={Colors.borderLight} style={{ marginRight: 6 }} />
                    ))}
                  </View>
                  <Text style={styles.inputLabel}>Your Review</Text>
                  <TextInput 
                    style={styles.reviewInput}
                    placeholder="Share your experience..."
                    placeholderTextColor={Colors.textMuted}
                    multiline
                  />
                  <TouchableOpacity style={styles.postReviewBtn}>
                    <Text style={styles.postReviewText}>Post Review</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ textAlign: 'center', color: Colors.textMuted, marginTop: 30 }}>No reviews yet. Be the first to review!</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  imageSection: { width, height: width, backgroundColor: '#f5f5f5', position: 'relative' },
  mainImage: { width, height: width },
  zoomControls: { position: 'absolute', bottom: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8, overflow: 'hidden' },
  zoomBtn: { padding: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  thumbnailRow: { flexDirection: 'row', padding: 16, paddingBottom: 8, gap: 12 },
  thumbnail: { width: 50, height: 50, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  activeThumbnail: { borderColor: Colors.primary },
  imageHint: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', marginBottom: 16 },
  infoSection: { padding: 20, paddingTop: 0 },
  brand: { fontSize: 12, color: Colors.primary, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  stars: { color: Colors.borderLight, fontSize: 12 },
  statsText: { fontSize: 12, color: Colors.textMuted },
  statsDivider: { color: Colors.borderLight, fontSize: 12 },
  inStock: { fontSize: 12, color: Colors.success, fontWeight: '600' },
  priceBox: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 12, padding: 16, marginBottom: 16 },
  price: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, paddingHorizontal: 4 },
  qtyBtn: { padding: 12 },
  qtyText: { width: 24, textAlign: 'center', fontSize: 16, fontWeight: '600' },
  addToCartBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  addToCartText: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
  favBtn: { width: 52, height: 52, backgroundColor: Colors.white, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  buyNowBtn: { width: '100%', height: 48, backgroundColor: '#fef2f2', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.primary, marginBottom: 16 },
  buyNowText: { color: Colors.primary, fontSize: 15, fontWeight: 'bold' },
  noticeBox: { backgroundColor: '#fffbeb', padding: 12, borderRadius: 8, marginBottom: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#fde68a' },
  noticeText: { color: '#b45309', fontSize: 11, flex: 1, fontWeight: '500' },
  storeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 12, marginBottom: 32 },
  storeLeft: { flexDirection: 'row', alignItems: 'center' },
  storeIcon: { width: 40, height: 40, backgroundColor: '#e0f2fe', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  storeIconText: { color: '#0284c7', fontWeight: 'bold', fontSize: 12 },
  storeName: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 2 },
  storeResponse: { fontSize: 11, color: Colors.success, fontWeight: '600' },
  storeStats: { fontSize: 11, color: Colors.textMuted },
  visitStoreBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: Colors.borderLight },
  visitStoreText: { fontSize: 12, color: Colors.primary, fontWeight: 'bold' },
  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.borderLight, marginBottom: 20 },
  tab: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  activeTabText: { color: Colors.primary },
  tabContent: { paddingBottom: 40 },
  tabTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12 },
  tabBody: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  reviewBox: { marginBottom: 24 },
  reviewScore: { fontSize: 40, fontWeight: 'bold', color: Colors.primary },
  writeReviewBox: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 12, padding: 16 },
  writeReviewTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12 },
  inputLabel: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 8 },
  starSelection: { flexDirection: 'row', marginBottom: 16 },
  reviewInput: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, padding: 12, height: 80, textAlignVertical: 'top', color: Colors.textPrimary, marginBottom: 16 },
  postReviewBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center', width: 120 },
  postReviewText: { color: Colors.white, fontSize: 13, fontWeight: 'bold' },
});
