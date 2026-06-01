import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ApiError, formatFieldErrors } from '../../api/errors';
import { AuthShell } from '../../components/AuthShell';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { fonts, typography } from '../../theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(formatFieldErrors(err.errors) || err.message);
      } else {
        setError('Could not create account. Check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell badges={['Free to join', 'Wallet included']}>
      <BackButton onPress={() => navigation.goBack()} />
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>
        Start shopping thrift items on flexible daily, weekly, or monthly plans.
      </Text>

      <TextField label="Full name" placeholder="Jane Doe" value={name} onChangeText={setName} />
      <TextField
        label="Email address"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        label="Password"
        secureTextEntry
        placeholder="Minimum 8 characters"
        hint="Use at least 8 characters."
        value={password}
        onChangeText={setPassword}
      />
      <TextField
        label="Confirm password"
        secureTextEntry
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Create account" loading={isSubmitting} onPress={handleSubmit} />
      <Pressable onPress={() => navigation.navigate('Login')} style={styles.linkWrap}>
        <Text style={styles.link}>
          Already have an account? <Text style={styles.linkBold}>Sign in</Text>
        </Text>
      </Pressable>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.display,
    fontSize: colors.font.xl,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    fontSize: colors.font.sm,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 16,
  },
  error: { fontFamily: fonts.medium, color: colors.error, marginBottom: 8, fontSize: 13 },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  link: { fontFamily: fonts.regular, color: colors.textSecondary, fontSize: colors.font.sm },
  linkBold: { fontFamily: fonts.bold, color: colors.accent },
});
