import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { BookingProvider } from '@/context/BookingContext';
import { ThemePreferenceProvider, useThemePreference } from '@/context/ThemePreference';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const systemScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemePreferenceProvider>
      <BookingProvider>
        <AppThemeRoot systemScheme={systemScheme} />
      </BookingProvider>
    </ThemePreferenceProvider>
  );
}

function AppThemeRoot({ systemScheme }: { systemScheme: 'light' | 'dark' | null | undefined }) {
  const { theme } = useThemePreference();
  const active = theme ?? systemScheme ?? 'light';
  
  return (
    <ThemeProvider value={active === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        initialRouteName="launch"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Initial Launch Screen */}
        <Stack.Screen name="launch" />
        
        {/* Onboarding Flow */}
        <Stack.Screen name="(onboarding)" />
        
        {/* Main App Tabs */}
        <Stack.Screen name="(tabs)" />
        
        {/* Booking Flow Screens */}
        <Stack.Screen 
          name="(book)/search" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="(book)/select" 
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="(book)/review" 
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen 
          name="(book)/pay" 
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        
        {/* Agency Details Screen */}
        <Stack.Screen 
          name="agency/[id]" 
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        
        {/* Error Screen */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
