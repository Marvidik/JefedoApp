import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/accountService';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { AppNotification } from '../services/types';

export default function NotificationsScreen() {
  useRequireAuth();
  
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      setNotifications(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const getIconData = (type: string) => {
    switch(type) {
      case 'order': return { icon: 'cube-outline', bg: '#f3e8ff', color: '#9333ea' };
      case 'promo': return { icon: 'pricetag-outline', bg: '#fce7f3', color: '#db2777' };
      case 'alert': return { icon: 'warning-outline', bg: '#fef3c7', color: '#d97706' };
      default: return { icon: 'notifications-outline', bg: '#e0f2fe', color: '#0284c7' };
    }
  };

  const renderItem = ({ item }: { item: AppNotification }) => {
    const { icon, bg, color } = getIconData(item.notification_type || '');
    
    return (
      <TouchableOpacity
        style={[styles.notifCard, !item.is_read && styles.notifCardUnread]}
        onPress={() => !item.is_read && handleMarkRead(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconWrap, { backgroundColor: bg }]}>
          <Ionicons name={icon as any} size={22} color={color} />
        </View>

        <View style={styles.notifContent}>
          <Text style={[styles.notifTitle, !item.is_read && styles.notifTitleUnread]}>{item.title}</Text>
          <Text style={styles.notifBody} numberOfLines={2}>{item.message}</Text>
        </View>

        <View style={styles.notifMeta}>
          <Text style={styles.notifTime}>{new Date(item.created_at).toLocaleDateString()}</Text>
          {!item.is_read && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* Unread badge + mark all read */}
      {unreadCount > 0 && (
        <View style={styles.topBar}>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
          </View>
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: Colors.textMuted, marginTop: 20 }}>No notifications.</Text>}
        />
      )}
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
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, borderRadius: 12, paddingHorizontal: 4 },
  notifCardUnread: { backgroundColor: '#fef9f9' },
  iconWrap: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginRight: 14, flexShrink: 0 },
  notifContent: { flex: 1, marginRight: 8 },
  notifTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  notifTitleUnread: { fontWeight: 'bold' },
  notifBody: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  notifMeta: { alignItems: 'flex-end', gap: 6 },
  notifTime: { fontSize: 11, color: Colors.textMuted },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  separator: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 2 },
});
