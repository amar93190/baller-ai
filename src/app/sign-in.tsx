import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/ActionButton';
import { Bolt } from '@/components/Bolt';
import { Card, Display, Eyebrow, Field, T, TopBar, useAccent } from '@/components/ui';
import { useSession } from '@/store/session';
import { colors, radius } from '@/theme';

/** Connexion avec e-mail et mot de passe. */
export default function SignIn() {
  const insets = useSafeAreaInsets();
  const { signIn } = useSession();
  const { accent } = useAccent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    const r = await signIn(email, password);
    setBusy(false);
    if (!r.ok) setError(r.error);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.inner, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <TopBar onBack={() => router.back()} />
        <View style={styles.head}>
          <View style={{ flex: 1, gap: 4 }}>
            <Eyebrow color={colors.orange}>Connexion</Eyebrow>
            <Display style={{ fontSize: 40 }}>
              Content de te <Display style={{ fontSize: 40, color: accent }}>revoir</Display>
            </Display>
            <T style={styles.sub}>Connecte-toi pour retrouver ta progression.</T>
          </View>
          <Bolt mood="hype" size={72} />
        </View>

        <Card style={{ gap: 16 }}>
          <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="toi@exemple.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" autoComplete="email" returnKeyType="next" />
          <Field label="Mot de passe" value={password} onChangeText={setPassword} placeholder="Ton mot de passe" secure textContentType="password" autoComplete="current-password" returnKeyType="done" onSubmitEditing={submit} />
          <Pressable onPress={() => router.push('/forgot-password')} hitSlop={8} style={{ alignSelf: 'flex-end' }}>
            <T weight="semibold" style={{ fontSize: 13, color: accent }}>
              Mot de passe oublié ?
            </T>
          </Pressable>
          {!!error && (
            <View style={styles.error}>
              <T style={{ color: colors.danger, fontSize: 13 }}>{error}</T>
            </View>
          )}
          <ActionButton label={busy ? 'Connexion…' : 'Se connecter'} icon={busy ? undefined : 'arrow'} onPress={submit} disabled={busy} />
        </Card>

        <Pressable onPress={() => router.replace('/sign-up')} style={styles.switch} hitSlop={8}>
          <T style={{ color: colors.muted }}>
            Pas encore de compte ?{' '}
            <T weight="semibold" style={{ color: accent }}>
              Créer un compte
            </T>
          </T>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  inner: { paddingHorizontal: 22, gap: 20, flexGrow: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  sub: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  error: { backgroundColor: colors.dangerSoft, borderRadius: radius.chip, padding: 12 },
  switch: { alignSelf: 'center', marginTop: 'auto', paddingVertical: 8 },
});
