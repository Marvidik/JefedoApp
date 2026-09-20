import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, FlatList, Dimensions, ActivityIndicator, TextInput, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';
import { getCategories, getProducts } from '../../services/publicService';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState<any>(null); // null = All
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
        <Text style={styles.headerTitle}>Jefedo</Text>
        <TouchableOpacity style={styles.headerRight} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  headerRight: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface2, justifyContent: 'center', alignItems: 'center' },
  searchSection: { paddingHorizontal: 20, marginBottom: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderRadius: 8, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: Colors.borderLight },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: Colors.textPrimary },
  categoriesContainer: { paddingHorizontal: 20, marginBottom: 16, gap: 8 },
  categoryPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 36, borderRadius: 18, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.borderLight },
  categoryPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: Colors.white, fontWeight: '700' },
  scrollContent: { paddingTop: 4 },
  centeredContent: { marginTop: 60, alignItems: 'center' },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  horizontalList: { paddingHorizontal: 20, gap: 14, marginBottom: 20 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between', marginBottom: 20 },
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
  emptyStateContainer: { padding: 40, alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  emptyStateTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 16, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
});
