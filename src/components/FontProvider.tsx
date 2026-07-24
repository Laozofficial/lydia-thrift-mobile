import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

type Props = {
  children: ReactNode;
};

export function FontProvider({ children }: Props) {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });
  const [ready, setReady] = useState(false);

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
      setReady(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) onLayout();
  }, [fontsLoaded, onLayout]);

  if (!ready) {
    return <View style={styles.splash} onLayout={onLayout} />;
  }

  return children;
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: '#E52059' },
});
