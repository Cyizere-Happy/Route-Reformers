import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: 'Book a Trip',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'My Trips',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="briefcase" color={color} />,
        }}
      />
      <Tabs.Screen
        name="agencies"
        options={{
          title: 'Agencies',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="business" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="notifications" color={color} />,
        }}
      />
      {/* Hide explore screen from tabs since it's just a placeholder */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // This hides the tab
        }}
      />
    </Tabs>
  );
}
