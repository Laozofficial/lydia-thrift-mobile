import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ApiError, formatFieldErrors } from '../../api/errors';
import { AuthShell } from '../../components/AuthShell';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { fonts, typography } from '../../theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(formatFieldErrors(err.errors) || err.message);
      } else {
        setError('Could not sign in. Check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell badges={['Thrift plans', 'Pay weekly or monthly']}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to browse products and manage your thrift plans.</Text>

      <View style={styles.form}>
        <TextField
          label="Email address"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Password"
          secureTextEntry
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Sign in" tone="onSurface" loading={isSubmitting} onPress={handleSubmit} />
        <Pressable onPress={() => navigation.navigate('Register')} style={styles.linkWrap}>
          <Text style={styles.link}>
            New here? <Text style={styles.linkBold}>Create an account</Text>
          </Text>
        </Pressable>
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.display,
    fontSize: colors.font.xl,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    fontSize: colors.font.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  form: { gap: 4 },
  error: { fontFamily: fonts.medium, color: colors.error, marginBottom: 8, fontSize: 13, textAlign: 'center' },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  link: { fontFamily: fonts.regular, color: colors.textSecondary, fontSize: colors.font.sm },
  linkBold: { fontFamily: fonts.bold, color: colors.accent },
});
