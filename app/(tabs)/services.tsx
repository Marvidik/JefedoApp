import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const SERVICE_CATEGORIES = [
  { id: '1', name: 'All Services', icon: 'apps-outline' },
  { id: '2', name: 'Personal Care', icon: 'cut-outline' },
  { id: '3', name: 'Cleaning', icon: 'color-wand-outline' },
  { id: '4', name: 'Repairs', icon: 'hammer-outline' },
  { id: '5', name: 'Design', icon: 'color-palette-outline' },
  { id: '6', name: 'Tech Support', icon: 'laptop-outline' },
];

const MOCK_SERVICES = [
  { id: '1', name: 'nice', provider: 'by ', price: '₦5,690', image: require('../../assets/onboarding3.jpg') },
  { id: '2', name: 'Obi services', provider: 'by ', price: '₦10,000', image: require('../../assets/onboarding1.jpg') },
  { id: '3', name: 'Master Class Consulting', provider: 'by ', price: '₦600,000', image: require('../../assets/onboarding2.jpg') },
];

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('1');
  const goToDetails = (id: string) => {
    router.push(`/service/${id}`);
  };

  const filteredServices = MOCK_SERVICES.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
      </View>

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {SERVICE_CATEGORIES.map((cat, index) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.categoryPill, activeCategory === cat.id && styles.categoryPillActive]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Ionicons 
                name={cat.icon as any} 
                size={16} 
                color={activeCategory === cat.id ? Colors.white : Colors.textPrimary} 
                style={{ marginRight: 6 }}
              />
              {activeCategory === cat.id && (
                <Text style={styles.categoryTextActive}>{cat.name}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Services Grid */}
        <View style={styles.gridContainer}>
          {filteredServices.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.serviceCard}
              onPress={() => goToDetails(item.id)}
              activeOpacity={0.9}
            >
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.serviceImage} resizeMode="cover" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
                <TouchableOpacity style={styles.heartBtn}>
                  <Ionicons name="heart-outline" size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={styles.infoContainer}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#3C7FB2" />
                  <Text style={styles.ratingText}>0 <Text style={styles.reviewText}>(0)</Text></Text>
                </View>

                <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.providerName}>{item.provider}</Text>

                <View style={styles.bottomRow}>
                  <View>
                    <Text style={styles.startingFrom}>Starting from</Text>
                    <Text style={styles.price}>{item.price}</Text>
                  </View>
                  <TouchableOpacity style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>Book Now →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderRadius: 10, marginHorizontal: 20, marginBottom: 16, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: Colors.borderLight },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: Colors.textPrimary },
  scrollContent: { paddingBottom: 100 },
  categoriesContainer: { paddingHorizontal: 20, marginBottom: 24, gap: 10 },
  categoryPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 36, borderRadius: 18, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderLight, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  categoryPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: Colors.white, fontWeight: '700' },
  gridContainer: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceCard: { width: '48%', backgroundColor: Colors.white, borderRadius: 12, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  imageContainer: { width: '100%', height: 120, backgroundColor: '#f5f5f5', position: 'relative' },
  serviceImage: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: 'bold' },
  heartBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  infoContainer: { padding: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: Colors.textPrimary, marginLeft: 4 },
  reviewText: { color: Colors.textMuted, fontWeight: 'normal' },
  serviceName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  providerName: { fontSize: 11, color: Colors.textMuted, marginBottom: 12 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  startingFrom: { fontSize: 9, color: Colors.textMuted, marginBottom: 2 },
  price: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  bookBtn: { backgroundColor: Colors.primaryLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  bookBtnText: { color: Colors.primary, fontSize: 10, fontWeight: 'bold' },
});
