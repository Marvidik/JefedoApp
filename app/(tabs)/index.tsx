import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '0', name: 'All', icon: 'apps-outline' },
  { id: '1', name: 'Fashion', icon: 'shirt-outline' },
  { id: '2', name: 'Electronics', icon: 'hardware-chip-outline' },
  { id: '3', name: 'Home', icon: 'home-outline' },
  { id: '4', name: 'Sports', icon: 'football-outline' },
  { id: '5', name: 'Health', icon: 'medkit-outline' },
  { id: '6', name: 'Automotive', icon: 'car-outline' },
  { id: '7', name: 'Toys', icon: 'game-controller-outline' },
  { id: '8', name: 'Beauty', icon: 'color-palette-outline' },
  { id: '9', name: 'Office', icon: 'briefcase-outline' },
  { id: '10', name: 'Garden', icon: 'leaf-outline' },
  { id: '11', name: 'Pet', icon: 'paw-outline' },
  { id: '12', name: 'Grocery', icon: 'cart-outline' },
];

const MOCK_PRODUCTS = [
  { id: '1', name: 'High Quality TCP Home Smoke Light', price: '₦20,000', oldPrice: '₦30,000', stock: '50 left', image: require('../../assets/onboarding3.jpg') },
  { id: '2', name: 'High quality Pop light 10-50W with buld', price: '₦10,000', oldPrice: '₦15,000', stock: '5000 left', image: require('../../assets/onboarding1.jpg') },
  { id: '3', name: 'High Quality PG Light LED COB', price: '₦80,000', oldPrice: '₦100,000', stock: '20 left', image: require('../../assets/onboarding2.jpg') },
  { id: '4', name: '6000A Car Jump Starter Pack Booster', price: '₦100,000', oldPrice: '₦120,000', stock: '10 left', image: require('../../assets/onboarding3.jpg') },
  { id: '5', name: 'Original Perfume', price: '₦50,000', oldPrice: '₦60,000', stock: '10 left', image: require('../../assets/onboarding1.jpg') },
  { id: '6', name: 'E motorcycle with display Led', price: '₦2,500,000', oldPrice: '₦3,000,000', stock: '7 left', image: require('../../assets/onboarding2.jpg') },
];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = React.useState('0');

  const goToDetails = (id: string) => {
    router.push(`/product/${id}`);
  };

  const goToSearch = () => {
    router.push('/search');
  };

  const renderProductCard = ({ item, isGrid = false }: { item: any, isGrid?: boolean }) => (
    <TouchableOpacity 
      style={[styles.productCard, isGrid ? styles.gridCard : styles.scrollCard]} 
      onPress={() => goToDetails(item.id)}
      activeOpacity={0.9}
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jefedo</Text>
        <TouchableOpacity style={styles.headerRight} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.searchBar} onPress={goToSearch} activeOpacity={0.8}>
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <Text style={styles.searchInputText}>Search products...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Ionicons 
                  name={cat.icon as any} 
                  size={18} 
                  color={isActive ? Colors.white : Colors.textPrimary} 
                  style={isActive ? { marginRight: 6 } : {}}
                />
                {isActive && <Text style={[styles.categoryText, styles.categoryTextActive]}>{cat.name}</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* First Scrollable Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Arrivals</Text>
        </View>
        <FlatList
          data={MOCK_PRODUCTS.slice(0, 4)}
          renderItem={(props) => renderProductCard({ ...props, isGrid: false })}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          snapToInterval={width * 0.45 + 16}
          decelerationRate="fast"
        />

        {/* Grid Products (2 per line, max 6) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
        </View>
        <View style={styles.gridContainer}>
          {MOCK_PRODUCTS.slice(0, 6).map((item) => (
            <React.Fragment key={item.id}>
              {renderProductCard({ item, isGrid: true })}
            </React.Fragment>
          ))}
        </View>

        {/* Second Scrollable Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Most Popular</Text>
        </View>
        <FlatList
          data={MOCK_PRODUCTS.slice().reverse()}
          renderItem={(props) => renderProductCard({ ...props, isGrid: false })}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.horizontalList, { paddingBottom: 100 }]}
          snapToInterval={width * 0.45 + 16}
          decelerationRate="fast"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  headerRight: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface2, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notifBadge: { position: 'absolute', top: -2, right: -2, backgroundColor: Colors.primary, width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.white },
  notifBadgeText: { color: Colors.white, fontSize: 9, fontWeight: 'bold' },
  scrollContent: { paddingTop: 10 },
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderRadius: 8, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: Colors.borderLight },
  searchInputText: { flex: 1, marginLeft: 10, fontSize: 15, color: Colors.textMuted },
  filterBtn: { width: 48, height: 48, backgroundColor: Colors.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  categoriesContainer: { paddingHorizontal: 20, marginBottom: 24, gap: 8 },
  categoryPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, height: 38, borderRadius: 19, backgroundColor: Colors.surface2, justifyContent: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  categoryPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, paddingHorizontal: 16 },
  categoryText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '500' },
  categoryTextActive: { color: Colors.white, fontWeight: '700' },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  horizontalList: { paddingHorizontal: 20, gap: 16, marginBottom: 24 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between', marginBottom: 24 },
  productCard: { backgroundColor: Colors.white, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  scrollCard: { width: width * 0.45 },
  gridCard: { width: '48%' },
  imageContainer: { width: '100%', height: 140, borderRadius: 8, overflow: 'hidden', marginBottom: 8, backgroundColor: '#f5f5f5' },
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
