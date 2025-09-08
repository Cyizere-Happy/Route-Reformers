import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

type Notice = {
  id: string;
  section: 'Trips & Booking' | 'Promotions & updates' | 'Account & Security';
  title: string;
  body: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  time: string;
  isRead: boolean;
};

const DATA: Notice[] = [
  { 
    id: 'n1', 
    section: 'Trips & Booking', 
    title: 'Booking confirmation', 
    body: 'Your bus for the school trip to Kigali on Aug 25 has been successfully booked. Seat numbers: 12–25. Check your itinerary here.', 
    icon: 'checkmark-circle', 
    color: '#10B981',
    time: '2 hours ago',
    isRead: false
  },
  { 
    id: 'n2', 
    section: 'Trips & Booking', 
    title: 'Cancellation Confirmation', 
    body: 'Your booking for the weekend trip to Volcanoes National Park has been cancelled. Refund of $150 will be processed within 3 business days.', 
    icon: 'close-circle', 
    color: '#EF4444',
    time: '1 day ago',
    isRead: true
  },
  { 
    id: 'n3', 
    section: 'Trips & Booking', 
    title: 'Trip reminder', 
    body: 'Reminder: Your bus to Nyungwe departs tomorrow at 8:00 AM. Don\'t forget to arrive 15 minutes early!', 
    icon: 'time', 
    color: '#3B82F6',
    time: '3 hours ago',
    isRead: false
  },
  { 
    id: 'n4', 
    section: 'Promotions & updates', 
    title: 'Loyalty Reward', 
    body: "Congratulations! You've booked over 20 trips with RouteReformers. Use code SAVE20 to get 20% off your next group trip.", 
    icon: 'gift', 
    color: '#F59E0B',
    time: '2 days ago',
    isRead: true
  },
  { 
    id: 'n5', 
    section: 'Promotions & updates', 
    title: 'New Feature Updates', 
    body: 'Track your bus live and communicate with the driver. Get real-time updates and share instructions instantly.', 
    icon: 'sparkles', 
    color: '#8B5CF6',
    time: '1 week ago',
    isRead: true
  },
  { 
    id: 'n6', 
    section: 'Account & Security', 
    title: 'Password Change / Reset', 
    body: 'Your password was successfully updated. If you didn\'t request this, please contact support immediately.', 
    icon: 'key', 
    color: '#6B7280',
    time: '3 days ago',
    isRead: true
  },
  { 
    id: 'n7', 
    section: 'Account & Security', 
    title: 'Login Alert', 
    body: 'New login detected from Chrome on Windows in Kigali. If this wasn\'t you, secure your account immediately.', 
    icon: 'alert-circle', 
    color: '#F59E0B',
    time: '5 hours ago',
    isRead: false
  },
];

const sections = ['Trips & Booking', 'Promotions & updates', 'Account & Security'] as const;

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notice[]>(DATA);
  const primary = useThemeColor({}, 'primary');
  const cardBg = useThemeColor({}, 'card');
  const surfaceMuted = useThemeColor({}, 'surfaceMuted');
  const muted = useThemeColor({}, 'mutedText');
  const border = useThemeColor({}, 'border');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'Trips & Booking': return 'bus';
      case 'Promotions & updates': return 'megaphone';
      case 'Account & Security': return 'shield-checkmark';
      default: return 'notifications';
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'Trips & Booking': return '#3B82F6';
      case 'Promotions & updates': return '#F59E0B';
      case 'Account & Security': return '#10B981';
      default: return primary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <View style={styles.headerContent}>
          <View>
            <ThemedText type="title" style={styles.headerTitle}>Notifications</ThemedText>
            <ThemedText style={[styles.headerSubtitle, { color: muted }]}>
              {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
            </ThemedText>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
              <ThemedText style={[styles.markAllText, { color: primary }]}>Mark all read</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={sections}
        keyExtractor={(s) => s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item: section }) => {
          const sectionNotifications = notifications.filter(n => n.section === section);
          const sectionColor = getSectionColor(section);
          
          return (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: `${sectionColor}15` }]}>
                  <Ionicons name={getSectionIcon(section) as any} size={16} color={sectionColor} />
                </View>
                <ThemedText type="subtitle" style={styles.sectionTitle}>{section}</ThemedText>
                <View style={styles.sectionCount}>
                  <ThemedText style={[styles.countText, { color: muted }]}>
                    {sectionNotifications.length}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.notificationsList}>
                {sectionNotifications.map(n => (
                  <TouchableOpacity
                    key={n.id}
                    style={[
                      styles.notificationCard,
                      { 
                        backgroundColor: cardBg,
                        borderLeftColor: n.isRead ? 'transparent' : n.color,
                        borderLeftWidth: n.isRead ? 0 : 4,
                      }
                    ]}
                    onPress={() => markAsRead(n.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notificationContent}>
                      <View style={[styles.iconContainer, { backgroundColor: `${n.color}15` }]}>
                        <Ionicons name={n.icon} size={20} color={n.color} />
                      </View>
                      
                      <View style={styles.notificationText}>
                        <View style={styles.notificationHeader}>
                          <ThemedText type="defaultSemiBold" style={styles.notificationTitle}>
                            {n.title}
                          </ThemedText>
                          {!n.isRead && <View style={[styles.unreadDot, { backgroundColor: n.color }]} />}
                        </View>
                        <ThemedText style={[styles.notificationBody, { color: muted }]}>
                          {n.body}
                        </ThemedText>
                        <ThemedText style={[styles.notificationTime, { color: muted }]}>
                          {n.time}
                        </ThemedText>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(23, 84, 132, 0.1)',
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  sectionCount: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    flex: 1,
    gap: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '500',
  },
});
