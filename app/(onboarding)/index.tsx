import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

type Slide = { id: string; title: string; subtitle: string; description: string; image: any };

const slides: Slide[] = [
  {
    id: '1',
    title: 'Quick and Reliable',
    subtitle: 'Group Travel',
    description:
      'Booking a bus for your group has never been easier. Whether it’s a school trip, a wedding, or a company retreat — we’ve got you covered.',
    image: require('@/assets/images/RouteReformers.png'),
  },
  {
    id: '2',
    title: 'Welcome to',
    subtitle: 'RouteReformers!',
    description:
      'where group travel meets simplicity — turning a stressful process into an easy, reliable, and enjoyable experience for everyone.',
    image: require('@/assets/images/Quick board.png'),
  },
  {
    id: '3',
    title: 'Effortless',
    subtitle: 'Payment',
    description:
      'We make paying for your group trip simple and secure. No long forms — just a smooth process so you can focus on planning the journey.',
    image: require('@/assets/images/effotless payment.jpg'),
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const ref = useRef<FlatList<Slide>>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const primary = useThemeColor({}, 'primary');
  const surface = useThemeColor({}, 'surface');

  useEffect(() => {
    if (showIntro) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(() => setShowIntro(false), 2500);
      });
    }
  }, [showIntro]);

  const goNext = () => {
    if (index < slides.length - 1) {
      const nextIndex = index + 1;
      ref.current?.scrollToIndex({ index: nextIndex, animated: true });
      setIndex(nextIndex); // update immediately
    } else {
      router.replace('/(tabs)');
    }
  };

  if (showIntro) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#175484' }]}>
        <Animated.Text
          style={{
            fontSize: 40,
            fontWeight: 'bold',
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          🚍
        </Animated.Text>

        <Animated.Text
          style={{
            fontSize: 28,
            fontWeight: '600',
            marginTop: 20,
            color: 'white',
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          RouteReformers 
        </Animated.Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={slides}
        keyExtractor={(i) => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <TouchableOpacity style={styles.skip} onPress={() => router.replace('/(tabs)')}>
              <ThemedText type="defaultSemiBold" style={{ color: primary }}>
                Skip
              </ThemedText>
            </TouchableOpacity>
            <Image source={item.image} style={styles.illustration} />
            <View style={styles.textBlock}>
              <ThemedText type="title">{item.title}</ThemedText>
              <ThemedText type="link" style={{ color: primary }}>
                {item.subtitle}
              </ThemedText>
              <ThemedText style={{ textAlign: 'center' }}>{item.description}</ThemedText>
              <View style={styles.dots}>
                {slides.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, i === index && [styles.dotActive, { backgroundColor: primary }]]}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: surface, borderColor: primary }]}
        onPress={goNext}
      >
        {index === slides.length - 1 ? (
          <ThemedText type="defaultSemiBold" style={{ color: primary }}>
            Done
          </ThemedText>
        ) : (
          <Ionicons name="arrow-forward" size={20} color={primary} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  slide: { flex: 1 },
  skip: { position: 'absolute', right: 16, top: 16, zIndex: 10 },
  illustration: { width: '100%', height: 280, resizeMode: 'contain', marginTop: 24 },
  textBlock: { paddingHorizontal: 20, paddingTop: 8, alignItems: 'center', gap: 8 },
  dots: { flexDirection: 'row', gap: 6, marginTop: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ccc' },
  dotActive: {},
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
