import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { Bolt } from '@/components/Bolt';
import { Raquette } from '@/components/Raquette';
import { BlockTitle, Button, Chevrons, Chips, Display, Eyebrow, Stepper, T } from '@/components/ui';
import { shout } from '@/lib/bolt';
import { DRILLS } from '@/lib/missions';
import { attributes, pct } from '@/lib/stats';
import { XP } from '@/lib/xp';
import { todayISO, usePlayer } from '@/store/player';
import { colors, fonts, space } from '@/theme';

/** Fiche pour noter une série déjà faite : réussis sur tentés. */
export default function LogShots() {
  const params = useLocalSearchParams<{ drill?: string }>();
  const { state, addShots } = usePlayer();
  const [drill, setDrill] = useState(params.drill && DRILLS.includes(params.drill) ? params.drill : DRILLS[0]);
  const [made, setMade] = useState(15);
  const [att, setAtt] = useState(25);
  const [result, setResult] = useState<{ pct: number; tir: number } | null>(null);
  const p = pct(made, att);

  const save = () => {
    const before = attributes(state).find((a) => a.key === 'tir')!.value;
    const after = attributes({ ...state, shots: [...state.shots, { id: 'tmp', date: todayISO(), drill, made, att }] }).find((a) => a.key === 'tir')!.value;
    addShots({ date: todayISO(), drill, made, att });
    setResult({ pct: p, tir: after - before });
  };

  if (result) {
    return (
      <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={[styles.inner, { alignItems: 'center' }]}>
        <Eyebrow color={colors.orange}>Série notée</Eyebrow>
        <Text style={styles.word} numberOfLines={1} adjustsFontSizeToFit>
          {shout(result.pct)}
        </Text>
        <View style={styles.center}>
          <Bolt mood={result.pct >= 50 ? 'hype' : 'chill'} size={88} />
          <Raquette fill={colors.orange} style={styles.xp}>
            <Text style={styles.xpNum}>+{XP.shots}</Text>
            <Text style={styles.xpLabel}>XP</Text>
          </Raquette>
        </View>
        <Text style={styles.line}>
          {made} SUR {att} · {drill.toUpperCase()}
        </Text>
        <T style={{ color: colors.muted, textAlign: 'center' }}>
          {result.pct} % de réussite{result.tir > 0 ? ` · Tir +${result.tir} sur ta carte` : ''}
        </T>
        <View style={{ alignSelf: 'stretch', gap: space.xs, marginTop: space.md }}>
          <ActionButton label="Terminer" icon="check" onPress={() => router.back()} />
          <Button label="Noter une autre série" variant="ghost" onPress={() => setResult(null)} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
      <View>
        <Eyebrow color={colors.orange}>Série déjà faite</Eyebrow>
        <Display style={{ fontSize: 30 }}>Noter ma série</Display>
      </View>

      <View>
        <BlockTitle>Exercice</BlockTitle>
        <Chips options={DRILLS} value={drill} onChange={setDrill} />
      </View>

      <View>
        <BlockTitle>Ta série</BlockTitle>
        <View style={{ flexDirection: 'row', gap: space.xs }}>
          <Stepper big label="Réussis" value={made} max={att} onChange={setMade} />
          <Stepper
            big
            label="Tentés"
            value={att}
            min={1}
            onChange={(v) => {
              setAtt(v);
              setMade((m) => Math.min(m, v));
            }}
          />
        </View>
        <View style={styles.preview} accessible accessibilityLabel={`${p} % de réussite`}>
          <Text style={styles.previewPct}>{p} %</Text>
          <View style={{ flex: 1 }}>
            <Chevrons pct={p} count={10} />
          </View>
        </View>
      </View>

      <ActionButton label={`Enregistrer · +${XP.shots} XP`} icon="check" onPress={save} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inner: { padding: space.lg, paddingTop: space.xl, gap: space.lg, paddingBottom: space.xxl },
  preview: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.sm },
  previewPct: { fontFamily: fonts.display, fontSize: 22, lineHeight: 31, color: colors.text, minWidth: 64 },
  word: { fontFamily: fonts.display, fontSize: 64, lineHeight: 88, color: colors.orange, transform: [{ skewX: '-8deg' }], marginTop: -space.md },
  center: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  xp: { width: 110, height: 92, alignItems: 'center', justifyContent: 'center' },
  xpNum: { fontFamily: fonts.display, fontSize: 36, lineHeight: 48, color: colors.white },
  xpLabel: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.6, color: colors.white, marginTop: -6 },
  line: { fontFamily: fonts.display, fontSize: 22, lineHeight: 30, color: colors.text, textAlign: 'center' },
});
