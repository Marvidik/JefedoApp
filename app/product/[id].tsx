import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { getProductDetail } from '../../services/publicService';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

const FALLBACK_IMAGES = [
  require('../../assets/onboarding3.jpg'),
  require('../../assets/onboarding1.jpg'),
  require('../../assets/onboarding2.jpg'),
];

export default function ProductDetailsScreen() {
  // File is named [id].tsx but we pass the slug
  const { id: slug } = useLocalSearchParams<{ id: string }>();
  const { addToCart, cartItems } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getProductDetail(slug as string)
      .then(setProduct)
      .catch(err => {
        console.error('Product load error', err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const images: any[] = product?.image
    ? [
        { uri: product.image },
        ...(product.image1 ? [{ uri: product.image1 }] : []),
        ...(product.image2 ? [{ uri: product.image2 }] : []),
        ...(product.image3 ? [{ uri: product.image3 }] : []),
        ...(product.image4 ? [{ uri: product.image4 }] : []),
      ]
    : FALLBACK_IMAGES;

  const price = product ? Number(product.price) : 0;
  const originalPrice = product?.original ? Number(product.original) : null;
  const hasDiscount = originalPrice && originalPrice > price;
  const title = product?.name || 'Product';
  const seller = product?.seller;
  const storeName = seller?.store_name || 'JEFEDO';
  const storeSlug = seller?.slug || '';
  const inStock = (product?.stock_qty ?? 1) >= 1;
  const reviewCount = product?.review_count || product?.reviews?.length || 0;
  const avgRating = product?.rating || product?.rating_stats?.average_rating || 0;
  const ratingStats = product?.rating_stats;
  const reviews: any[] = product?.reviews || [];
  const specifications: Record<string, string> | null = product?.specifications || null;
  
  const inCart = cartItems.some(item => item.id === product?.id);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: price,
      originalPrice: originalPrice || undefined,
      image: typeof images[0] === 'object' && 'uri' in images[0] ? images[0].uri : undefined,
      qty: qty,
      seller: storeName,
    });
    Alert.alert('Added to cart', `${product.name} × ${qty} added.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart();
    router.push('/checkout');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={{ width: 32 }} />
        </View>
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/cart')}>
          <Ionicons name="bag-handle-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.imageSection}>
          <Image source={images[activeImage]} style={styles.mainImage} resizeMode="cover" />
        </View>

        {/* Thumbnail row */}
        <View style={styles.thumbnailRow}>
          {images.map((img, i) => (
            <TouchableOpacity key={i} style={[styles.thumbnail, activeImage === i && styles.activeThumbnail]} onPress={() => setActiveImage(i)}>
              <Image source={img} style={{ width: '100%', height: '100%' }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.brand}>{storeName}</Text>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.statsRow}>
            <Text style={styles.stars}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))} </Text>
            <Text style={styles.statsText}>({reviewCount} reviews)</Text>
            <Text style={styles.statsDivider}>|</Text>
            {inStock
              ? <Text style={styles.inStock}>✓ In Stock</Text>
              : <Text style={[styles.inStock, { color: Colors.danger }]}>✗ Out of Stock</Text>
            }
            {product?.stock_qty !== undefined && <Text style={styles.statsText}>{product.stock_qty} remaining</Text>}
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.price}>₦{price.toLocaleString()}</Text>
            {!!hasDiscount && <Text style={styles.oldPrice}>₦{originalPrice!.toLocaleString()}</Text>}
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
            <TouchableOpacity 
              style={[styles.addToCartBtn, (!inStock || inCart) && { backgroundColor: Colors.borderLight }]} 
              onPress={handleAddToCart} 
              disabled={!inStock || inCart}
            >
              <Text style={[styles.addToCartText, (!inStock || inCart) && { color: Colors.textMuted }]}>
                {inCart ? 'Already in Cart' : !inStock ? 'Out of Stock' : `Add to Cart — ₦${(price * qty).toLocaleString()}`}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow} disabled={!inStock}>
            <Text style={styles.buyNowText}>⚡ Buy It Now</Text>
          </TouchableOpacity>

          <View style={styles.noticeBox}>
            <Ionicons name="warning" size={18} color="#b45309" style={{ marginRight: 8 }} />
            <Text style={styles.noticeText}>Sales Taxes may apply at checkout. Final price will be confirmed before payment.</Text>
          </View>

          {/* Store Info */}
          {!!storeSlug && (
            <View style={styles.storeBox}>
              <View style={styles.storeLeft}>
                <View style={styles.storeIcon}>
                  <Text style={styles.storeIconText}>{storeName.slice(0, 2).toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={styles.storeName}>{storeName}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.visitStoreBtn} onPress={() => router.push(`/store/${storeSlug}` as any)}>
                <Text style={styles.visitStoreText}>Visit Store</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {['Description', 'Specifications', `Reviews (${reviewCount})`].map(tab => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {activeTab === 'Description' && (
              <View>
                <Text style={styles.tabTitle}>Product Overview</Text>
                <Text style={styles.tabBody}>{product?.description || 'No description available.'}</Text>
              </View>
            )}
            {activeTab === 'Specifications' && (
              <View>
                <Text style={styles.tabTitle}>Specifications</Text>
                {specifications && Object.keys(specifications).length > 0 ? (
                  Object.entries(specifications).map(([key, val]) => (
                    <View key={key} style={styles.specRow}>
                      <Text style={styles.specKey}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                      <Text style={styles.specVal}>{val}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.tabBody}>No specifications listed.</Text>
                )}
              </View>
            )}
            {activeTab.startsWith('Reviews') && (
              <View>
                <Text style={styles.tabTitle}>Customer Reviews</Text>
                <View style={styles.reviewBox}>
                  <Text style={styles.reviewScore}>{Number(avgRating).toFixed(1)}</Text>
                  <Text style={styles.stars}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</Text>
                  <Text style={styles.statsText}>Based on {reviewCount} reviews</Text>
                </View>
                {reviews.length > 0 ? (
                  reviews.map((rev: any) => (
                    <View key={rev.id} style={styles.reviewItem}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={styles.reviewerName}>{rev.user_name || 'Anonymous'}</Text>
                        <Text style={{ fontSize: 11, color: Colors.textMuted }}>{new Date(rev.created_at).toLocaleDateString()}</Text>
                      </View>
                      <Text style={styles.stars}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</Text>
                      <Text style={[styles.tabBody, { marginTop: 4 }]}>{rev.comment}</Text>
                      {rev.is_verified_purchase && <Text style={{ fontSize: 11, color: Colors.success, marginTop: 4 }}>✓ Verified Purchase</Text>}
                    </View>
                  ))
                ) : (
                  <Text style={{ textAlign: 'center', color: Colors.textMuted, marginTop: 30 }}>No reviews yet. Be the first!</Text>
                )}
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
  imageSection: { width, height: width, backgroundColor: '#f5f5f5' },
  mainImage: { width, height: width },
  thumbnailRow: { flexDirection: 'row', padding: 16, paddingBottom: 8, gap: 12 },
  thumbnail: { width: 50, height: 50, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  activeThumbnail: { borderColor: Colors.primary },
  infoSection: { padding: 20, paddingTop: 0 },
  brand: { fontSize: 12, color: Colors.primary, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  stars: { color: '#eab308', fontSize: 12 },
  statsText: { fontSize: 12, color: Colors.textMuted },
  statsDivider: { color: Colors.borderLight, fontSize: 12 },
  inStock: { fontSize: 12, color: Colors.success, fontWeight: '600' },
  priceBox: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 12, padding: 16, marginBottom: 16 },
  price: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
  oldPrice: { fontSize: 16, color: Colors.textMuted, textDecorationLine: 'line-through', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, paddingHorizontal: 4 },
  qtyBtn: { padding: 12 },
  qtyText: { width: 24, textAlign: 'center', fontSize: 16, fontWeight: '600' },
  addToCartBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  addToCartText: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
  buyNowBtn: { width: '100%', height: 48, backgroundColor: '#fef2f2', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.primary, marginBottom: 16 },
  buyNowText: { color: Colors.primary, fontSize: 15, fontWeight: 'bold' },
  noticeBox: { backgroundColor: '#fffbeb', padding: 12, borderRadius: 8, marginBottom: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#fde68a' },
  noticeText: { color: '#b45309', fontSize: 11, flex: 1, fontWeight: '500' },
  storeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 12, marginBottom: 32 },
  storeLeft: { flexDirection: 'row', alignItems: 'center' },
  storeIcon: { width: 40, height: 40, backgroundColor: '#e0f2fe', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  storeIconText: { color: '#0284c7', fontWeight: 'bold', fontSize: 12 },
  storeName: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 2 },
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
  specRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  specKey: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  specVal: { flex: 2, fontSize: 14, color: Colors.textSecondary },
  reviewBox: { marginBottom: 24 },
  reviewScore: { fontSize: 40, fontWeight: 'bold', color: Colors.primary },
  reviewItem: { borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, padding: 12, marginBottom: 12 },
  reviewerName: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
});
