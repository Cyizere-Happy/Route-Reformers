import { ThemedText } from '@/components/ThemedText';
import { useBooking } from '@/context/BookingContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';

export default function ReviewAndContact() {
  const { search, selection, setContact } = useBooking();
  const surfaceMuted = useThemeColor({}, 'surfaceMuted');
  const primary = useThemeColor({}, 'primary');
  const cardBg = useThemeColor({}, 'card');
  const muted = useThemeColor({}, 'mutedText');
  const [name, setName] = useState('Jane Doe');
  const [phone, setPhone] = useState('+250 7xx xxx xxx');
  const [notes, setNotes] = useState('');

  if (!search || !selection) 
    return <View style={styles.container}><ThemedText>Missing booking data</ThemedText></View>;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/book');
    }
  };

  const handleProceed = (method: string) => {
    setContact({ name, phone, notes });
    router.push(`/(book)/pay?method=${method}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={primary} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>Review & Contact</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Trip Summary */}
        <View style={[styles.summaryCard, { backgroundColor: cardBg }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Trip Summary</ThemedText>
          <View style={styles.summaryItem}>
            <Ionicons name="navigate" size={16} color={primary} />
            <ThemedText style={styles.summaryText}>{search.from} → {search.to}</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="calendar" size={16} color={primary} />
            <ThemedText style={styles.summaryText}>{search.date}</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="bus" size={16} color={primary} />
            <ThemedText style={styles.summaryText}>{selection.bus.name} • {selection.time}</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="people" size={16} color={primary} />
            <ThemedText style={styles.summaryText}>{search.passengers} passengers</ThemedText>
          </View>
        </View>

        {/* Contact Information */}
        <View style={[styles.contactCard, { backgroundColor: cardBg }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Contact Information</ThemedText>
          <View style={styles.inputGroup}>
            <TextInput 
              style={[styles.input, { backgroundColor: surfaceMuted }]} 
              value={name} 
              onChangeText={setName} 
              placeholder="Full name" 
            />
            <TextInput 
              style={[styles.input, { backgroundColor: surfaceMuted }]} 
              value={phone} 
              onChangeText={setPhone} 
              placeholder="Phone number" 
              keyboardType="phone-pad"
            />
            <TextInput 
              style={[styles.input, styles.textArea, { backgroundColor: surfaceMuted }]} 
              value={notes} 
              onChangeText={setNotes} 
              placeholder="Additional notes (optional)" 
              multiline 
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Payment Options */}
        <View style={[styles.contactCard, { backgroundColor: cardBg }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Choose Payment Method</ThemedText>

          <TouchableOpacity style={[styles.paymentOption, { backgroundColor: '#FFD700' }]} onPress={() => handleProceed('momo')}>
            <ThemedText style={styles.paymentText}>MTN Momo</ThemedText>
            <Ionicons name="cash" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.paymentOption, { backgroundColor: '#FFA500' }]} onPress={() => handleProceed('airtel')}>
            <ThemedText style={styles.paymentText}>Airtel Money</ThemedText>
            <Ionicons name="cash" size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.paymentOption, { backgroundColor: '#32CD32' }]} onPress={() => handleProceed('card')}>
            <ThemedText style={styles.paymentText}>Debit/Credit Card</ThemedText>
            <Ionicons name="card" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  headerTitle: { fontSize: 18, fontWeight: '600' },
  content: { flex: 1, padding: 16, gap: 20 },
  summaryCard: { borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  contactCard: { borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  sectionTitle: { marginBottom: 16, fontSize: 18, fontWeight: '600' },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  summaryText: { fontSize: 16, flex: 1 },
  inputGroup: { gap: 16 },
  input: { borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: 12 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 12 },
  paymentText: { fontSize: 16, fontWeight: '600' },
});
