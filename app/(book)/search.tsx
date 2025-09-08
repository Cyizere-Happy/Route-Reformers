import { ThemedText } from '@/components/ThemedText';
import { useBooking } from '@/context/BookingContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import agencies from '@/mock/agencies';
import buses from '@/mock/buses';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function BookSearch() {
  const primary = useThemeColor({}, 'primary');
  const surfaceMuted = useThemeColor({}, 'surfaceMuted');
  const placeholder = useThemeColor({}, 'placeholder');
  const card = useThemeColor({}, 'card');
  const muted = useThemeColor({}, 'mutedText');
  const cardBg = useThemeColor({}, 'card');
  const { setSearch } = useBooking();
  const [from, setFrom] = useState('Kigali');
  const [to, setTo] = useState('Musanze');
  const [date, setDate] = useState('2025-08-25');
  const [passengers, setPassengers] = useState('20');
  const [category, setCategory] = useState<string | null>(null);

  const available = useMemo(() => {
    const required = Number(passengers) || 1;
    return buses.filter(b => (!category || b.category === category) && b.seats >= required);
  }, [passengers, category]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/book');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={primary} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>Search Buses</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Where would you like to go?</ThemedText>
        
        <View style={[styles.searchCard, { backgroundColor: cardBg }]}>
          <View style={styles.inputGroup}>
            <RowInput icon="navigate" value={from} onChangeText={setFrom} placeholder="From city" primary={primary} surface={surfaceMuted} placeholderColor={placeholder} />
            <RowInput icon="flag" value={to} onChangeText={setTo} placeholder="To city" primary={primary} surface={surfaceMuted} placeholderColor={placeholder} />
            <RowInput icon="calendar" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" primary={primary} surface={surfaceMuted} placeholderColor={placeholder} />
            <RowInput icon="people" value={passengers} onChangeText={setPassengers} placeholder="Passengers" keyboardType="numeric" primary={primary} surface={surfaceMuted} placeholderColor={placeholder} />
          </View>
        </View>

        <View style={styles.resultsSection}>
          <ThemedText type="subtitle" style={styles.resultsTitle}>Available options ({available.length})</ThemedText>
          <View style={styles.resultsList}>
            {available.map(b => (
              <Link
                key={b.id}
                href={{ pathname: '/(book)/select', params: { id: b.id } }}
                asChild
                onPress={() => setSearch({ from, to, date, passengers: Number(passengers) || 1, category })}
              >
                <Pressable style={[styles.item, { backgroundColor: card }] }>
                  <ThemedText type="defaultSemiBold">{agencies.find(a => a.id === b.agencyId)?.name} • {b.name}</ThemedText>
                  <ThemedText style={{ color: muted }}>{b.seats} seats • ${b.pricePerHour}/hr</ThemedText>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function RowInput(props: { icon: keyof typeof Ionicons.glyphMap; placeholder: string; value: string; onChangeText: (t: string) => void; keyboardType?: any; primary: string; surface: string; placeholderColor: string }) {
  return (
    <View style={[styles.rowInput, { backgroundColor: props.surface }]}>
      <Ionicons name={props.icon} size={16} color={props.primary} />
      <TextInput {...props} style={{ flex: 1, paddingVertical: 6 }} placeholderTextColor={props.placeholderColor} />
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
    padding: 16, 
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  searchCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    gap: 16,
  },
  rowInput: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    borderRadius: 12, 
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  resultsSection: {
    gap: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  resultsList: {
    gap: 12,
  },
  item: { 
    borderRadius: 12, 
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});


