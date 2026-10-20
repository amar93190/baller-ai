import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { Display, Eyebrow, Field, T } from '@/components/ui';
import { auth } from '@/lib/auth';
import { colors, radius } from '@/theme';

/** Mot de passe oublié : envoie un lien de réinitialisation par e-mail. */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    const r = await auth.resetPassword(email);
    setBusy(false);
    if (r.ok) setSent(true);
    else setError(r.error);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
      <View>
        <Eyebrow color={colors.orange}>Pas de panique</Eyebrow>
        <Display style={{ fontSize: 30 }}>Mot de passe oublié</Display>
      </View>
      {sent ? (
        <>
          <T style={styles.sub}>C’est envoyé. Si un compte existe pour {email.trim()}, tu vas recevoir un lien pour choisir un nouveau mot de passe.</T>
          <ActionButton label="Retour à la connexion" onPress={() => router.back()} />
        </>
      ) : (
        <>
          <T style={styles.sub}>Entre l’e-mail de ton compte, on t’envoie un lien pour en choisir un nouveau.</T>
          <Field label="E-mail" value={email} onChangeText={setEmail} placeholder="toi@exemple.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" autoComplete="email" onSubmitEditing={submit} />
          {!!error && (
            <View style={styles.error}>
              <T style={{ color: colors.danger, fontSize: 13 }}>{error}</T>
            </View>
          )}
          <ActionButton label={busy ? 'Envoi…' : 'Envoyer le lien'} icon={busy ? undefined : 'mail'} onPress={submit} disabled={busy} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inner: { padding: 22, paddingTop: 28, gap: 16, paddingBottom: 40 },
  sub: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  error: { backgroundColor: colors.dangerSoft, borderRadius: radius.chip, padding: 12 },
});
