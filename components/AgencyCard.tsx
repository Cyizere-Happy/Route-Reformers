import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

type Agency = {
  id: string;
  name: string;
  city: string;
  pricePerHour: number;
  rating: number;
  category: string;
  image: any;
};

export default function AgencyCard({ agency, compact }: { agency: Agency; compact?: boolean }) {
  const primary = useThemeColor({}, 'tint');
  const cardBg = useThemeColor({}, 'card');
  const mutedText = useThemeColor({}, 'mutedText');
  const CardContent = (
    <View style={[styles.card, { backgroundColor: cardBg }, compact && styles.cardCompact]}> 
      <Image source={agency.image} style={[styles.cardImage, compact && styles.cardImageCompact]} />
      <View style={styles.cardBody}>
        <ThemedText type="defaultSemiBold">{agency.name}</ThemedText>
        <View style={styles.cardRow}>
          <Ionicons name="location" size={14} color={primary} />
          <ThemedText style={[styles.cardMeta, { color: mutedText }]}>Based in {agency.city}, serving nationwide</ThemedText>
        </View>
        <View style={styles.cardFooter}>
          <ThemedText style={[styles.price, { color: primary }]}>${agency.pricePerHour}</ThemedText>
          <ThemedText style={[styles.perHour, { color: mutedText }]}>/hour</ThemedText>
          <View style={{ flex: 1 }} />
          <Ionicons name="star" size={14} color="#F5B400" />
          <ThemedText style={styles.rating}>{agency.rating.toFixed(1)}</ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <Link asChild href={{ pathname: '/agency/[id]', params: { id: agency.id } }}>
      <TouchableOpacity activeOpacity={0.8}>{CardContent}</TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
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


