import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, FlatList, Dimensions, ActivityIndicator, TextInput, RefreshControl,
  Animated, Linking, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';
import { getCategories, getProducts } from '../../services/publicService';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

// ── Marquee Ticker ─────────────────────────────────────────────────────────
const msgs = [
  '🛍️ Buy & Sell Anything — Products, Services, Fashion, Gadgets, Tickets & More',
  '🚀 Grow Your Business on Jefedo Marketplace — Reach Thousands of Buyers Daily',
  '⚡ Flash Deals Happening Now — Discover Amazing Offers From Trusted Sellers',
  '💼 Need a Service? Find Designers, Developers, Event Planners, DJs, MCs & More',
  '📦 Start Selling Today — Upload Your Products or Services in Minutes',
  '🔒 Safe & Secure Payments for Buyers and Sellers Across Nigeria',
  '🎟️ Discover Events, Marketplace Deals & Professional Services All in One Place',
  '🌍 Shop From Local Vendors & Independent Businesses Near You',
  '💰 Turn Your Skills Into Income — Sell Services, Digital Products & Experiences',
  '⭐ Trusted Marketplace for Events, Services, Fashion, Electronics & Lifestyle',
  '📱 New Arrivals Daily — Explore Trending Products and Exclusive Marketplace Offers',
];

// Build a single long string with separators for seamless looping
const SEPARATOR = '     ·     ';
const fullText = msgs.join(SEPARATOR) + SEPARATOR;

function MarqueeTicker() {
  const translateX = useRef(new Animated.Value(0)).current;
  const textWidth = fullText.length * 8;

  useEffect(() => {
    const runAnimation = () => {
      translateX.setValue(0);
      Animated.timing(translateX, {
        toValue: -textWidth,
        duration: textWidth * 18,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) runAnimation();
      });
    };
    runAnimation();
  }, []);

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#0f172a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={marqueeStyles.wrapper}
    >
      {/* LIVE badge */}
      <View style={marqueeStyles.badgeRow}>
        <View style={marqueeStyles.liveBadge}>
          <View style={marqueeStyles.liveDot} />
          <Text style={marqueeStyles.liveText}>LIVE</Text>
        </View>
        <View style={marqueeStyles.track}>
          <Animated.Text
            style={[marqueeStyles.text, { transform: [{ translateX }] }]}
            numberOfLines={1}
          >
            {fullText + fullText}
          </Animated.Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const marqueeStyles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginHorizontal: 8,
    borderRadius: 4,
    gap: 4,
    flexShrink: 0,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  track: {
    flex: 1,
    overflow: 'hidden',
  },
  text: {
    fontSize: 12.5,
    color: '#fcd34d',
    fontWeight: '600',
    letterSpacing: 0.3,
    paddingVertical: 8,
    paddingRight: 20,
  },
});

