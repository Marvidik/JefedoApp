import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { getServiceDetail } from '../../services/publicService';

const { width } = Dimensions.get('window');

const FALLBACK_IMAGE = require('../../assets/onboarding3.jpg');

export default function ServiceDetailsScreen() {
  // Route param is named 'id' by the file name but we pass a slug
  const { id: slug } = useLocalSearchParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    getServiceDetail(slug)
      .then(setService)
      .catch(err => {
        console.error('Service load error', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Build image list from response fields
  const images: any[] = service?.image
    ? [
        { uri: service.image },
        ...(service.image2 ? [{ uri: service.image2 }] : []),
        ...(service.image3 ? [{ uri: service.image3 }] : []),
        ...(service.image4 ? [{ uri: service.image4 }] : []),
      ]
    : [FALLBACK_IMAGE];

  const price = service ? Number(service.price) : 0;
  const originalPrice = service?.original ? Number(service.original) : null;
  const hasDiscount = originalPrice && originalPrice > price;
  const title = service?.name || 'Service';
  const seller = service?.seller;
  const storeName = seller?.store_name || 'Jefedo';
  const storeLocation = seller?.location || 'Unknown';
  const responseRate = seller?.response_rate_pct ?? 100;
  const description = service?.description || 'No description available.';
  const reviewCount = service?.review_count || service?.reviews?.length || 0;
  const avgRating = service?.rating || 0;
  const ratingStats = service?.rating_stats;
  const reviews: any[] = service?.reviews || [];
  const duration = service?.duration;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !service) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={{ marginTop: 12, color: Colors.textMuted, fontSize: 15 }}>Failed to load service</Text>
        <TouchableOpacity style={{ marginTop: 16 }} onPress={() => router.back()}>
          <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const StarRow = ({ count, stars }: { count: number; stars: number }) => (
    <View style={styles.starRow}>
      <Text style={styles.starLabel}>{stars}★</Text>
      <View style={styles.starBarBg}>
        <View style={[styles.starBarFill, { width: `${ratingStats?.total_reviews ? (count / ratingStats.total_reviews) * 100 : 0}%` as any }]} />
      </View>
      <Text style={styles.starCount}>{count}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
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
            {images.map((img, i) => (
              <Image key={i} source={img} style={styles.mainImage} resizeMode="cover" />
            ))}
          </ScrollView>
          {images.length > 1 && (
            <View style={styles.pagination}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, activeImage === i && styles.activeDot]} />
              ))}
            </View>
          )}
        </View>

        {/* Thumbnail row */}
        {images.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailRow}>
            {images.map((img, i) => (
              <TouchableOpacity key={i} style={[styles.thumbnail, activeImage === i && styles.activeThumbnail]} onPress={() => setActiveImage(i)}>
                <Image source={img} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.infoSection}>
          {/* Title & Price */}
          <Text style={styles.title}>{title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₦{price.toLocaleString()}</Text>
            {!!hasDiscount && (
              <Text style={styles.originalPrice}>₦{originalPrice!.toLocaleString()}</Text>
            )}
            {duration ? <Text style={styles.duration}>· {duration} min</Text> : null}
          </View>

          {/* Rating summary */}
          <View style={styles.ratingBar}>
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={styles.ratingText}>{Number(avgRating).toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({reviewCount} reviews)</Text>
          </View>

          {/* Service Overview */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Service Overview</Text>
            <Text style={styles.overviewText}>{description}</Text>
          </View>

          {/* Seller Info */}
          {seller && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Service Provider</Text>
              <View style={styles.sellerRow}>
                <View style={styles.sellerAvatar}>
                  {seller.logo ? (
                    <Image source={{ uri: seller.logo }} style={styles.sellerLogoImg} />
                  ) : (
                    <Text style={styles.sellerAvatarText}>{storeName[0]}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.sellerNameRow}>
                    <Text style={styles.sellerName}>{storeName}</Text>
                    {seller.is_verified && (
                      <Ionicons name="checkmark-circle" size={14} color={Colors.primary} style={{ marginLeft: 4 }} />
                    )}
                  </View>
                  <Text style={styles.sellerLocation}>📍 {storeLocation}</Text>
                </View>
              </View>
              <View style={styles.sellerStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{seller.rating > 0 ? Number(seller.rating).toFixed(1) : '—'}</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{responseRate}%</Text>
                  <Text style={styles.statLabel}>Response Rate</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{seller.shipping_time || 'Flexible'}</Text>
                  <Text style={styles.statLabel}>Turnaround</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewStoreBtn} onPress={() => router.push(`/store/${seller.slug}` as any)}>
                <Text style={styles.viewStoreText}>View Store Profile →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Ratings Breakdown */}
          {ratingStats && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
              <View style={styles.ratingOverview}>
                <View style={styles.bigRating}>
                  <Text style={styles.bigRatingNum}>{Number(ratingStats.average_rating).toFixed(1)}</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Ionicons key={s} name={s <= Math.round(ratingStats.average_rating) ? 'star' : 'star-outline'} size={16} color="#f59e0b" />
                    ))}
                  </View>
                  <Text style={styles.totalReviews}>{ratingStats.total_reviews} reviews</Text>
                </View>
                <View style={styles.starBars}>
                  <StarRow count={ratingStats.stars_5} stars={5} />
                  <StarRow count={ratingStats.stars_4} stars={4} />
                  <StarRow count={ratingStats.stars_3} stars={3} />
                  <StarRow count={ratingStats.stars_2} stars={2} />
                  <StarRow count={ratingStats.stars_1} stars={1} />
                </View>
              </View>

              {reviews.map((rev) => (
                <View key={rev.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewAvatarText}>{rev.user_initial}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{rev.user_name}</Text>
                      <View style={styles.reviewStars}>
                        {[1,2,3,4,5].map(s => (
                          <Ionicons key={s} name={s <= rev.rating ? 'star' : 'star-outline'} size={12} color="#f59e0b" />
                        ))}
                        {rev.is_verified_purchase && (
                          <Text style={styles.verifiedBadge}> ✓ Verified</Text>
                        )}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>{new Date(rev.created_at).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.reviewComment}>{rev.comment}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Booking Section */}
          <View style={styles.bookingBox}>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Service Fee</Text>
              <Text style={styles.feePrice}>₦{price.toLocaleString()}</Text>
            </View>
            <Text style={styles.inputLabel}>Select Date</Text>
            <TouchableOpacity style={styles.datePicker}>
              <Text style={styles.dateText}>dd/mm/yyyy</Text>
              <Ionicons name="calendar-outline" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Select Time</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, backgroundColor: Colors.white },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, flex: 1, textAlign: 'center' },
  imageSection: { width, height: width * 0.72, backgroundColor: '#f5f5f5', position: 'relative' },
  mainImage: { width, height: width * 0.72 },
  pagination: { position: 'absolute', bottom: 16, width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  activeDot: { backgroundColor: Colors.primary, width: 20 },
  thumbnailRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  thumbnail: { width: 56, height: 56, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  activeThumbnail: { borderColor: Colors.primary },
  infoSection: { padding: 16, paddingTop: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  price: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  originalPrice: { fontSize: 15, color: Colors.textMuted, textDecorationLine: 'line-through' },
  duration: { fontSize: 13, color: Colors.textMuted },
  ratingBar: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  ratingText: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary },
  ratingCount: { fontSize: 13, color: Colors.textMuted },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 10 },
  overviewText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  sellerLogoImg: { width: 48, height: 48 },
  sellerAvatarText: { color: Colors.white, fontWeight: 'bold', fontSize: 18 },
  sellerNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  sellerName: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary },
  sellerLocation: { fontSize: 12, color: Colors.textMuted },
  sellerStats: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 10, padding: 12, marginBottom: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.borderLight },
  viewStoreBtn: { borderWidth: 1, borderColor: Colors.primary, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  viewStoreText: { color: Colors.primary, fontSize: 13, fontWeight: 'bold' },
  // Ratings
  ratingOverview: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  bigRating: { alignItems: 'center', justifyContent: 'center', minWidth: 70 },
  bigRatingNum: { fontSize: 36, fontWeight: 'bold', color: Colors.textPrimary },
  starsRow: { flexDirection: 'row', gap: 2, marginVertical: 4 },
  totalReviews: { fontSize: 11, color: Colors.textMuted },
  starBars: { flex: 1, justifyContent: 'center', gap: 4 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  starLabel: { fontSize: 11, color: Colors.textMuted, width: 18 },
  starBarBg: { flex: 1, height: 6, backgroundColor: '#e2e8f0', borderRadius: 3 },
  starBarFill: { height: 6, backgroundColor: '#f59e0b', borderRadius: 3 },
  starCount: { fontSize: 11, color: Colors.textMuted, width: 16, textAlign: 'right' },
  reviewCard: { paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.borderLight, marginTop: 8 },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  reviewAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  reviewAvatarText: { color: Colors.white, fontWeight: 'bold', fontSize: 14 },
  reviewName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  reviewStars: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  verifiedBadge: { fontSize: 10, color: Colors.success, fontWeight: '600' },
  reviewDate: { fontSize: 11, color: Colors.textMuted },
  reviewComment: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  // Booking
  bookingBox: { padding: 16, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 16, backgroundColor: Colors.white, marginBottom: 24 },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, paddingBottom: 14 },
  feeLabel: { fontSize: 15, color: Colors.textMuted, fontWeight: '600' },
  feePrice: { fontSize: 22, fontWeight: 'bold', color: Colors.primary },
  inputLabel: { fontSize: 13, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  datePicker: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 46, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8, paddingHorizontal: 14, marginBottom: 16 },
  dateText: { color: Colors.textMuted, fontSize: 14 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  timeSlot: { width: '31%', height: 38, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 8 },
  timeText: { color: Colors.textPrimary, fontSize: 12 },
  reserveBtn: { backgroundColor: Colors.primary, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  reserveText: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
  reserveNote: { textAlign: 'center', fontSize: 11, color: Colors.textMuted },
});
