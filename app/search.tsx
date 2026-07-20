import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const MOCK_RESULTS = [
  { id: '1', name: 'High Quality TCP Home Smoke Light', price: '₦20,000', oldPrice: '₦30,000', image: require('../assets/onboarding3.jpg') },
  { id: '2', name: 'Original Perfume', price: '₦50,000', image: require('../assets/onboarding1.jpg') },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.resultCard} 
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} resizeMode="cover" />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price}</Text>
          {item.oldPrice && <Text style={styles.oldPrice}>{item.oldPrice}</Text>}
        </View>
        <TouchableOpacity style={styles.addCartBtn}>
          <Text style={styles.addCartText}>+ Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      </View>

      <FlatList
        data={MOCK_RESULTS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <Text style={styles.resultsText}>
            {query ? `Showing results for "${query}"` : 'Recommended for you'}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { padding: 4, marginRight: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface2, borderRadius: 8, paddingHorizontal: 16, height: 44, borderWidth: 1, borderColor: Colors.borderLight },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: Colors.textPrimary },
  listContent: { padding: 16 },
  resultsText: { fontSize: 14, color: Colors.textMuted, marginBottom: 16 },
  row: { justifyContent: 'space-between' },
  resultCard: { width: '48%', backgroundColor: Colors.white, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  imageContainer: { width: '100%', height: 120, borderRadius: 8, overflow: 'hidden', marginBottom: 8, backgroundColor: '#f5f5f5' },
  productImage: { width: '100%', height: '100%' },
  productInfo: { flex: 1, justifyContent: 'space-between' },
  productName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, minHeight: 36 },
  priceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  price: { fontSize: 15, fontWeight: 'bold', color: Colors.primary },
  oldPrice: { fontSize: 12, color: Colors.textMuted, textDecorationLine: 'line-through' },
  addCartBtn: { width: '100%', backgroundColor: Colors.primary, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  addCartText: { color: Colors.white, fontSize: 13, fontWeight: 'bold' },
});
