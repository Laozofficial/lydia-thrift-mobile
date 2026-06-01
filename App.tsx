import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FontProvider } from './src/components/FontProvider';

// Required so Paystack redirect (lydiathrift://) closes the in-app browser on Android.
WebBrowser.maybeCompleteAuthSession();
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <FontProvider>
        <AuthProvider>
          <RootNavigator />
          <StatusBar style="dark" />
        </AuthProvider>
      </FontProvider>
    </SafeAreaProvider>
  );
}
