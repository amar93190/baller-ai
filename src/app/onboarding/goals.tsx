import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { WeekDots } from '@/components/Illustrations';
import { OnboardingScreen } from '@/components/Onboarding';
import { BlockTitle, Stepper, T } from '@/components/ui';
import { defaults, GOALS, MAX_GOALS } from '@/lib/profile';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

/** Étape 5 : les 3 priorités du joueur et son rythme d'entraînement. */
export default function OnboardingGoals() {
  const { state, updatePlayer } = usePlayer();
  const p = state.player;
  const [goals, setGoals] = useState<string[]>(p.goals);
  const [weekly, setWeekly] = useState(p.weeklyTarget || defaults(p.gender).weeklyTarget);

  const toggle = (v: string) => {
    Haptics.selectionAsync().catch(() => {});
    setGoals((list) => (list.includes(v) ? list.filter((x) => x !== v) : list.length < MAX_GOALS ? [...list, v] : [...list.slice(1), v]));
  };

  return (
    <OnboardingScreen
      route="/onboarding/goals"
      title={['Tes ', 'objectifs']}
      bolt={{ text: `Choisis ${MAX_GOALS} priorités. Je m'en sers pour tes missions et pour te coacher.`, mood: 'focus' }}
      onSubmit={() => updatePlayer({ goals, weeklyTarget: weekly })}
      canSubmit={goals.length > 0}>
      <View>
        <BlockTitle detail={`${goals.length} sur ${MAX_GOALS}`}>À travailler</BlockTitle>
        <View style={styles.grid}>
          {GOALS.map((x) => {
            const rank = goals.indexOf(x.value);
            const on = rank >= 0;
            return (
              <Pressable
                key={x.value}
                onPress={() => toggle(x.value)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                accessibilityLabel={on ? `${x.label}, priorité ${rank + 1}` : x.label}
                style={({ pressed }) => [styles.goal, on && styles.goalOn, pressed && { transform: [{ scale: 0.96 }] }]}>
                <Icon name={x.icon} size={30} color={on ? colors.white : colors.parquet} />
                <Text style={[styles.goalLabel, on && { color: colors.white }]}>{x.label.toUpperCase()}</Text>
                {on && (
                  <View style={styles.rank}>
                    <Text style={styles.rankText}>{rank + 1}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: space.sm }}>
        <BlockTitle detail="Ton rythme visé">Séances par semaine</BlockTitle>
        <WeekDots count={weekly} />
        <Stepper big label="Séances / semaine" value={weekly} min={1} max={7} onChange={setWeekly} />
        <T style={{ fontSize: 13, color: colors.muted, textAlign: 'center' }}>{weekly >= 5 ? 'Gros rythme. Pense aux jours de repos.' : weekly <= 2 ? 'Parfait pour commencer. La régularité d’abord.' : 'Le bon rythme pour progresser vite.'}</T>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  goal: { flexBasis: '31%', flexGrow: 1, height: 104, backgroundColor: colors.surface, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center', gap: space.xs },
  goalOn: { backgroundColor: colors.orange },
  goalLabel: { fontFamily: fonts.display, fontSize: 15, lineHeight: 21, letterSpacing: 0.5, color: colors.text },
  rank: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontFamily: fonts.display, fontSize: 13, lineHeight: 18, color: colors.orange },
});
