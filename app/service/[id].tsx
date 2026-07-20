import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const MOCK_IMAGES = [
  require('../../assets/onboarding3.jpg'),
  require('../../assets/onboarding1.jpg'),
];

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [activeImage, setActiveImage] = useState(0);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageSection}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImage(slide);
            }}
            scrollEventThrottle={16}
          >
            {MOCK_IMAGES.map((img, i) => (
              <Image key={i} source={img} style={styles.mainImage} resizeMode="cover" />
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {MOCK_IMAGES.map((_, i) => (
              <View key={i} style={[styles.dot, activeImage === i && styles.activeDot]} />
            ))}
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

        <View style={styles.infoSection}>
          <Text style={styles.title}>Nice Cleaning Service</Text>
          
          <View style={styles.overviewBox}>
            <Text style={styles.sectionTitle}>Service Overview</Text>
            <Text style={styles.overviewText}>This is the main service description showing what they will do for you.</Text>

            <View style={styles.providerGrid}>
              <View style={styles.providerBox}>
                <Text style={styles.providerName}>Rooooler</Text>
                <View style={styles.providerStats}>
                  <Text style={styles.statGreen}>0%</Text>
                  <Text style={styles.statLabel}>Response Rate</Text>
                </View>
                <TouchableOpacity style={styles.viewStoreBtn}>
                  <Text style={styles.viewStoreText}>View Store Profile →</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.providerBox}>
                <Text style={styles.statLabel}>Rating</Text>
                <Text style={styles.stars}>★ <Text style={styles.ratingText}>0 (0 reviews)</Text></Text>
              </View>
            </View>

            <View style={styles.providerGrid}>
              <View style={styles.providerBox}>
                <Text style={styles.statLabel}>Location</Text>
                <Text style={styles.boldText}>Unknown</Text>
              </View>
              <View style={styles.providerBox}>
                <Text style={styles.statLabel}>Availability</Text>
                <Text style={styles.statGreen}>Active</Text>
              </View>
            </View>
          </View>

          {/* Booking Section */}
          <View style={styles.bookingBox}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Service Fee</Text>
              <Text style={styles.price}>₦5,690</Text>
            </View>

            <Text style={styles.inputLabel}>1. Select Date</Text>
            <TouchableOpacity style={styles.datePicker}>
              <Text style={styles.dateText}>dd/mm/yyyy</Text>
              <Ionicons name="calendar-outline" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.inputLabel}>2. Select Time</Text>
            <View style={styles.timeGrid}>
              {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'].map((time, i) => (
                <TouchableOpacity key={i} style={styles.timeSlot}>
                  <Text style={styles.timeText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.reserveBtn}>
              <Text style={styles.reserveText}>Reserve Service Now</Text>
            </TouchableOpacity>
            <Text style={styles.reserveNote}>No payment charged until you confirm on the next step.</Text>
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
  imageSection: { width, height: width * 0.7, backgroundColor: '#f5f5f5', position: 'relative' },
  mainImage: { width, height: width * 0.7 },
  pagination: { position: 'absolute', bottom: 16, width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  activeDot: { backgroundColor: Colors.primary, width: 24 },
  thumbnailRow: { flexDirection: 'row', padding: 16, gap: 12 },
  thumbnail: { width: 60, height: 60, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  activeThumbnail: { borderColor: Colors.primary },
  infoSection: { padding: 20, paddingTop: 0 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 20 },
  overviewBox: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.borderLight, shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12 },
  overviewText: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  providerGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  providerBox: { flex: 1, backgroundColor: Colors.surface2, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.borderLight },
  providerName: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  providerStats: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  statGreen: { color: Colors.success, fontWeight: 'bold', fontSize: 13 },
  statLabel: { color: Colors.textMuted, fontSize: 12 },
  viewStoreBtn: { borderWidth: 1, borderColor: Colors.primary, borderRadius: 6, paddingVertical: 6, alignItems: 'center' },
  viewStoreText: { color: Colors.primary, fontSize: 12, fontWeight: 'bold' },
  stars: { color: '#3C7FB2', fontSize: 14, marginTop: 4 },
  ratingText: { color: Colors.textPrimary, fontSize: 13, fontWeight: 'bold' },
  boldText: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 4 },
  bookingBox: { padding: 20, borderWidth: 1, borderColor: Colors.primary, borderRadius: 16, backgroundColor: Colors.white },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, paddingBottom: 16 },
  feeLabel: { fontSize: 16, color: Colors.textMuted, fontWeight: '600' },
  price: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  datePicker: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 48, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, paddingHorizontal: 16, marginBottom: 20 },
  dateText: { color: Colors.textPrimary, fontSize: 14 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  timeSlot: { width: '48%', height: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 6, marginBottom: 12 },
  timeText: { color: Colors.textPrimary, fontSize: 13 },
  reserveBtn: { backgroundColor: Colors.primary, height: 52, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  reserveText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  reserveNote: { textAlign: 'center', fontSize: 11, color: Colors.textMuted },
});
