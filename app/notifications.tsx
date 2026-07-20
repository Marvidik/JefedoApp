import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    title: 'Purchase Completed!',
    body: 'You have successfully purchased 334 headphones, thank you and wait for your package to arrive ✨',
    time: '2 m ago',
    read: false,
    icon: 'cart-outline',
    iconBg: '#e0f2fe',
    iconColor: '#0284c7',
  },
  {
    id: '2',
    type: 'message',
    title: 'Jerremy Send You a Message',
    body: 'hello your package has almost arrived, are you at home now?',
    action: 'Reply the message',
    time: '2 m ago',
    read: false,
    avatar: true,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
  },
  {
    id: '3',
    type: 'promo',
    title: 'Flash Sale! 🔥',
    body: 'Get 20% discount for first transaction in this month! 😍',
    time: '2 m ago',
    read: false,
    icon: 'pricetag-outline',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
  },
  {
    id: '4',
    type: 'order',
    title: 'Package Sent',
    body: 'Hi your package has been sent from new york',
    time: '10 m ago',
    read: true,
    icon: 'cube-outline',
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.notifCard, !item.read && styles.notifCardUnread]}
      onPress={() => markRead(item.id)}
      activeOpacity={0.8}
    >
      {/* Icon / Avatar */}
      <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
        {item.avatar ? (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>J</Text>
          </View>
        ) : (
          <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
        )}
      </View>

      {/* Content */}
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>{item.title}</Text>
        <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
        {item.action && (
          <Text style={styles.notifAction}>{item.action}</Text>
        )}
      </View>

      {/* Time + unread dot */}
      <View style={styles.notifMeta}>
        <Text style={styles.notifTime}>{item.time}</Text>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notification</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/') }>
          <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Unread badge + mark all read */}
      {unreadCount > 0 && (
        <View style={styles.topBar}>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
          </View>
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={<Text style={styles.sectionHead}>Recent</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.textPrimary },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  unreadBadge: { backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  unreadBadgeText: { color: Colors.primary, fontSize: 12, fontWeight: 'bold' },
  markAllText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
  sectionHead: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 12, marginBottom: 8 },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, borderRadius: 12, paddingHorizontal: 4 },
  notifCardUnread: { backgroundColor: '#fef9f9' },
  iconWrap: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginRight: 14, flexShrink: 0 },
  avatarCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Colors.white, fontWeight: 'bold', fontSize: 18 },
  notifContent: { flex: 1, marginRight: 8 },
  notifTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  notifTitleUnread: { fontWeight: 'bold' },
  notifBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  notifAction: { color: Colors.primary, fontSize: 13, fontWeight: '600', marginTop: 6 },
  notifMeta: { alignItems: 'flex-end', gap: 6 },
  notifTime: { fontSize: 11, color: Colors.textMuted },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  separator: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 2 },
});
