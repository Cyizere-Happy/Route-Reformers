import { ThemedText } from '@/components/ThemedText';
import { useThemePreference } from '@/context/ThemePreference';
import React from 'react';
import { Switch, View } from 'react-native';

export default function ThemeToggle() {
  const { theme, toggle } = useThemePreference();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <ThemedText>Dark mode</ThemedText>
      <Switch value={theme === 'dark'} onValueChange={toggle} />
    </View>
  );
}


