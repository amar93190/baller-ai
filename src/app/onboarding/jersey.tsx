import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/ActionButton';
import { Jersey } from '@/components/Jersey';
import { BlockTitle, Display, Field, Stepper, Steps, useAccent } from '@/components/ui';
import { ONBOARDING, stepOf } from '@/lib/profile';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius, space, teamColors } from '@/theme';

export default function OnboardingJersey() {
  const insets = useSafeAreaInsets();
  const { state, updatePlayer, finishOnboarding } = usePlayer();
  const { accent } = useAccent();
  const p = state.player;
  const editing = state.onboarded;

  const save = () => {
    if (editing) {
      updatePlayer({ name: p.name.trim() || 'Joueur' });
      router.back();
    } else {
      finishOnboarding();
      router.replace('/home');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[styles.inner, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <Steps step={editing ? undefined : stepOf('/onboarding/jersey')} total={ONBOARDING.length} onBack={() => router.back()} />
        <Display style={{ fontSize: 44 }}>
          {editing ? 'Ton ' : 'Crée ton\n'}
          <Display style={{ fontSize: 44, color: accent }}>maillot</Display>
        </Display>

        <View style={styles.stage}>
          <Text style={[styles.bignum, { color: p.color }]}>{p.num}</Text>
          <Jersey color={p.color} num={p.num} name={p.name || 'Prénom'} />
        </View>

        <View style={styles.formRow}>
          <View style={{ flex: 1 }}>
            <Field label="Prénom au dos" value={p.name} onChangeText={(name) => updatePlayer({ name })} placeholder="Ton prénom" maxLength={12} autoCapitalize="words" />
          </View>
          <View style={{ width: 150 }}>
            <Stepper label="Numéro" value={p.num} min={0} max={99} onChange={(num) => updatePlayer({ num })} />
          </View>
        </View>

        <View>
          <BlockTitle detail={teamColors.find((c) => c.value === p.color)?.label}>Couleur d’équipe</BlockTitle>
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            {teamColors.map((c) => {
              const on = c.value === p.color;
              return (
                <Pressable
                  key={c.value}
                  onPress={() => updatePlayer({ color: c.value })}
                  accessibilityRole="radio"
                  accessibilityLabel={c.label}
                  accessibilityState={{ selected: on }}
                  style={[styles.swatch, { backgroundColor: c.value }, on && styles.swatchOn]}
                />
              );
            })}
          </View>
        </View>

        <ActionButton label={editing ? 'Enregistrer' : 'Valider mon maillot'} icon={editing ? 'check' : 'arrow'} onPress={save} style={{ marginTop: space.sm }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inner: { paddingHorizontal: 22, gap: 16, flexGrow: 1 },
  stage: { height: 240, borderRadius: radius.block, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  bignum: { position: 'absolute', right: -6, top: -24, fontFamily: fonts.display, fontSize: 250, opacity: 0.1 },
  formRow: { flexDirection: 'row', gap: space.xs, alignItems: 'flex-end' },
  swatch: { flex: 1, height: 48, borderRadius: radius.chip },
  swatchOn: { borderWidth: 3, borderColor: colors.bg, outlineColor: colors.text, outlineWidth: 2, outlineStyle: 'solid' },
});
