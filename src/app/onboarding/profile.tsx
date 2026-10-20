import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { OnboardingScreen } from '@/components/Onboarding';
import { BlockTitle, Segmented, Stepper, T } from '@/components/ui';
import { age, category, defaults, HANDS } from '@/lib/profile';
import { usePlayer, type Gender, type Hand } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

/** Étape 1 : joueur ou joueuse, âge (et catégorie), main forte. */
export default function OnboardingProfile() {
  const { state, updatePlayer } = usePlayer();
  const p = state.player;
  const [birthYear, setBirthYear] = useState(p.birthYear || defaults(p.gender).birthYear);
  const [hand, setHand] = useState<Hand>(p.hand);
  const thisYear = new Date().getFullYear();

  return (
    <OnboardingScreen
      route="/onboarding/profile"
      title={['Qui es-', 'tu ?']}
      bolt={{ text: `Yo, moi c'est Bolt. Quelques questions et je te prépare un coaching taillé pour toi.`, mood: 'hype' }}
      onSubmit={() => updatePlayer({ birthYear, hand })}
      canSubmit={!!hand}>
      <Segmented<Gender>
        value={p.gender}
        onChange={(gender) => updatePlayer({ gender })}
        options={[
          { label: 'Joueur', value: 'M' },
          { label: 'Joueuse', value: 'F' },
        ]}
      />

      <View>
        <BlockTitle detail="Pour ta catégorie">Ton âge</BlockTitle>
        <View style={styles.ageRow}>
          <View style={{ flex: 1 }}>
            <Stepper big label="Année de naissance" value={birthYear} min={thisYear - 60} max={thisYear - 8} onChange={setBirthYear} />
          </View>
          <View style={styles.cat} accessible accessibilityLabel={`${age(birthYear)} ans, catégorie ${category(birthYear)}`}>
            <Text style={styles.catText}>{category(birthYear)}</Text>
            <T style={{ fontSize: 12, color: colors.muted }}>{age(birthYear)} ans</T>
          </View>
        </View>
      </View>

      <View>
        <BlockTitle detail="Ta main de tir">Main forte</BlockTitle>
        <View style={styles.hands}>
          {HANDS.map((h) => {
            const on = hand === h.value;
            const ink = on ? colors.white : colors.parquet;
            return (
              <Pressable
                key={h.value}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setHand(h.value);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={h.label(p.gender)}
                style={[styles.hand, on && styles.handOn]}>
                <View style={styles.handArt}>
                  {h.value !== 'R' && (
                    <View style={{ transform: [{ scaleX: -1 }] }}>
                      <Icon name="shot" size={30} color={ink} />
                    </View>
                  )}
                  {h.value !== 'L' && <Icon name="shot" size={30} color={ink} />}
                </View>
                <Text style={[styles.handLabel, on && { color: colors.white }]} numberOfLines={1} adjustsFontSizeToFit>
                  {h.label(p.gender).toUpperCase()}
                </Text>
                <T style={{ fontSize: 11, color: on ? 'rgba(255,255,255,0.85)' : colors.muted, textAlign: 'center' }}>{h.detail}</T>
              </Pressable>
            );
          })}
        </View>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  ageRow: { flexDirection: 'row', gap: space.xs, alignItems: 'stretch' },
  cat: { width: 96, backgroundColor: colors.surface, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.orange },
  catText: { fontFamily: fonts.display, fontSize: 30, lineHeight: 42, color: colors.orange },
  hands: { flexDirection: 'row', gap: space.xs },
  hand: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.tile, paddingVertical: space.md, paddingHorizontal: space.xs, alignItems: 'center', gap: 4 },
  handOn: { backgroundColor: colors.orange },
  handArt: { flexDirection: 'row', height: 36, alignItems: 'center', gap: 2 },
  handLabel: { fontFamily: fonts.display, fontSize: 16, lineHeight: 22, color: colors.text },
});
