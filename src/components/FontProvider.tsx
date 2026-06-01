import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

type Props = {
  children: ReactNode;
};

export function FontProvider({ children }: Props) {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
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
  splash: { flex: 1, backgroundColor: '#F5E9DA' },
});
