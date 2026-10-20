import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/ActionButton';
import { BlockTitle, Display, Eyebrow, Field, Stepper, T } from '@/components/ui';
import { XP } from '@/lib/xp';
import { todayISO, usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

/** Fiche d'après-match : le score décide du résultat, puis les stats perso. */
export default function AddMatch() {
  const { addMatch } = usePlayer();
  const [opp, setOpp] = useState('');
  const [v, setV] = useState({ pts: 10, reb: 4, ast: 3, stl: 1, us: 60, them: 55 });
  const set = (k: keyof typeof v) => (n: number) => setV((x) => ({ ...x, [k]: n }));
  const tie = v.us === v.them;
  const win = v.us > v.them;
  const tone = tie ? { bg: colors.surface2, fg: colors.muted, label: 'ÉGALITÉ' } : win ? { bg: colors.goodSoft, fg: colors.good, label: 'VICTOIRE' } : { bg: colors.dangerSoft, fg: colors.danger, label: 'DÉFAITE' };

  const save = () => {
    if (tie) return;
    addMatch({ date: todayISO(), opp: opp.trim() || 'Adversaire', us: v.us, them: v.them, pts: v.pts, reb: v.reb, ast: v.ast, stl: v.stl });
    router.back();
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
      <View>
        <Eyebrow color={colors.orange}>Après-match</Eyebrow>
        <Display style={{ fontSize: 30 }}>Nouveau match</Display>
      </View>

      <Field label="Adversaire" value={opp} onChangeText={setOpp} placeholder="Ex. Bron" maxLength={24} returnKeyType="done" />

      <View>
        <View style={styles.boardHead}>
          <Text style={styles.blockTitle}>SCORE FINAL</Text>
          <View style={[styles.result, { backgroundColor: tone.bg }]} accessibilityLiveRegion="polite">
            <Text style={[styles.resultText, { color: tone.fg }]}>{tone.label}</Text>
          </View>
        </View>
        <View style={styles.grid}>
          <Stepper big label="Ton équipe" value={v.us} onChange={set('us')} />
          <Stepper big label={opp.trim() || 'Adversaire'} value={v.them} onChange={set('them')} />
        </View>
        <T style={styles.hint}>{tie ? 'Pas de match nul au basket : ajuste le score.' : 'Garde le doigt sur + ou − pour aller vite.'}</T>
      </View>

      <View>
        <BlockTitle>Tes stats</BlockTitle>
        <View style={styles.grid}>
          <Stepper label="Points" value={v.pts} onChange={set('pts')} />
          <Stepper label="Rebonds" value={v.reb} onChange={set('reb')} />
          <Stepper label="Passes déc." value={v.ast} onChange={set('ast')} />
          <Stepper label="Interceptions" value={v.stl} onChange={set('stl')} />
        </View>
      </View>

      <ActionButton label={`Enregistrer · +${XP.match} XP`} icon="check" onPress={save} disabled={tie} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inner: { padding: space.lg, paddingTop: space.xl, gap: space.lg, paddingBottom: space.xxl },
  boardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm },
  blockTitle: { fontFamily: fonts.display, fontSize: 22, lineHeight: 30, color: colors.text },
  result: { borderRadius: radius.chip, paddingHorizontal: 10, height: 28, justifyContent: 'center' },
  resultText: { fontFamily: fonts.display, fontSize: 14, lineHeight: 20, letterSpacing: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  hint: { fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: space.xs },
});
