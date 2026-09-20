import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useCart } from '../../context/CartContext';

export default function TabLayout() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const insets = useSafeAreaInsets();
  const bottomOffset = Platform.OS === 'android' ? insets.bottom + 8 : 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { bottom: bottomOffset }],
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
                <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={focused ? Colors.white : color} />
              </View>
              <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>Home</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View style={focused ? styles.activeIconContainer : styles.inactiveIconContainer}>
                <Ionicons name={focused ? 'construct' : 'construct-outline'} size={22} color={focused ? Colors.white : color} />
              </View>
              <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>Services</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View style={[focused ? styles.activeIconContainer : styles.inactiveIconContainer, { position: 'relative' }]}>
                <Ionicons name={focused ? 'cart' : 'cart-outline'} size={22} color={focused ? Colors.white : color} />
                {cartCount > 0 && !focused && (
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>Cart</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Me',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View style={[focused ? styles.activeIconContainer : styles.inactiveIconContainer, { position: 'relative' }]}>
                <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={focused ? Colors.white : color} />
              </View>
              <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>Me</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    elevation: 0,
    backgroundColor: Colors.white,
    borderRadius: 30,
    height: 70,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderTopWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  inactiveIconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
    borderWidth: 3,
    borderColor: Colors.bg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 5,
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '600',
    marginTop: -5,
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
    paddingHorizontal: 2,
  },
  notifBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
});
