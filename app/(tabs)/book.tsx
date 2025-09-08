import { ThemedText } from '@/components/ThemedText';
import { useBooking } from '@/context/BookingContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import agencies from '@/mock/agencies';
import buses, { Bus } from '@/mock/buses';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function BookTripScreen() {
  const primary = useThemeColor({}, 'primary');
  const surfaceMuted = useThemeColor({}, 'surfaceMuted');
  const surfaceAlt = useThemeColor({}, 'surfaceAlt');
  const placeholder = useThemeColor({}, 'placeholder');
  const cardBg = useThemeColor({}, 'card');
  const muted = useThemeColor({}, 'mutedText');
  const [from, setFrom] = useState('Kigali');
  const [to, setTo] = useState('Musanze');
  const [date, setDate] = useState('2025-08-25');
  const [passengers, setPassengers] = useState('20');
  const [category, setCategory] = useState<string | null>(null);

  const { setSearch } = useBooking();
  const filtered = useMemo(() => {
    const required = Number(passengers) || 1;
    return buses.filter(b => (!category || b.category === category) && b.seats >= required);
  }, [passengers, category]);

  const [quickBus, setQuickBus] = useState<Bus | null>(null);

  const onSchedule = (bus: Bus) => {
    setQuickBus(bus);
  };

  return (
    <View style={{ flex: 1 }}>
    {/* Simple Top Bar (blends into search card) */}
    <View style={{ backgroundColor: '#175484', paddingVertical: 8, paddingHorizontal: 16 }}>
      <ThemedText style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
        Book Your Journey
      </ThemedText>
    </View>

      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* Enhanced Search Form */}
        <View style={[styles.searchCard, { backgroundColor: cardBg }]}>
          <View style={styles.searchHeader}>
            <View style={[styles.searchIcon, { backgroundColor: '#175484' }]}>
              <Ionicons name="search" size={20} color="#fff" />
            </View>
            <ThemedText type="subtitle" style={styles.searchTitle}>Trip Details</ThemedText>
          </View>
          
          <View style={styles.searchForm}>
            <SearchInput 
              icon="location" 
              value={from} 
              onChangeText={setFrom} 
              placeholder="From city" 
              label="From"
            />
            
            <View style={styles.swapContainer}>
              <View style={styles.swapLine} />
              <TouchableOpacity 
                style={[styles.swapButton, { backgroundColor: '#175484' }]}
                onPress={() => {
                  const temp = from;
                  setFrom(to);
                  setTo(temp);
                }}
              >
                <Ionicons name="swap-vertical" size={16} color="#fff" />
              </TouchableOpacity>
              <View style={styles.swapLine} />
            </View>
            
            <SearchInput 
              icon="flag" 
              value={to} 
              onChangeText={setTo} 
              placeholder="To city" 
              label="To"
            />
            
            <View style={styles.row}>
              <SearchInput 
                icon="calendar" 
                value={date} 
                onChangeText={setDate} 
                placeholder="Select date" 
                label="Departure Date"
                style={{ flex: 1 }}
              />
              <SearchInput 
                icon="people" 
                value={passengers} 
                onChangeText={setPassengers} 
                placeholder="Count" 
                label="Passengers"
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>

        {/* Enhanced Category Filter */}
        <View style={styles.categorySection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Bus Categories</ThemedText>
            <ThemedText style={[styles.sectionSubtitle, { color: muted }]}>
              Choose your preferred bus type
            </ThemedText>
          </View>
          <FlatCategoryChips value={category} onChange={setCategory} />
        </View>

        {/* Enhanced Results Section */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <View>
              <ThemedText type="subtitle">Available Buses</ThemedText>
              <ThemedText style={[styles.resultCount, { color: muted }]}>
                {filtered.length} buses found for your route
              </ThemedText>
            </View>
            <View style={[styles.filterBadge, { backgroundColor: '#175484' }]}>
              <Ionicons name="filter" size={16} color="#fff" />
            </View>
          </View>

          <View style={styles.busGrid}>
            {filtered.map((item, index) => (
              <View key={item.id} style={styles.busCardWrapper}>
                <BusCard 
                  bus={item} 
                  onSchedule={() => onSchedule(item)}
                  onSelect={() => {
                    setSearch({ from, to, date, passengers: Number(passengers) || 1, category });
                    router.push(`/(book)/select?id=${item.id}`);
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {quickBus && (
        <QuickBookModal
          bus={quickBus}
          defaults={{ from, to, date, passengers }}
          onClose={() => setQuickBus(null)}
        />
      )}
    </View>
  );
}

function SearchInput({ 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  keyboardType, 
  label,
  style 
}: { 
  icon: keyof typeof Ionicons.glyphMap; 
  placeholder: string; 
  value: string; 
  onChangeText: (t: string) => void; 
  keyboardType?: any; 
  label: string;
  style?: any;
}) {
  const surfaceMuted = useThemeColor({}, 'surfaceMuted');
  const placeholderColor = useThemeColor({}, 'placeholder');
  
  return (
    <View style={[styles.searchInputContainer, style]}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <View style={[styles.searchInput, { backgroundColor: surfaceMuted }]}>
        <View style={[styles.inputIcon, { backgroundColor: '#175484' }]}>
          <Ionicons name={icon} size={18} color="#fff" />
        </View>
        <TextInput 
          value={value} 
          onChangeText={onChangeText} 
          placeholder={placeholder} 
          keyboardType={keyboardType}
          style={styles.textInput} 
          placeholderTextColor={placeholderColor} 
        />
      </View>
    </View>
  );
}

function FlatCategoryChips({ value, onChange }: { value: string | null; onChange: (v: string | null) => void }) {
  const surfaceMuted = useThemeColor({}, 'surfaceMuted');
  const categories: string[] = ['Mini buses', 'Standard Buses', 'Luxury Coaches', 'Tour Buses', 'Shuttles & Vans'];
  
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
      <Pressable 
        onPress={() => onChange(null)} 
        style={[
          styles.chip, 
          value === null ? [styles.chipActive, { backgroundColor: '#175484' }] : { backgroundColor: surfaceMuted }
        ]}
      >
        <ThemedText style={[
          styles.chipText, 
          { color: value === null ? '#fff' : undefined }
        ]}>
          All Types
        </ThemedText>
      </Pressable>
      {categories.map(c => (
        <Pressable 
          key={c} 
          onPress={() => onChange(c)} 
          style={[
            styles.chip, 
            value === c ? [styles.chipActive, { backgroundColor: '#175484' }] : { backgroundColor: surfaceMuted }
          ]}
        >
          <ThemedText style={[
            styles.chipText, 
            { color: value === c ? '#fff' : undefined }
          ]}>
            {c}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function BusCard({ bus, onSchedule, onSelect }: { bus: Bus; onSchedule: () => void; onSelect: () => void }) {
  const agency = agencies.find(a => a.id === bus.agencyId);
  const cardBg = useThemeColor({}, 'card');
  const surfaceAlt = useThemeColor({}, 'surfaceAlt');
  const surfaceMuted = useThemeColor({}, 'surfaceMuted');
  const muted = useThemeColor({}, 'mutedText');
  
  return (
    <TouchableOpacity 
      style={[styles.busCard, { backgroundColor: cardBg }]}
      onPress={onSelect}
      activeOpacity={0.95}
    >
      <View style={styles.busCardHeader}>
        <Image source={bus.image} style={styles.busImage} />
        <View style={[styles.ratingBadge, { backgroundColor: '#175484' }]}>
          <Ionicons name="star" size={12} color="#fff" />
          <ThemedText style={styles.ratingText}>{bus.rating.toFixed(1)}</ThemedText>
        </View>
      </View>
      
      <View style={styles.busContent}>
        <View style={styles.busHeader}>
          <View style={styles.busInfo}>
            <ThemedText type="defaultSemiBold" style={styles.busName}>
              {agency?.name}
            </ThemedText>
            <ThemedText style={[styles.busModel, { color: muted }]}>
              {bus.name}
            </ThemedText>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: surfaceAlt }]}>
            <ThemedText style={[styles.categoryText, { color: '#175484' }]}>
              {bus.category}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.busDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color="#175484" />
            <ThemedText style={styles.detailText}>
              {bus.seats} seats
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#175484" />
            <ThemedText style={styles.detailText}>
              {bus.times.length} trips
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.timeSlots}>
          <ThemedText style={[styles.timeSlotsLabel, { color: muted }]}>Available times:</ThemedText>
          <View style={styles.timeSlotsContainer}>
            {bus.times.slice(0, 4).map(t => (
              <View key={t} style={[styles.timeSlot, { backgroundColor: surfaceMuted }]}>
                <ThemedText style={styles.timeText}>{t}</ThemedText>
              </View>
            ))}
            {bus.times.length > 4 && (
              <View style={[styles.timeSlot, { backgroundColor: '#175484' }]}>
                <ThemedText style={[styles.timeText, { color: '#fff' }]}>
                  +{bus.times.length - 4}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.busFooter}>
          <View style={styles.priceContainer}>
            <ThemedText style={[styles.price, { color: '#175484' }]}>
              ${bus.pricePerHour}
            </ThemedText>
            <ThemedText style={[styles.priceUnit, { color: muted }]}>
              per hour
            </ThemedText>
          </View>
          
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              onSchedule();
            }} 
            style={[styles.bookButton, { backgroundColor: '#175484' }]}
          >
            <ThemedText style={styles.bookButtonText}>Book Now</ThemedText>
            <Ionicons name="arrow-forward" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function QuickBookModal({ bus, defaults, onClose }: { bus: Bus; defaults: { from: string; to: string; date: string; passengers: string }; onClose: () => void }) {
  const { setSearch } = useBooking();
  const surface = useThemeColor({}, 'surface');
  const surfaceMuted = useThemeColor({}, 'surfaceMuted');
  const muted = useThemeColor({}, 'mutedText');

  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);
  const [date, setDate] = useState(defaults.date);
  const [passengers, setPassengers] = useState(defaults.passengers);

  const handleContinue = () => {
    setSearch({ from, to, date, passengers: Number(passengers) || 1, category: null });
    onClose();
    router.push(`/(book)/select?id=${bus.id}`);
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: surface }]}>
          <View style={styles.modalHeader}>
            <View>
              <ThemedText type="subtitle">Quick Booking</ThemedText>
              <ThemedText style={[styles.modalSubtitle, { color: muted }]}>
                Complete your booking details
              </ThemedText>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={muted} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalBusInfo}>
            <Image source={bus.image} style={styles.modalBusImage} />
            <View style={styles.modalBusDetails}>
              <ThemedText type="defaultSemiBold">
                {agencies.find(a => a.id === bus.agencyId)?.name}
              </ThemedText>
              <ThemedText style={{ color: muted }}>{bus.name}</ThemedText>
              <View style={styles.modalBusRating}>
                <Ionicons name="star" size={14} color="#F5B400" />
                <ThemedText style={styles.modalRatingText}>{bus.rating.toFixed(1)}</ThemedText>
              </View>
            </View>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold" style={styles.modalSectionTitle}>Trip Details</ThemedText>
              <View style={styles.modalInputs}>
                <TextInput 
                  style={[styles.modalInput, { backgroundColor: surfaceMuted }]} 
                  value={from} 
                  onChangeText={setFrom} 
                  placeholder="From city" 
                />
                <TextInput 
                  style={[styles.modalInput, { backgroundColor: surfaceMuted }]} 
                  value={to} 
                  onChangeText={setTo} 
                  placeholder="To city" 
                />
                <TextInput 
                  style={[styles.modalInput, { backgroundColor: surfaceMuted }]} 
                  value={date} 
                  onChangeText={setDate} 
                  placeholder="Date" 
                />
                <TextInput 
                  style={[styles.modalInput, { backgroundColor: surfaceMuted }]} 
                  value={passengers} 
                  onChangeText={setPassengers} 
                  placeholder="Passengers" 
                  keyboardType="numeric" 
                />
              </View>
            </View>

            <View style={styles.modalSection}>
              <ThemedText type="defaultSemiBold" style={styles.modalSectionTitle}>Available Times</ThemedText>
              <View style={styles.modalTimeSlots}>
                {bus.times.map(t => (
                  <TouchableOpacity key={t} style={[styles.modalTimeSlot, { backgroundColor: surfaceMuted }]}>
                    <ThemedText style={styles.modalTimeText}>{t}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onClose} style={[styles.modalCancelBtn, { backgroundColor: surfaceMuted }]}>
              <ThemedText style={{ color: muted, fontWeight: '600' }}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleContinue} 
              style={[styles.modalConfirmBtn, { backgroundColor: '#175484' }]}
            >
              <ThemedText style={styles.modalConfirmText}>
                Continue to Book
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  
  // Header Styles
  header: { 
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: { 
    color: '#fff', 
    opacity: 0.9, 
    fontSize: 14,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Search Card Styles
  searchCard: { 
    marginHorizontal: 16, 
    marginTop: -30,
    borderRadius: 20, 
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  searchIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTitle: { 
    fontSize: 18,
    fontWeight: '600',
  },
  searchForm: { 
    gap: 16,
  },
  row: { 
    flexDirection: 'row', 
    gap: 12,
  },
  
  // Input Styles
  searchInputContainer: { 
    gap: 8,
  },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginLeft: 4,
    color: '#374151',
  },
  searchInput: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  inputIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: { 
    flex: 1, 
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Swap Button Styles
  swapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  swapLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  
  // Category Section Styles
  categorySection: { 
    paddingHorizontal: 16, 
    marginTop: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  chipsContainer: { 
    gap: 10,
    paddingHorizontal: 4,
  },
  chip: { 
    paddingVertical: 10, 
    paddingHorizontal: 18, 
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  chipActive: {
    shadowColor: '#175484',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chipText: { 
    fontSize: 14, 
    fontWeight: '600',
  },
  
  // Results Section Styles
  resultsSection: { 
    paddingHorizontal: 16,
    flex: 1,
  },
  resultsHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  resultCount: { 
    fontSize: 14,
    marginTop: 4,
  },
  filterBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Bus Grid Styles
  busGrid: {
    gap: 16,
  },
  busCardWrapper: {
    marginBottom: 8,
  },
  
  // Bus Card Styles
  busCard: { 
    borderRadius: 20, 
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  busCardHeader: {
    position: 'relative',
    marginBottom: 16,
  },
  busImage: { 
    width: '100%',
    height: 120, 
    borderRadius: 16,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  busContent: { 
    gap: 12,
  },
  busHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
  },
  busInfo: {
    flex: 1,
  },
  busName: { 
    fontSize: 18,
    marginBottom: 4,
  },
  busModel: { 
    fontSize: 14,
  },
  categoryBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16,
  },
  categoryText: { 
    fontSize: 12, 
    fontWeight: '600',
  },
  busDetails: { 
    flexDirection: 'row', 
    gap: 20,
  },
  detailItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
  },
  detailText: { 
    fontSize: 14,
    fontWeight: '500',
  },
  timeSlots: {
    gap: 8,
  },
  timeSlotsLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  timeSlotsContainer: { 
    flexDirection: 'row', 
    gap: 8,
    flexWrap: 'wrap',
  },
  timeSlot: { 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 12,
  },
  timeText: { 
    fontSize: 12, 
    fontWeight: '600',
  },
  busFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  priceContainer: { 
    flexDirection: 'row', 
    alignItems: 'baseline',
    gap: 4,
  },
  price: { 
    fontSize: 22, 
    fontWeight: '800',
  },
  priceUnit: { 
    fontSize: 14,
    fontWeight: '500',
  },
  bookButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 24,
  },
  bookButtonText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 14,
  },
  
  // Modal Styles
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'flex-end',
  },
  modalCard: { 
    borderTopLeftRadius: 28, 
    borderTopRightRadius: 28, 
    paddingTop: 24, 
    maxHeight: '92%',
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    paddingHorizontal: 24, 
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  modalBusInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16, 
    paddingHorizontal: 24, 
    marginBottom: 24,
  },
  modalBusImage: { 
    width: 80, 
    height: 60, 
    borderRadius: 12,
  },
  modalBusDetails: {
    flex: 1,
  },
  modalBusRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  modalRatingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: { 
    paddingHorizontal: 24,
  },
  modalSection: { 
    marginBottom: 28,
  },
  modalSectionTitle: { 
    marginBottom: 16,
    fontSize: 16,
  },
  modalInputs: { 
    gap: 14,
  },
  modalInput: { 
    borderRadius: 16, 
    paddingHorizontal: 20, 
    height: 52, 
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTimeSlots: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10,
  },
  modalTimeSlot: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20,
  },
  modalTimeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalActions: { 
    flexDirection: 'row', 
    gap: 12, 
    paddingHorizontal: 24, 
    paddingVertical: 24, 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalCancelBtn: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 16, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalConfirmBtn: { 
    flex: 2, 
    paddingVertical: 14, 
    borderRadius: 16, 
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Scroll Content Styles
  scrollContent: { 
    flex: 1,
  },
  scrollContentContainer: { 
    paddingBottom: 32,
  },
});