import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, TextInput, ActivityIndicator, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';
import { getServices, getCategories } from '../../services/publicService';

const { width } = Dimensions.get('window');

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [activeCategory, setActiveCategory] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load categories once
  useEffect(() => {
    getCategories()
      .then(cats => setCategories(cats || []))
      .catch(err => console.error('Error fetching service categories', err));
  }, []);

  // Reload services when category or search changes
  useEffect(() => {
    fetchServices();
  }, [activeCategory, searchDebounce]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (activeCategory) params.category = activeCategory;
      if (searchDebounce) params.search = searchDebounce;
      const res = await getServices(params);
      setServices(res?.results || []);
    } catch (err) {
      console.error('Error fetching services', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  }, [activeCategory, searchDebounce]);

  const goToDetails = (slug: string) => {
    router.push(`/service/${slug}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
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

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={{ flexGrow: 0, marginBottom: 10 }}
      >
        <TouchableOpacity
          style={[styles.categoryPill, activeCategory === null && styles.categoryPillActive]}
          onPress={() => setActiveCategory(null)}
        >
          <Ionicons name="apps-outline" size={15} color={activeCategory === null ? Colors.white : Colors.textPrimary} />
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
              size={15}
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
        ) : services.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="briefcase-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyStateTitle}>No Services Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? `No services match "${searchQuery}"`
                : "No services available right now. Check back later!"}
            </Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {services.map((item) => {
              const imageSource = item.image
                ? { uri: item.image }
                : require('../../assets/onboarding3.jpg');

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.serviceCard}
                  onPress={() => goToDetails(item.slug)}
                  activeOpacity={0.9}
                >
                  <View style={styles.imageContainer}>
                    <Image source={imageSource} style={styles.serviceImage} resizeMode="cover" />
                    <TouchableOpacity style={styles.heartBtn}>
                      <Ionicons name="heart-outline" size={18} color={Colors.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.infoContainer}>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#3C7FB2" />
                      <Text style={styles.ratingText}>
                        {Number(item.rating || 0).toFixed(1)}{' '}
                        <Text style={styles.reviewText}>({item.review_count || 0})</Text>
                      </Text>
                    </View>

                    <Text style={styles.serviceName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.providerName}>{typeof item.shop === 'object' ? item.shop?.name : (item.shop || 'Jefedo')}</Text>

                    <View style={styles.bottomRow}>
                      <View>
                        <Text style={styles.startingFrom}>Starting from</Text>
                        <Text style={styles.price}>₦{Number(item.price).toLocaleString()}</Text>
                      </View>
                      <TouchableOpacity style={styles.bookBtn} onPress={() => goToDetails(item.id)}>
                        <Text style={styles.bookBtnText}>Book Now →</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderRadius: 10, marginHorizontal: 20, marginBottom: 14, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: Colors.borderLight },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: Colors.textPrimary },
  categoriesContainer: { paddingHorizontal: 20, marginBottom: 0, gap: 8 },
  categoryPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 36, borderRadius: 18, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.borderLight },
  categoryPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: Colors.white, fontWeight: '700' },
  scrollContent: { paddingBottom: 100 },
  centeredContent: { marginTop: 60, alignItems: 'center' },
  gridContainer: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceCard: { width: '48%', backgroundColor: Colors.white, borderRadius: 12, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight, elevation: 2 },
  imageContainer: { width: '100%', height: 120, backgroundColor: '#f5f5f5', position: 'relative' },
  serviceImage: { width: '100%', height: '100%' },
  heartBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  infoContainer: { padding: 10 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: Colors.textPrimary, marginLeft: 4 },
  reviewText: { color: Colors.textMuted, fontWeight: 'normal' },
  serviceName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2, minHeight: 34 },
  providerName: { fontSize: 11, color: Colors.textMuted, marginBottom: 10 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  startingFrom: { fontSize: 9, color: Colors.textMuted, marginBottom: 2 },
  price: { fontSize: 13, fontWeight: 'bold', color: Colors.primary },
  bookBtn: { backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  bookBtnText: { color: Colors.primary, fontSize: 10, fontWeight: 'bold' },
  emptyStateContainer: { padding: 40, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  emptyStateTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 16, marginBottom: 8 },
  emptyStateText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
});
