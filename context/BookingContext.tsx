import { Bus } from '@/mock/buses';
import { BookingStorage, StoredBooking } from '@/services/BookingStorage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type BookingSearch = {
  from: string;
  to: string;
  date: string; // ISO date
  passengers: number;
  category: string | null;
};

export type BookingSelection = {
  bus: Bus;
  time: string;
};

export type BookingContact = {
  name: string;
  phone: string;
  notes?: string;
};

export type BookingRecord = {
  id: string;
  search: BookingSearch;
  selection: BookingSelection;
  contact: BookingContact;
  status: 'Confirmed';
};

type BookingContextType = {
  search: BookingSearch | null;
  setSearch: (s: BookingSearch) => void;
  selection: BookingSelection | null;
  setSelection: (sel: BookingSelection) => void;
  contact: BookingContact | null;
  setContact: (c: BookingContact) => void;
  confirmPayment: () => Promise<BookingRecord | null>;
  reset: () => void;
  bookings: StoredBooking[];
  loadBookings: () => Promise<void>;
  updateBookingStatus: (bookingId: string, status: StoredBooking['status']) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;
  isLoading: boolean;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState<BookingSearch | null>(null);
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [contact, setContact] = useState<BookingContact | null>(null);
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load bookings on app start
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const storedBookings = await BookingStorage.getAllBookings();
      setBookings(storedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSearch(null);
    setSelection(null);
    setContact(null);
  };

  const confirmPayment = async (): Promise<BookingRecord | null> => {
    if (!search || !selection || !contact) return null;
    
    try {
      const bookingId = BookingStorage.generateBookingId();
      const totalPrice = selection.bus.pricePerHour * search.passengers;
      
      const storedBooking: StoredBooking = {
        id: bookingId,
        busId: selection.bus.id,
        busName: selection.bus.name,
        agencyName: selection.bus.agencyId, // You might want to get the actual agency name
        from: search.from,
        to: search.to,
        date: search.date,
        passengers: search.passengers,
        selectedTime: selection.time,
        contactName: contact.name,
        contactPhone: contact.phone,
        notes: contact.notes,
        totalPrice,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };

      await BookingStorage.saveBooking(storedBooking);
      await loadBookings(); // Reload bookings to show the new one
      
      reset();
      
      return {
        id: bookingId,
        search,
        selection,
        contact,
        status: 'Confirmed',
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return null;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: StoredBooking['status']) => {
    try {
      await BookingStorage.updateBookingStatus(bookingId, status);
      await loadBookings(); // Reload bookings to reflect the change
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      await BookingStorage.deleteBooking(bookingId);
      await loadBookings(); // Reload bookings to reflect the change
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const value = useMemo<BookingContextType>(
    () => ({ 
      search, 
      setSearch, 
      selection, 
      setSelection, 
      contact, 
      setContact, 
      confirmPayment, 
      reset, 
      bookings,
      loadBookings,
      updateBookingStatus,
      deleteBooking,
      isLoading
    }),
    [search, selection, contact, bookings, isLoading]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}


