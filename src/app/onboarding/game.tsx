import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { CourtPositions } from '@/components/Illustrations';
import { OnboardingScreen } from '@/components/Onboarding';
import { BlockTitle, Field, T } from '@/components/ui';
import { g } from '@/lib/gender';
import { LEVELS } from '@/lib/profile';
import { usePlayer, type Gender, type Persona } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

const personas = (gd: Gender): { value: Persona; icon: IconName; title: string; text: string }[] => [
  { value: 'solo', icon: 'shot', title: 'En autonome', text: `Je m’entraîne surtout ${g(gd, 'seul', 'seule')}, au playground ou à la salle.` },
  { value: 'club', icon: 'match', title: 'En club', text: '2 entraînements par semaine, je veux progresser entre les séances.' },
];

/** Étape 3 : autonome ou en club, niveau, et le poste choisi sur le demi-terrain. */
export default function OnboardingGame() {
  const { state, updatePlayer } = usePlayer();
  const p = state.player;
  const [persona, setPersona] = useState<Persona>(p.persona);
  const [club, setClub] = useState(p.club);
  const [level, setLevel] = useState(p.level);
  const [position, setPosition] = useState(p.position);
  const tap = () => Haptics.selectionAsync().catch(() => {});

  return (
    <OnboardingScreen
      route="/onboarding/game"
      title={['Ton ', 'jeu']}
      onSubmit={() => updatePlayer({ persona, club: persona === 'club' ? club.trim() : p.club, level, position })}
      canSubmit={!!level}>
      <View style={{ gap: space.xs }}>
        {personas(p.gender).map((x) => {
          const on = persona === x.value;
          return (
            <Pressable
              key={x.value}
              onPress={() => {
                tap();
                setPersona(x.value);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              style={[styles.persona, on && { borderColor: colors.orange }]}>
              <View style={[styles.ico, on && { backgroundColor: colors.orange }]}>
                <Icon name={x.icon} size={22} color={on ? colors.white : colors.parquet} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.personaTitle}>{x.title.toUpperCase()}</Text>
                <T style={{ color: colors.muted, fontSize: 13, lineHeight: 19 }}>{x.text}</T>
              </View>
            </Pressable>
          );
        })}
        {persona === 'club' && <Field label="Ton club et ton équipe" value={club} onChangeText={setClub} placeholder="Ex. BCM Lyon U18" maxLength={30} />}
      </View>

      <View>
        <BlockTitle>Ton niveau</BlockTitle>
        <View style={styles.levels}>
          {LEVELS.map((l, i) => {
            const on = level === l.value;
            return (
              <Pressable
                key={l.value}
                onPress={() => {
                  tap();
                  setLevel(l.value);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${l.label}, ${l.detail}`}
                style={[styles.level, on && styles.levelOn]}>
                {/* Des barres qui montent avec le niveau */}
                <View style={styles.bars}>
                  {LEVELS.map((_, j) => (
                    <View key={j} style={[styles.bar, { height: 6 + j * 5 }, { backgroundColor: j <= i ? (on ? colors.white : colors.orange) : on ? 'rgba(255,255,255,0.3)' : colors.line }]} />
                  ))}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.levelTitle, on && { color: colors.white }]}>{l.label.toUpperCase()}</Text>
                  <T style={{ fontSize: 12, color: on ? 'rgba(255,255,255,0.85)' : colors.muted }}>{l.detail}</T>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View>
        <BlockTitle detail="Touche ta place sur le terrain">Ton poste</BlockTitle>
        <CourtPositions value={position} onChange={setPosition} gender={p.gender} />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  persona: { flexDirection: 'row', gap: space.sm, alignItems: 'center', padding: 14, borderRadius: radius.tile, backgroundColor: colors.surface, borderWidth: 2, borderColor: 'transparent' },
  ico: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  personaTitle: { fontFamily: fonts.display, fontSize: 18, lineHeight: 25, color: colors.text },
  levels: { gap: space.xs },
  level: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.tile, paddingVertical: space.sm, paddingHorizontal: 14 },
  levelOn: { backgroundColor: colors.orange },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, width: 36, height: 24 },
  bar: { width: 6, borderRadius: 2 },
  levelTitle: { fontFamily: fonts.display, fontSize: 17, lineHeight: 24, color: colors.text },
});
