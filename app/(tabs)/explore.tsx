import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ExplorePlaceholder() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Explore</ThemedText>
      <ThemedText>
        This tab is reserved for future discovery features. Use the Home tab to view agencies.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
});
