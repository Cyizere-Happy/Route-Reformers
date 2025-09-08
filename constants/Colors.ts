/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const brandBlue = '#175484';

export const Colors = {
  light: {
    text: '#0B1220',
    background: '#FFFFFF',
    card: '#FFFFFF',
    tint: brandBlue,
    icon: '#425C7F',
    tabIconDefault: '#94A3B8',
    tabIconSelected: brandBlue,

    // Semantic tokens used across the app
    primary: brandBlue,
    surface: '#FFFFFF',
    surfaceMuted: '#F3F5F8',
    surfaceAlt: '#E8F0F8',
    mutedText: '#6B7280',
    placeholder: '#9CA3AF',
    border: '#E5E7EB',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
  },
  dark: {
    text: '#F0F4F8',
    background: '#1B2A38',
    card: '#243647',
    tint: brandBlue,
    icon: '#B6C2CE',
    tabIconDefault: '#7A8694',
    tabIconSelected: brandBlue,

    // Semantic tokens used across the app
    primary: brandBlue,
    surface: '#243647',
    surfaceMuted: '#2E4458',
    surfaceAlt: '#203243',
    mutedText: '#B6C2CE',
    placeholder: '#94A3B8',
    border: '#334155',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
  },
};


