import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { ActionButton } from '@/components/ActionButton';
import { Bolt } from '@/components/Bolt';
import { Card, Display, Eyebrow, Field, T, TopBar, useAccent } from '@/components/ui';
import { validateSignUp } from '@/lib/auth';
import { useSession } from '@/store/session';
import { colors, radius } from '@/theme';

/** Inscription : prénom, e-mail, mot de passe. Le reste du profil vient juste après. */
export default function SignUp() {
  const insets = useSafeAreaInsets();
  const { signUp } = useSession();
  const { accent } = useAccent();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const submit = async () => {
    const invalid = validateSignUp(name, email, password);
    if (invalid) return setError(invalid);
    setBusy(true);
    setError(null);
    const r = await signUp(name, email, password);
    setBusy(false);
    if (!r.ok) setError(r.error);
    else if (r.value === 'confirm-email') setConfirm(true);
    // Sinon, la session est ouverte : l'app redirige toute seule vers la suite de l'inscription.
  };

  if (confirm) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 8, paddingHorizontal: 22 }]}>
        <TopBar onBack={() => router.back()} />
        <View style={styles.center}>
          <View>
            <Bolt mood="wow" size={110} />
            <View style={styles.mailBadge}>
              <Icon name="mail" size={20} color={colors.white} />
            </View>
          </View>
          <Display style={{ fontSize: 32, textAlign: 'center' }}>Vérifie tes e-mails</Display>
          <T style={styles.sub}>Un lien de confirmation a été envoyé à {email.trim()}. Ouvre-le, puis reviens te connecter.</T>
          <ActionButton label="Se connecter" icon="arrow" onPress={() => router.replace('/sign-in')} style={{ alignSelf: 'stretch', marginTop: 10 }} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.inner, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <TopBar onBack={() => router.back()} />
        <View style={{ gap: 4, marginTop: 8 }}>
          <Eyebrow color={colors.orange}>Inscription · 30 secondes</Eyebrow>
          <Display style={{ fontSize: 40 }}>
            Crée ton <Display style={{ fontSize: 40, color: accent }}>compte</Display>
          </Display>
          <T style={styles.sub}>Tes stats, tes missions et ta progression, sauvegardées et toujours avec toi.</T>
        </View>

        <Card style={{ gap: 16 }}>
          <Field label="Prénom" value={name} onChangeText={setName} placeholder="Ton prénom" autoCapitalize="words" textContentType="givenName" autoComplete="given-name" maxLength={20} returnKeyType="next" />
          <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="toi@exemple.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" autoComplete="email" returnKeyType="next" />
          <Field label="Mot de passe" value={password} onChangeText={setPassword} placeholder="8 caractères minimum" secure textContentType="newPassword" autoComplete="new-password" returnKeyType="done" onSubmitEditing={submit} />
          {!!error && (
            <View style={styles.error}>
              <T style={{ color: colors.danger, fontSize: 13 }}>{error}</T>
            </View>
          )}
          <ActionButton label={busy ? 'Création…' : 'Créer mon compte'} icon={busy ? undefined : 'arrow'} onPress={submit} disabled={busy} />
        </Card>

        <T style={styles.legal}>
          En créant un compte, tu acceptes les{' '}
          <Link href="/legal/terms" style={styles.link}>
            Conditions d’utilisation
          </Link>{' '}
          et la{' '}
          <Link href="/legal/privacy" style={styles.link}>
            Politique de confidentialité
          </Link>
          .
        </T>

        <Pressable onPress={() => router.replace('/sign-in')} style={styles.switch} hitSlop={8}>
          <T style={{ color: colors.muted }}>
            Déjà un compte ?{' '}
            <T weight="semibold" style={{ color: accent }}>
              Se connecter
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
  sub: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  error: { backgroundColor: colors.dangerSoft, borderRadius: radius.chip, padding: 12 },
  legal: { fontSize: 11.5, lineHeight: 17, color: colors.muted, textAlign: 'center' },
  link: { color: colors.text, textDecorationLine: 'underline' },
  switch: { alignSelf: 'center', marginTop: 'auto', paddingVertical: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingBottom: 80 },
  mailBadge: { position: 'absolute', right: -6, bottom: 6, width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface2, borderWidth: 2, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
});
