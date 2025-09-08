import { router } from 'expo-router';

export const NavigationUtils = {
  // Navigate to booking flow
  goToBooking: (busId?: string) => {
    if (busId) {
      router.push(`/(book)/select?id=${busId}`);
    } else {
      router.push('/(book)/search');
    }
  },

  // Navigate to agency details
  goToAgency: (agencyId: string) => {
    router.push(`/agency/${agencyId}`);
  },

  // Navigate to trips
  goToTrips: () => {
    router.push('/(tabs)/trips');
  },

  // Navigate to home
  goToHome: () => {
    router.push('/(tabs)');
  },

  // Navigate back
  goBack: () => {
    router.back();
  },

  // Replace current screen (useful for after completing flows)
  replace: (route: string) => {
    router.replace(route);
  },

  // Navigate to payment
  goToPayment: () => {
    router.push('/(book)/pay');
  },

  // Navigate to review
  goToReview: () => {
    router.push('/(book)/review');
  },

  // Navigate to onboarding
  goToOnboarding: () => {
    router.replace('/(onboarding)');
  },

  // Navigate to main app
  goToMainApp: () => {
    router.replace('/(tabs)');
  },
};
