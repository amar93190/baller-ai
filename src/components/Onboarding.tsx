import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/ActionButton';
import { BoltSays, type Mood } from '@/components/Bolt';
import { Display, Steps } from '@/components/ui';
import { nextStep, ONBOARDING, stepOf, type OnboardingRoute } from '@/lib/profile';
import { usePlayer } from '@/store/player';
import { colors, space } from '@/theme';

type Props = {
  route: OnboardingRoute;
  /** Le titre en deux temps : « Ton  » (espace compris) + « gabarit » en orange. */
  title: [string, string];
  bolt?: { text: string; mood?: Mood };
  children: ReactNode;
  /** Enregistre les valeurs de l'écran. Appelé avant de passer à la suite. */
  onSubmit?: () => void;
  canSubmit?: boolean;
};

/**
 * Cadre commun des étapes d'inscription : étape en chevrons, grand titre, Bolt, puis le bouton.
 * Depuis le profil (compte déjà inscrit), le même écran sert à modifier : il revient en arrière.
 */
export function OnboardingScreen({ route, title, bolt, children, onSubmit, canSubmit = true }: Props) {
  const insets = useSafeAreaInsets();
  const { state } = usePlayer();
  const editing = state.onboarded;
  const first = stepOf(route) === 1;

  const submit = () => {
    onSubmit?.();
    if (editing) router.back();
    else router.push(nextStep(route));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[styles.inner, { paddingTop: insets.top + space.sm, paddingBottom: insets.bottom + space.lg }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Steps step={editing ? undefined : stepOf(route)} total={ONBOARDING.length} onBack={editing || !first ? () => router.back() : undefined} />
        <Display style={{ fontSize: 44 }}>
          {title[0]}
          <Display style={{ fontSize: 44, color: colors.orange }}>{title[1]}</Display>
        </Display>
        {bolt && <BoltSays text={bolt.text} mood={bolt.mood ?? 'chill'} size={56} />}
        <View style={{ gap: space.lg }}>{children}</View>
        <ActionButton label={editing ? 'Enregistrer' : 'Continuer'} icon={editing ? 'check' : 'arrow'} onPress={submit} disabled={!canSubmit} style={{ marginTop: space.xs }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inner: { paddingHorizontal: space.lg, gap: space.md, flexGrow: 1 },
});
