import { ThemedText } from '@/components/ThemedText';
import { useBooking } from '@/context/BookingContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import agencies from '@/mock/agencies';
import buses from '@/mock/buses';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SelectBus() {
  const surfaceAlt = useThemeColor({}, 'surfaceAlt');
  const mutedText = useThemeColor({}, 'mutedText');
  const primary = useThemeColor({}, 'primary');
  const cardBg = useThemeColor({}, 'card');
  const { id } = useLocalSearchParams<{ id: string }>();
  const bus = buses.find(b => b.id === id);
  const agency = agencies.find(a => a.id === bus?.agencyId);
  const { setSelection } = useBooking();

  if (!bus) return <View style={styles.container}><ThemedText>Not found</ThemedText></View>;

  const handleBack = () => {
    // Try to go back, if that fails, go to the main book screen
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/book');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelection({ bus, time });
    router.push('/(book)/review');
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={primary} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>Select Bus</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Image source={bus.image} style={styles.image} />
        
        <View style={styles.busInfo}>
          <ThemedText type="title" style={styles.busName}>{agency?.name}</ThemedText>
          <ThemedText style={styles.busDetails}>{bus.name} • {bus.seats} seats</ThemedText>
          <ThemedText style={[styles.price, { color: mutedText }]}>${bus.pricePerHour}/hr</ThemedText>
        </View>

        <View style={styles.timeSection}>
          <ThemedText type="subtitle" style={styles.timeTitle}>Pick a time</ThemedText>
          <View style={styles.timeGrid}>
            {bus.times.map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => handleTimeSelect(t)}
                style={[styles.timePill, { backgroundColor: surfaceAlt }]}
              >
                <ThemedText style={styles.timeText}>{t}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  image: { 
    width: '100%', 
    height: 200, 
    borderRadius: 16,
    marginBottom: 16,
  },
  busInfo: {
    marginBottom: 24,
  },
  busName: {
    fontSize: 24,
    marginBottom: 8,
  },
  busDetails: {
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
  timeSection: {
    flex: 1,
  },
  timeTitle: {
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timePill: { 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
});


