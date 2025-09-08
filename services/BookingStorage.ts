import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredBooking {
  id: string;
  busId: string;
  busName: string;
  agencyName: string;
  from: string;
  to: string;
  date: string;
  passengers: number;
  selectedTime: string;
  contactName: string;
  contactPhone: string;
  notes?: string;
  totalPrice: number;
  status: 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt: string;
}

const BOOKINGS_KEY = '@route_reformers_bookings';

export class BookingStorage {
  static async getAllBookings(): Promise<StoredBooking[]> {
    try {
      const bookingsJson = await AsyncStorage.getItem(BOOKINGS_KEY);
      return bookingsJson ? JSON.parse(bookingsJson) : [];
    } catch (error) {
      console.error('Error loading bookings:', error);
      return [];
    }
  }

  static async saveBooking(booking: StoredBooking): Promise<void> {
    try {
      const existingBookings = await this.getAllBookings();
      const updatedBookings = [...existingBookings, booking];
      await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
    } catch (error) {
      console.error('Error saving booking:', error);
      throw error;
    }
  }

  static async updateBookingStatus(bookingId: string, status: StoredBooking['status']): Promise<void> {
    try {
      const existingBookings = await this.getAllBookings();
      const updatedBookings = existingBookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      );
      await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  static async deleteBooking(bookingId: string): Promise<void> {
    try {
      const existingBookings = await this.getAllBookings();
      const updatedBookings = existingBookings.filter(booking => booking.id !== bookingId);
      await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  static async clearAllBookings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BOOKINGS_KEY);
    } catch (error) {
      console.error('Error clearing bookings:', error);
      throw error;
    }
  }

  static generateBookingId(): string {
    return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
