import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LaunchScreen() {
  const primary = useThemeColor({}, 'primary');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textSlideAnim = useRef(new Animated.Value(30)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Bus rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Text animations with delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);

    // Auto navigate after 4 seconds
    const timer = setTimeout(() => {
      router.replace('/(onboarding)');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const handlePress = () => {
    // Add a quick bounce effect when pressed
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate immediately on press
    router.replace('/(onboarding)');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={1}>
      <LinearGradient
        colors={['#175484', '#1a5f9a', '#1f6bb0']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated background elements */}
        <Animated.View style={[styles.floatingCircle, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]} />
        <Animated.View style={[styles.floatingCircle2, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]} />
        <Animated.View style={[styles.floatingCircle3, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]} />

        {/* Main content */}
        <View style={styles.content}>
          {/* Bus emoji with animations */}
          <Animated.View
            style={[
              styles.busContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim },
                  { rotate: rotateInterpolate },
                ],
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.busIcon,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              🚌
            </Animated.Text>
          </Animated.View>

          {/* App name with animations */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textFadeAnim,
                transform: [{ translateY: textSlideAnim }],
              },
            ]}
          >
            <ThemedText style={styles.brand}>RouteReformers</ThemedText>
            <ThemedText style={styles.tagline}>Your Journey, Our Priority</ThemedText>
          </Animated.View>

          {/* Loading indicator */}
          <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
            <View style={styles.loadingDots}>
              <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
              <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
              <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
            </View>
            <ThemedText style={styles.loadingText}>Loading your adventure...</ThemedText>
          </Animated.View>
        </View>

        {/* Tap to continue hint */}
        <Animated.View style={[styles.hintContainer, { opacity: fadeAnim }]}>
          <ThemedText style={styles.hintText}>Tap to continue</ThemedText>
        </Animated.View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: '20%',
    left: '10%',
  },
  floatingCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    top: '60%',
    right: '15%',
  },
  floatingCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    bottom: '30%',
    left: '20%',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  busContainer: {
    marginBottom: 40,
  },
  busIcon: {
    fontSize: 120,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  brand: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
});


