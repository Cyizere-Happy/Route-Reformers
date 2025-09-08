import AgencyCard from '@/components/AgencyCard';
import { ThemedText } from '@/components/ThemedText';
import agencies from '@/mock/agencies';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function AgenciesScreen() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => agencies.filter(a => a.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const surfaceMuted = useThemeColor({}, 'surfaceMuted');
  const placeholder = useThemeColor({}, 'placeholder');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">Agency Info</ThemedText>
      <View style={[styles.searchBox, { backgroundColor: surfaceMuted }]}>
        <Ionicons name="search" size={16} color={placeholder} />
        <TextInput placeholder="Search agencies" value={query} onChangeText={setQuery} style={{ flex: 1, marginLeft: 6 }} placeholderTextColor={placeholder} />
      </View>

      <View style={{ gap: 12 }}>
        {filtered.map(a => (
          <AgencyCard key={a.id} agency={a} compact />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  searchBox: { borderRadius: 10, paddingHorizontal: 12, height: 40, justifyContent: 'center' },
});


