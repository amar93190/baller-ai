import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/ActionButton';
import { Icon } from '@/components/Icon';
import { MissionTiles } from '@/components/Missions';
import { ModelProgram } from '@/components/ModelProgram';
import { Screen } from '@/components/Screen';
import { BlockTitle, Eyebrow, T } from '@/components/ui';
import { DRILLS, missionsFor } from '@/lib/missions';
import { pct } from '@/lib/stats';
import { XP } from '@/lib/xp';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

const TARGETS = [10, 25, 50];

const tap = () => Haptics.selectionAsync().catch(() => {});

/** Séance : un seul geste principal, lancer une série. Les missions et le programme suivent en dessous. */
export default function Training() {
  const insets = useSafeAreaInsets();
  const { state } = usePlayer();
  const missions = missionsFor(state);
  const done = missions.filter((m) => m.done).length;
  // Par défaut : l'exercice de la mission du jour, s'il reste à faire.
  const mission = missions.find((m) => m.action === 'shots' && !m.done);
  const [drill, setDrill] = useState(mission?.drill ?? DRILLS[0]);
  const [target, setTarget] = useState(25);
  const isMission = !!mission && mission.drill === drill;

  return (
    <Screen>
      <View aria-hidden style={styles.arc} />

      <View style={[styles.head, { paddingTop: insets.top + space.md }]}>
        <Eyebrow color={colors.orange}>Séance</Eyebrow>
        <Text style={styles.title}>AU BOULOT.</Text>
      </View>

      <View style={styles.section}>
        <BlockTitle action={{ label: 'Déjà tiré ? Note-la', onPress: () => router.push({ pathname: '/log-shots', params: { drill } }) }}>Lance ta série</BlockTitle>
        <View style={styles.grid}>
          {DRILLS.map((d) => {
            const list = state.shots.filter((x) => x.drill === d);
            const last = list[list.length - 1];
            const on = d === drill;
            return (
              <Pressable
                key={d}
                onPress={() => {
                  tap();
                  setDrill(d);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${d}${mission?.drill === d ? ', mission du jour' : ''}${last ? `, dernière série ${pct(last.made, last.att)} %` : ''}`}
                style={({ pressed }) => [styles.tile, on && styles.tileOn, pressed && { transform: [{ scale: 0.97 }] }]}>
                <View style={styles.tileTop}>
                  <T weight="semibold" style={{ fontSize: 15, flex: 1 }} numberOfLines={1}>
                    {d}
                  </T>
                  {mission?.drill === d && <Icon name="xp" size={16} color={colors.orange} />}
                </View>
                <Text style={[styles.tilePct, !last && { color: colors.muted }]}>{last ? `${pct(last.made, last.att)} %` : '–'}</Text>
                <T style={{ fontSize: 12, color: colors.muted }} numberOfLines={1}>
                  {last ? `Dernière : ${last.made} sur ${last.att}` : 'Jamais tenté'}
                </T>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.targets} accessibilityRole="radiogroup">
          {TARGETS.map((n) => {
            const on = n === target;
            return (
              <Pressable
                key={n}
                onPress={() => {
                  tap();
                  setTarget(n);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                accessibilityLabel={`${n} tirs`}
                style={[styles.target, on && styles.targetOn]}>
                <Text style={[styles.targetNum, on && { color: colors.bg }]}>{n}</Text>
                <T weight="medium" style={{ fontSize: 12, color: on ? colors.bg : colors.muted }}>
                  tirs
                </T>
              </Pressable>
            );
          })}
        </View>

        <ActionButton label={`C'est parti · ${target} tirs`} icon="arrow" onPress={() => router.push({ pathname: '/session', params: { drill, target: String(target) } })} style={{ marginTop: space.md }} />
        <T style={styles.hint}>{isMission ? `Mission du jour : ${mission.target} tirs dans la journée = +${mission.xp} XP en plus.` : `+${XP.shots} XP par série. Tu tires, je compte.`}</T>
      </View>

      <View style={styles.section}>
        <BlockTitle detail={`${done} sur ${missions.length}`}>Missions du jour</BlockTitle>
        <MissionTiles />
      </View>

      <View style={styles.section}>
        <BlockTitle>Programme pro</BlockTitle>
        <ModelProgram />
      </View>

      <View style={styles.section}>
        <View style={styles.soon}>
          <View style={styles.soonIcon}>
            <Icon name="camera" size={20} color={colors.muted} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
              <T weight="semibold">Analyse vidéo</T>
              <Text style={styles.soonTag}>BIENTÔT</Text>
            </View>
            <T style={{ fontSize: 13, lineHeight: 19, color: colors.muted }}>Filme ta série : l’IA compte tes tirs et corrige ta technique.</T>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  arc: { position: 'absolute', right: -200, top: -300, width: 560, height: 560, borderRadius: 280, borderWidth: 1.5, borderColor: '#1F2023' },
  head: { paddingHorizontal: space.lg },
  title: { fontFamily: fonts.display, fontSize: 36, lineHeight: 50, color: colors.text },
  section: { paddingHorizontal: space.lg, marginTop: space.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  tile: { flexBasis: '48%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: radius.tile, borderWidth: 2, borderColor: colors.surface, paddingVertical: space.sm, paddingHorizontal: 14, gap: 2 },
  tileOn: { borderColor: colors.orange, backgroundColor: '#1E1612' },
  tileTop: { flexDirection: 'row', alignItems: 'center', gap: space.xxs },
  tilePct: { fontFamily: fonts.display, fontSize: 30, lineHeight: 42, color: colors.text },
  targets: { flexDirection: 'row', gap: space.xs, marginTop: space.sm },
  target: { flex: 1, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.xxs, borderRadius: radius.chip, backgroundColor: colors.surface },
  targetOn: { backgroundColor: colors.text },
  targetNum: { fontFamily: fonts.display, fontSize: 22, lineHeight: 31, color: colors.text },
  hint: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: space.sm, lineHeight: 19 },
  soon: { flexDirection: 'row', alignItems: 'center', gap: space.sm, borderRadius: radius.tile, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.line, paddingVertical: space.sm, paddingHorizontal: 14 },
  soonIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  soonTag: { fontFamily: fonts.semibold, fontSize: 10, letterSpacing: 1.2, color: colors.orange, borderWidth: 1, borderColor: colors.orange, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1, overflow: 'hidden' },
});
