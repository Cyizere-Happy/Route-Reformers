import { ThemedText } from '@/components/ThemedText';
import { useBooking } from '@/context/BookingContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function MyTripsScreen() {
  const { bookings, updateBookingStatus, deleteBooking, isLoading } = useBooking();

  const upcomingBookings = bookings.filter(b => b.status === 'Confirmed');
  const pastBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => updateBookingStatus(bookingId, 'Cancelled') }
      ]
    );
  };

  const handleDeleteBooking = (bookingId: string) => {
    Alert.alert(
      'Delete Booking',
      'Are you sure you want to delete this booking? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Delete', style: 'destructive', onPress: () => deleteBooking(bookingId) }
      ]
    );
  };

  const handleCompleteBooking = (bookingId: string) => {
    Alert.alert(
      'Complete Booking',
      'Mark this booking as completed?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Complete', onPress: () => updateBookingStatus(bookingId, 'Completed') }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">My Trips</ThemedText>

      <Section title="Upcoming Trips">
        {upcomingBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={useThemeColor({}, 'mutedText')} />
            <ThemedText style={[styles.emptyText, { color: useThemeColor({}, 'mutedText') }]}>
              No upcoming trips
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: useThemeColor({}, 'mutedText') }]}>
              Book your first trip to see it here
            </ThemedText>
          </View>
        ) : (
          upcomingBookings.map(booking => (
            <TripCard 
              key={booking.id} 
              booking={booking}
              onCancel={() => handleCancelBooking(booking.id)}
              onComplete={() => handleCompleteBooking(booking.id)}
            />
          ))
        )}
      </Section>

      <Section title="Past Trips">
        {pastBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color={useThemeColor({}, 'mutedText')} />
            <ThemedText style={[styles.emptyText, { color: useThemeColor({}, 'mutedText') }]}>
              No past trips
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: useThemeColor({}, 'mutedText') }]}>
              Your completed and cancelled trips will appear here
            </ThemedText>
          </View>
        ) : (
          pastBookings.map(booking => (
            <TripCard 
              key={booking.id} 
              booking={booking}
              onDelete={() => handleDeleteBooking(booking.id)}
            />
          ))
        )}
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 20 }}>
      <ThemedText type="subtitle" style={{ marginBottom: 12 }}>{title}</ThemedText>
      <View style={{ gap: 12 }}>{children}</View>
    </View>
  );
}

function TripCard({ 
  booking, 
  onCancel, 
  onComplete, 
  onDelete 
}: { 
  booking: any; 
  onCancel?: () => void; 
  onComplete?: () => void; 
  onDelete?: () => void; 
}) {
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');
  const muted = useThemeColor({}, 'mutedText');
  const primary = useThemeColor({}, 'primary');
  const cardBg = useThemeColor({}, 'card');
  const surfaceAlt = useThemeColor({}, 'surfaceAlt');
  
  const statusColor = booking.status === 'Confirmed' ? success : 
                     booking.status === 'Cancelled' ? danger : muted;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <ThemedText type="defaultSemiBold">{booking.agencyName}</ThemedText>
        <ThemedText style={[styles.status, { color: statusColor }]}>{booking.status}</ThemedText>
      </View>
      
      <ThemedText style={styles.busName}>{booking.busName}</ThemedText>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
        <Ionicons name="calendar" size={14} color={primary} />
        <ThemedText>{formatDate(booking.date)}</ThemedText>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <Ionicons name="navigate" size={14} color={primary} />
        <ThemedText>{booking.from} → {booking.to}</ThemedText>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <Ionicons name="time" size={14} color={primary} />
        <ThemedText>{booking.selectedTime}</ThemedText>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <Ionicons name="people" size={14} color={primary} />
        <ThemedText>{booking.passengers} passengers</ThemedText>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <Ionicons name="card" size={14} color={primary} />
        <ThemedText style={styles.price}>{formatPrice(booking.totalPrice)}</ThemedText>
      </View>

      {booking.contactName && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <Ionicons name="person" size={14} color={primary} />
          <ThemedText>{booking.contactName}</ThemedText>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        {booking.status === 'Confirmed' && (
          <>
            <TouchableOpacity 
              style={[styles.secondaryBtn, { backgroundColor: surfaceAlt }]}
              onPress={onCancel}
            >
              <ThemedText style={{ color: danger }}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.secondaryBtn, { backgroundColor: surfaceAlt }]}
              onPress={onComplete}
            >
              <ThemedText style={{ color: success }}>Complete</ThemedText>
            </TouchableOpacity>
          </>
        )}
        
        {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
          <TouchableOpacity 
            style={[styles.secondaryBtn, { backgroundColor: surfaceAlt }]}
            onPress={onDelete}
          >
            <ThemedText style={{ color: danger }}>Delete</ThemedText>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: primary }]}>
          <ThemedText style={{ color: '#fff' }}>Rebook</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { borderRadius: 12, padding: 16 },
  status: { fontWeight: '700' },
  busName: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  price: { fontWeight: '600', fontSize: 16 },
  primaryBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  secondaryBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});


