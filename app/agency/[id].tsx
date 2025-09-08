import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import agencies from '@/mock/agencies';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Animated, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AgencyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const agency = agencies.find(a => a.id === id);
  const primary = useThemeColor({}, 'primary');
  const surfaceAlt = useThemeColor({}, 'surfaceAlt');
  const cardBg = useThemeColor({}, 'card');
  const muted = useThemeColor({}, 'mutedText');
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const heroScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  if (!agency) {
    return (
      <View style={styles.container}>
        <ThemedText>Agency not found.</ThemedText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.header, { opacity: headerOpacity, backgroundColor: cardBg }] }>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn}>
          <Ionicons name="chevron-back" size={22} color={primary} />
        </TouchableOpacity>
        <ThemedText type="defaultSemiBold" style={{ color: primary }}>{agency.name}</ThemedText>
        <View style={{ width: 34 }} />
      </Animated.View>

      <Animated.ScrollView 
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.container, { paddingBottom: 24 }] }
      >
        <Animated.View style={[styles.hero, { transform: [{ scale: heroScale }, { translateY: heroTranslateY }] }] }>
          <Image source={agency.image} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <ThemedText type="title" style={{ color: '#fff' }}>{agency.name}</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.ratingPill, { backgroundColor: '#ffffff22' }] }>
                <Ionicons name="star" size={14} color="#F5B400" />
                <ThemedText style={{ color: '#fff' }}>{agency.rating.toFixed(1)}</ThemedText>
              </View>
              <ThemedText style={{ color: '#fff' }}>{agency.category}</ThemedText>
            </View>
          </View>
        </Animated.View>

        <View style={[styles.card, { backgroundColor: cardBg }] }>
          <ThemedText type="subtitle">About</ThemedText>
          <ThemedText style={{ color: muted }}>Based in {agency.city}, serving nationwide</ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg }] }>
          <ThemedText type="subtitle">Amenities</ThemedText>
          <View style={styles.amenities}>
            {['AC','Wi‑Fi','USB','Recliner','TV'].map(a => (
              <View key={a} style={[styles.amenityPill, { backgroundColor: surfaceAlt }]}><ThemedText>{a}</ThemedText></View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg }] }>
          <ThemedText type="subtitle">Gallery</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingTop: 6 }}>
            {[1,2,3,4,5].map((i) => (
              <Image key={i} source={agency.image} style={styles.gallery} />
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: primary }]} onPress={() => router.push('/(tabs)/book')}>
          <ThemedText style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Book this agency</ThemedText>
        </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  headerBackBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)' },
  hero: { height: 200, borderRadius: 12, overflow: 'hidden', marginBottom: 4 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  backBtn: { position: 'absolute', left: 10, top: 10, width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  heroContent: { position: 'absolute', left: 12, bottom: 12 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  primaryBtn: { paddingVertical: 14, borderRadius: 10 },
  card: { borderRadius: 12, padding: 12, gap: 8 },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  gallery: { width: 140, height: 90, borderRadius: 8 },
});


