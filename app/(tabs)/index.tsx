import { ThemedText } from '@/components/ThemedText';
import ThemeToggle from '@/components/ThemeToggle';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import AgencyCard from '@/components/AgencyCard';
import agencies from '@/mock/agencies';

export default function HomeScreen() {
  const primary = useThemeColor({}, 'primary');
  const surfaceMuted = useThemeColor({}, 'surfaceMuted');
  const placeholder = useThemeColor({}, 'placeholder');
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignSelf: 'flex-end' }}>
        <ThemeToggle />
      </View>
      <View style={styles.locationRow}>
        <Ionicons name="location" size={18} color={primary} />
        <ThemedText type="defaultSemiBold">Kigali, Rwanda</ThemedText>
        <Ionicons name="chevron-down" size={16} color={primary} />
      </View>

      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: surfaceMuted }]}>
          <Ionicons name="search" size={18} color={placeholder} />
          <TextInput placeholder="Search" style={styles.searchInput} placeholderTextColor={placeholder} />
        </View>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: primary }]}>
          <Ionicons name="options" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {['Mini buses','Standard Buses','Luxury Coaches','Tour Buses','Shuttles & Vans'].map((label, idx) => (
          <View key={label} style={styles.categoryItem}>
            <View style={[styles.categoryIcon, { backgroundColor: surfaceMuted }]}>
              <Ionicons name={['bus','bus','bus-outline','bus','car-sport'][idx] as any} size={20} color={primary} />
            </View>
            <ThemedText style={styles.categoryLabel}>{label}</ThemedText>
          </View>
        ))}
      </ScrollView>

      <ThemedText type="subtitle" style={styles.sectionTitle}>Recommended Travel Agencies</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
        {agencies.slice(0, 5).map((a) => (
          <AgencyCard key={a.id} agency={a} />
        ))}
      </ScrollView>

      <ThemedText type="subtitle" style={styles.sectionTitle}>Nearby Travel agencies</ThemedText>
      <View style={{ gap: 12 }}>
        {agencies.map((a) => (
          <AgencyCard key={a.id + '-near'} agency={a} compact />
        ))}
      </View>
    </ScrollView>
  );
}

 

const styles = StyleSheet.create({
  container: { padding: 16, gap: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBox: { flex: 1, borderRadius: 10, paddingHorizontal: 12, height: 40, alignItems: 'center', flexDirection: 'row', gap: 8 },
  searchInput: { flex: 1 },
  filterBtn: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  categories: { gap: 18, paddingVertical: 6 },
  categoryItem: { width: 84, alignItems: 'center' },
  categoryIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  categoryLabel: { textAlign: 'center', fontSize: 12 },
  sectionTitle: { marginTop: 8 },
  cardsRow: { gap: 12 },
  card: { width: 240, borderRadius: 14, overflow: 'hidden' },
  cardCompact: { width: '100%', flexDirection: 'row', alignItems: 'center' },
  cardImage: { width: '100%', height: 120 },
  cardImageCompact: { width: 110, height: 80 },
  cardBody: { padding: 12, gap: 6, flex: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardMeta: { fontSize: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  price: { fontSize: 16, fontWeight: '700' },
  perHour: { fontSize: 12 },
  rating: { marginLeft: 2, fontSize: 12 },
});