// ── Main Screen ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { addToCart, cartItems } = useCart();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load categories once
  useEffect(() => {
    getCategories()
      .then(cats => setCategories(cats || []))
      .catch(err => console.error('Error fetching categories', err));
  }, []);

  // Reload products whenever category or search changes
  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchDebounce]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (activeCategory) params.category = activeCategory;
      if (searchDebounce) params.search = searchDebounce;
      const res = await getProducts(params);
      const results = res?.results || [];
      setProducts(results);
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [activeCategory, searchDebounce]);

  const goToDetails = (slug: string) => router.push(`/product/${slug}`);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: Number(item.price) || 0,
      image: item.image,
      qty: 1,
      seller: item.shop?.name || 'Jefedo',
    });
  };

  const openWhatsApp = () => {
    const phone = '2347064957209';
    const message = encodeURIComponent('Hello! I would like to place an order or inquire about your products/services.');
    Linking.openURL(`https://wa.me/${phone}?text=${message}`).catch(() => {
      Linking.openURL(`https://wa.me/${phone}`);
    });
  };

  const renderProductCard = (item: any, isGrid = false) => {
    const imageSource = item.image
      ? { uri: item.image }
      : require('../../assets/onboarding1.jpg');

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.productCard, isGrid ? styles.gridCard : styles.scrollCard]}
        onPress={() => goToDetails(item.slug || String(item.id))}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.productImage} resizeMode="cover" />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.stars}>★★★★★ <Text style={styles.reviewsText}>({item.reviews?.length || 0})</Text></Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₦{Number(item.price).toLocaleString()}</Text>
            {Number(item.original) > 0 && (
              <Text style={styles.oldPrice}>₦{Number(item.original).toLocaleString()}</Text>
            )}
            {item.stock_qty != null && (
              <Text style={styles.stock}>{item.stock_qty} left</Text>
            )}
          </View>
          
          {(() => {
            const inStock = item.stock_qty >= 1;
            const inCart = cartItems.some(i => i.id === item.id);
            return (
              <TouchableOpacity 
                style={[styles.addCartBtn, (!inStock || inCart) && { backgroundColor: Colors.borderLight }]} 
                onPress={() => handleAddToCart(item)}
                disabled={!inStock || inCart}
              >
                <Text style={[styles.addCartText, (!inStock || inCart) && { color: Colors.textMuted }]}>
                  {inCart ? 'Already in Cart' : !inStock ? 'Out of Stock' : '+ Add to Cart'}
                </Text>
              </TouchableOpacity>
            );
          })()}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {/* Logo image instead of text */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.headerRight} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* WhatsApp CTA — Premium Card */}
      <TouchableOpacity onPress={openWhatsApp} activeOpacity={0.88} style={styles.ctaCardOuter}>
        <LinearGradient
          colors={['#064e3b', '#065f46', '#047857']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaCard}
        >
          {/* Left glow accent */}
          <View style={styles.ctaGlowDot} />

          {/* Icon bubble */}
          <View style={styles.ctaIconBubble}>
            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
          </View>

          {/* Text block */}
          <View style={styles.ctaTextBlock}>
            <Text style={styles.ctaTopLabel}>📞 Call / Chat to Order</Text>
            <Text style={styles.ctaPhone}>+234 706 495 7209</Text>
            <Text style={styles.ctaSub}>Tap to chat on WhatsApp · Fast response</Text>
          </View>

          {/* Arrow chip */}
          <View style={styles.ctaArrow}>
            <Ionicons name="chevron-forward" size={16} color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Scrolling Marquee Ticker */}
      <MarqueeTicker />

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {/* "All" pill */}
        <TouchableOpacity
          style={[styles.categoryPill, activeCategory === null && styles.categoryPillActive]}
          onPress={() => setActiveCategory(null)}
        >
          <Ionicons name="apps-outline" size={16} color={activeCategory === null ? Colors.white : Colors.textPrimary} />
          <Text style={[styles.categoryText, activeCategory === null && styles.categoryTextActive]}>All</Text>
        </TouchableOpacity>

        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryPill, activeCategory === cat.id && styles.categoryPillActive]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Ionicons
              name={(cat.icon || 'pricetag-outline') as any}
              size={16}
              color={activeCategory === cat.id ? Colors.white : Colors.textPrimary}
            />
            <Text style={[styles.categoryText, activeCategory === cat.id && styles.categoryTextActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {loading ? (
          <View style={styles.centeredContent}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="cart-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyStateTitle}>No Products Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? `No products match "${searchQuery}"`
                : 'No products available right now. Check back later!'}
            </Text>
          </View>
        ) : (
          <>
            {/* Horizontal scroll — New Arrivals */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {searchQuery ? `Results for "${searchQuery}"` : activeCategory ? 'In Category' : 'New Arrivals'}
              </Text>
            </View>
            <FlatList
              data={products.slice(0, 6)}
              renderItem={({ item }) => renderProductCard(item, false)}
              keyExtractor={item => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              snapToInterval={width * 0.45 + 16}
              decelerationRate="fast"
            />

            {/* Grid */}
            {!searchQuery && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Featured Products</Text>
                </View>
                <View style={styles.gridContainer}>
                  {products.slice(0, 6).map(item => renderProductCard(item, true))}
                </View>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Most Popular</Text>
                </View>
                <FlatList
                  data={products.slice().reverse()}
                  renderItem={({ item }) => renderProductCard(item, false)}
                  keyExtractor={item => `pop-${item.id}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[styles.horizontalList, { paddingBottom: 100 }]}
                  snapToInterval={width * 0.45 + 16}
                  decelerationRate="fast"
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  headerLogo: { width: 130, height: 44 },
  headerRight: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface2, justifyContent: 'center', alignItems: 'center' },

  // WhatsApp CTA Premium Card
  ctaCardOuter: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#065f46',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
    overflow: 'hidden',
  },
  ctaGlowDot: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10b981',
    opacity: 0.12,
    top: -30,
    left: -20,
  },
  ctaIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaTextBlock: { flex: 1 },
  ctaTopLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  ctaPhone: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  ctaSub: {
    fontSize: 11,
    color: '#6ee7b7',
    fontWeight: '500',
  },
  ctaArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search
  searchSection: { paddingHorizontal: 16, marginBottom: 10, marginTop: 8 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderRadius: 8, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: Colors.borderLight },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: Colors.textPrimary },

  // Categories
  categoriesContainer: { paddingHorizontal: 16, marginBottom: 14, gap: 8 },
  categoryPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 36, borderRadius: 18, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.borderLight },
  categoryPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: Colors.white, fontWeight: '700' },

  // Content
  scrollContent: { paddingTop: 4 },
  centeredContent: { marginTop: 60, alignItems: 'center' },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  horizontalList: { paddingHorizontal: 20, gap: 14, marginBottom: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between', marginBottom: 20 },

  // Product card
  productCard: { backgroundColor: Colors.white, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: Colors.border, marginBottom: 14 },
  scrollCard: { width: width * 0.45 },
  gridCard: { width: '48%' },
  imageContainer: { width: '100%', height: 130, borderRadius: 8, overflow: 'hidden', marginBottom: 8, backgroundColor: '#f0f0f0' },
  productImage: { width: '100%', height: '100%' },
  productInfo: { flex: 1 },
  stars: { color: '#eab308', fontSize: 11, marginBottom: 4 },
  reviewsText: { color: Colors.textMuted, fontSize: 11 },
  productName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, minHeight: 34 },
  priceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  price: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  oldPrice: { fontSize: 12, color: Colors.textMuted, textDecorationLine: 'line-through' },
  stock: { fontSize: 11, color: Colors.success, fontWeight: '600', marginLeft: 'auto' },
  addCartBtn: { backgroundColor: Colors.primary, paddingVertical: 7, borderRadius: 6, alignItems: 'center' },
  addCartText: { color: Colors.white, fontSize: 12, fontWeight: 'bold' },

  // Empty state
  emptyStateContainer: { padding: 40, alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  emptyStateTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 16, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
});
