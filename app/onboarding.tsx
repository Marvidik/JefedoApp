import React, { useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  image: any;
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Various Collections Of The Latest Products',
    description:
      'Discover a wide range of top-quality products from trusted vendors across Nigeria and beyond.',
    image: require('../assets/onboarding1.jpg'),
  },
  {
    id: '2',
    title: 'Complete Collection Of Colors And Sizes',
    description:
      'Find exactly what you need with our extensive inventory of colours, sizes, and styles.',
    image: require('../assets/onboarding2.jpg'),
  },
  {
    id: '3',
    title: 'Find The Most Suitable Outfit For You',
    description:
      'Browse curated collections tailored to your taste, budget, and lifestyle.',
    image: require('../assets/onboarding3.jpg'),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem('hasOpenedBefore', 'true');
      router.replace('/(tabs)');
    }
  };

  const goToLogin = async () => {
    await AsyncStorage.setItem('hasOpenedBefore', 'true');
    router.replace('/(auth)/register');
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.slideImage} resizeMode="cover" />
      </View>

      {/* Text Content */}
      <View style={styles.textContent}>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        style={{ flex: 1 }}
      />

      {/* Bottom CTA Section */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, i) => {
            const inputRange = [
              (i - 1) * width,
              i * width,
              (i + 1) * width,
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                    backgroundColor:
                      currentIndex === i ? Colors.primary : Colors.border,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Main CTA Button */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>
            {currentIndex === slides.length - 1
              ? 'Go to Home'
              : 'Next'}
          </Text>
        </TouchableOpacity>

        {/* Create account link */}
        <TouchableOpacity onPress={goToLogin} activeOpacity={0.7} style={styles.loginLink}>
          <Text style={styles.loginText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  slide: {
    width,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  imageContainer: {
    width: '100%',
    height: height * 0.44,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.border,
    marginBottom: 28,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  textContent: {
    paddingHorizontal: 4,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  slideDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
    alignItems: 'center',
    gap: 16,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  createBtn: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  createBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loginLink: {
    paddingVertical: 4,
  },
  loginText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
