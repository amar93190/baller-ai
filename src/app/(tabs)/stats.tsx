import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/ActionButton';
import { Bolt, type Mood } from '@/components/Bolt';
import { Icon } from '@/components/Icon';
import { PointsChart } from '@/components/PointsChart';
import { Screen } from '@/components/Screen';
import { ShotChart } from '@/components/ShotChart';
import { Sparkline } from '@/components/Sparkline';
import { BlockTitle, Chevrons, Eyebrow, T } from '@/components/ui';
import { g } from '@/lib/gender';
import { DRILLS } from '@/lib/missions';
import { findModel, modelName, modelPhoto, programPct } from '@/lib/models';
import { fmtDate, fmtShort, pct, seasonAverages, sessionsThisWeek, streak, weekShotPct } from '@/lib/stats';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

type Tab = 'drills' | 'program' | 'matches';

const TABS: { label: string; value: Tab }[] = [
  { label: 'Exercices', value: 'drills' },
  { label: 'Programme', value: 'program' },
  { label: 'Matchs', value: 'matches' },
];

/** Stats : la semaine en 3 chiffres, puis le détail par exercice, programme ou match. */
export default function Stats() {
  const insets = useSafeAreaInsets();
  const { state } = usePlayer();
  // ?tab=matches ouvre directement un onglet (liens depuis l'accueil).
  const params = useLocalSearchParams<{ tab?: string }>();
  const fromParam = TABS.find((t) => t.value === params.tab)?.value;
  const [tab, setTab] = useState<Tab>(fromParam ?? 'drills');
  const [seenParam, setSeenParam] = useState(params.tab);
  if (params.tab !== seenParam) {
    setSeenParam(params.tab);
    if (fromParam) setTab(fromParam);
  }
  const week = weekShotPct(state);

  return (
    <Screen>
      <View aria-hidden style={styles.arc} />

      <View style={[styles.section, { paddingTop: insets.top + space.md, marginTop: 0 }]}>
        <Eyebrow color={colors.orange}>Stats</Eyebrow>
        <Text style={styles.title}>TA PROGRESSION.</Text>
      </View>

      <View style={[styles.section, styles.week]}>
        <Figure value={week === null ? '–' : `${week} %`} label="Tir · 7 jours" />
        <View style={styles.sep} />
        <Figure value={String(sessionsThisWeek(state))} label="Séances · 7 jours" />
        <View style={styles.sep} />
        <Figure value={String(streak(state))} label="Jours de série" />
      </View>

      <View style={[styles.section, styles.tabs]} accessibilityRole="tablist">
        {TABS.map((t) => {
          const on = t.value === tab;
          return (
            <Pressable
              key={t.value}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setTab(t.value);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={styles.tab}>
              <Text style={[styles.tabText, on && { color: colors.text }]}>{t.label.toUpperCase()}</Text>
              <View style={[styles.tabBar, on && { backgroundColor: colors.orange }]} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        {tab === 'drills' && <DrillStats />}
        {tab === 'program' && <ProgramStats />}
        {tab === 'matches' && <MatchStats />}
      </View>
    </Screen>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }} accessible accessibilityLabel={`${label} : ${value}`}>
      <Text style={styles.figure}>{value}</Text>
      <T style={styles.figureLabel} numberOfLines={1}>
        {label}
      </T>
    </View>
  );
}

/** La carte des tirs, puis une ligne par exercice : dernière série, tendance, moyenne et record. */
function DrillStats() {
  const { state } = usePlayer();
  if (state.shots.length === 0) {
    return <Empty mood="chill" title="Aucune série notée" text="Lance ta première série dans Séance : je compte avec toi." cta="Aller à Séance" onPress={() => router.navigate('/training')} />;
  }
  return (
    <View style={{ gap: space.xs }}>
      <ShotChart state={state} />
      <BlockTitle>Par exercice</BlockTitle>
      {DRILLS.map((d) => {
        const list = state.shots.filter((x) => x.drill === d);
        if (!list.length) {
          return (
            <Pressable key={d} onPress={() => router.push({ pathname: '/session', params: { drill: d, target: '25' } })} style={[styles.row, styles.rowEmpty]} accessibilityRole="button" accessibilityHint="Lance une séance">
              <View style={{ flex: 1 }}>
                <T weight="semibold">{d}</T>
                <T style={{ fontSize: 13, color: colors.muted }}>Jamais tenté · lance une série</T>
              </View>
              <Icon name="arrow" size={18} color={colors.orange} />
            </Pressable>
          );
        }
        const values = list.map((x) => pct(x.made, x.att));
        const last = values[values.length - 1];
        const best = Math.max(...values);
        const made = list.reduce((n, x) => n + x.made, 0);
        const att = list.reduce((n, x) => n + x.att, 0);
        const trend = values.length >= 2 ? last - values[values.length - 2] : 0;
        return (
          <View key={d} style={styles.row}>
            <View style={{ flex: 1 }}>
              <T weight="semibold">{d}</T>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
                <Text style={styles.big}>{last} %</Text>
                {trend !== 0 && (
                  <View style={[styles.trend, { backgroundColor: trend > 0 ? colors.goodSoft : colors.dangerSoft }]}>
                    <Text style={[styles.trendText, { color: trend > 0 ? colors.good : colors.danger }]}>
                      {trend > 0 ? '+' : ''}
                      {trend}
                    </Text>
                  </View>
                )}
              </View>
              <T style={{ fontSize: 12, color: colors.muted }}>
                Moy. {pct(made, att)} % · record {best} % · {list.length} série{list.length > 1 ? 's' : ''}
              </T>
            </View>
            <Sparkline values={values.slice(-8)} color={colors.orange} />
          </View>
        );
      })}
    </View>
  );
}

/** Le programme du joueur modèle : progression et exercices validés. */
function ProgramStats() {
  const { state } = usePlayer();
  const model = findModel(state.player.model);
  if (!model) {
    return (
      <Empty
        mood="focus"
        title="Pas encore de modèle"
        text={g(state.player.gender, 'Choisis un joueur modèle et reçois son programme.', 'Choisis une joueuse modèle et reçois son programme.')}
        cta="Choisir mon modèle"
        onPress={() => router.push('/onboarding/model')}
      />
    );
  }
  const done = state.player.programDone;
  const p = programPct(model, done);
  const count = model.drills.filter((d) => done.includes(d.id)).length;
  const xp = state.xpLog.filter((e) => e.reason === 'drill' && model.drills.some((d) => d.id === e.ref)).reduce((n, e) => n + e.xp, 0);
  const photo = modelPhoto(model);
  return (
    <View style={{ gap: space.md }}>
      <View style={styles.programHead}>
        {photo && <Image source={photo} style={styles.photo} contentFit="cover" contentPosition="top" />}
        <View style={{ flex: 1, gap: space.xxs }}>
          <Eyebrow>Programme</Eyebrow>
          <Text style={styles.programName} numberOfLines={1} adjustsFontSizeToFit>
            {modelName(model).toUpperCase()}
          </Text>
          <Chevrons pct={p} count={model.drills.length} />
          <T style={{ fontSize: 12, color: colors.muted }}>
            {count} sur {model.drills.length} · +{xp} XP gagnés
          </T>
        </View>
        <Text style={[styles.big, { color: colors.orange, fontSize: 36, lineHeight: 50 }]}>{p} %</Text>
      </View>

      <View style={{ gap: space.xs }}>
        {model.drills.map((d, i) => {
          const ok = done.includes(d.id);
          return (
            <View key={d.id} style={[styles.row, { paddingVertical: space.sm }]}>
              <View style={[styles.dot, ok && { backgroundColor: colors.goodSoft }]}>
                {ok ? <Icon name="check" size={16} color={colors.good} /> : <Text style={styles.dotNum}>{i + 1}</Text>}
              </View>
              <T weight={ok ? 'regular' : 'semibold'} style={{ flex: 1, color: ok ? colors.muted : colors.text }}>
                {d.title}
              </T>
              <Text style={[styles.status, { color: ok ? colors.good : colors.muted }]}>{ok ? 'VALIDÉ' : 'À FAIRE'}</Text>
            </View>
          );
        })}
      </View>
      {p < 100 && <ActionButton label="Continuer le programme" icon="arrow" onPress={() => router.navigate('/training')} />}
    </View>
  );
}

/** Matchs : le dernier score, les moyennes, la courbe des points et le bilan. */
function MatchStats() {
  const { state } = usePlayer();
  const m = state.matches[state.matches.length - 1];
  const s = seasonAverages(state);
  const fmt = (v: number) => v.toFixed(1).replace('.', ',');
  const add = <ActionButton label="Ajouter un match" icon="plus" onPress={() => router.push('/add-match')} />;
  if (!m) {
    return (
      <View style={{ gap: space.md }}>
        <Empty mood="focus" title="Aucun match pour l’instant" text="Après ton prochain match, note tes points, rebonds et passes ici." />
        {add}
      </View>
    );
  }
  const win = m.us > m.them;
  return (
    <View style={{ gap: space.lg }}>
      <View>
        <BlockTitle detail={fmtDate(m.date)}>Dernier match</BlockTitle>
        <View style={styles.board}>
          <View style={[styles.result, { backgroundColor: win ? colors.goodSoft : colors.dangerSoft }]}>
            <Text style={[styles.resultText, { color: win ? colors.good : colors.danger }]}>{win ? 'VICTOIRE' : 'DÉFAITE'}</Text>
          </View>
          <View style={styles.scoreLine}>
            <View style={styles.side}>
              <Text style={[styles.score, !win && { color: colors.muted }]}>{m.us}</Text>
              <T style={styles.team} numberOfLines={1}>
                {state.player.persona === 'club' && state.player.club ? state.player.club : 'Mon équipe'}
              </T>
            </View>
            <Text style={styles.dash}>–</Text>
            <View style={styles.side}>
              <Text style={[styles.score, win && { color: colors.muted }]}>{m.them}</Text>
              <T style={styles.team} numberOfLines={1}>
                {m.opp}
              </T>
            </View>
          </View>
          <Tiles items={[['Pts', m.pts], ['Reb', m.reb], ['Pd', m.ast], ['Int', m.stl]]} />
        </View>
      </View>

      <View>
        <BlockTitle detail={`${s.n} matchs depuis le ${fmtShort(state.matches[0].date)}`}>Ta saison</BlockTitle>
        <View style={styles.record}>
          <Text style={styles.recordNum}>
            <Text style={{ color: colors.good }}>{s.wins}</Text>V <Text style={{ color: colors.muted }}>·</Text> <Text style={{ color: colors.danger }}>{s.n - s.wins}</Text>D
          </Text>
          <T style={{ fontSize: 13, color: colors.muted, flex: 1, textAlign: 'right' }}>{pct(s.wins, s.n)} % de victoires</T>
        </View>
        <Tiles items={[['Pts', fmt(s.pts)], ['Reb', fmt(s.reb)], ['Pd', fmt(s.ast)], ['Int', fmt(s.stl)]]} caption="Moyenne par match" />
      </View>

      {state.matches.length >= 2 && (
        <View>
          <BlockTitle>Points par match</BlockTitle>
          <View style={styles.chart}>
            <PointsChart matches={state.matches} />
          </View>
        </View>
      )}
      {add}
    </View>
  );
}

function Empty({ mood, title, text, cta, onPress }: { mood: Mood; title: string; text: string; cta?: string; onPress?: () => void }) {
  return (
    <View style={styles.empty}>
      <Bolt mood={mood} size={84} />
      <Text style={styles.emptyTitle}>{title.toUpperCase()}</Text>
      <T style={{ color: colors.muted, textAlign: 'center', fontSize: 13, lineHeight: 20 }}>{text}</T>
      {cta && onPress && <ActionButton label={cta} icon="arrow" onPress={onPress} style={{ alignSelf: 'stretch', marginTop: space.sm }} />}
    </View>
  );
}

function Tiles({ items, caption }: { items: [string, string | number][]; caption?: string }) {
  return (
    <View style={{ gap: space.xs, marginTop: space.sm }}>
      <View style={styles.tiles}>
        {items.map(([k, v]) => (
          <View key={k} style={styles.tile} accessible accessibilityLabel={`${k} ${v}`}>
            <Text style={styles.tileNum}>{v}</Text>
            <Text style={styles.tileLabel}>{k.toUpperCase()}</Text>
          </View>
        ))}
      </View>
      {caption && <T style={{ fontSize: 12, color: colors.muted, textAlign: 'center' }}>{caption}</T>}
    </View>
  );
}

const styles = StyleSheet.create({
  arc: { position: 'absolute', left: -220, top: -320, width: 600, height: 600, borderRadius: 300, borderWidth: 1.5, borderColor: '#1F2023' },
  section: { paddingHorizontal: space.lg, marginTop: space.lg },
  title: { fontFamily: fonts.display, fontSize: 36, lineHeight: 50, color: colors.text },
  week: { flexDirection: 'row', alignItems: 'center', marginTop: space.sm, marginHorizontal: space.lg, paddingHorizontal: 0, paddingVertical: space.sm, backgroundColor: colors.surface, borderRadius: radius.tile },
  sep: { width: 1, height: 36, backgroundColor: colors.line },
  figure: { fontFamily: fonts.display, fontSize: 28, lineHeight: 39, color: colors.text },
  figureLabel: { fontSize: 11, color: colors.muted },
  tabs: { flexDirection: 'row', gap: space.md },
  tab: { paddingTop: space.xxs, gap: 6 },
  tabText: { fontFamily: fonts.display, fontSize: 18, lineHeight: 25, letterSpacing: 0.5, color: colors.muted },
  tabBar: { height: 4, borderRadius: 2, transform: [{ skewX: '-30deg' }], backgroundColor: 'transparent' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.tile, paddingVertical: space.sm, paddingHorizontal: 14 },
  rowEmpty: { backgroundColor: 'transparent', borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.line },
  big: { fontFamily: fonts.display, fontSize: 28, lineHeight: 39, color: colors.text },
  trend: { borderRadius: 6, paddingHorizontal: 6, height: 22, justifyContent: 'center' },
  trendText: { fontFamily: fonts.display, fontSize: 13, lineHeight: 18 },
  programHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.block, padding: space.md },
  photo: { width: 64, height: 80, borderRadius: 12 },
  programName: { fontFamily: fonts.display, fontSize: 24, lineHeight: 33, color: colors.text },
  dot: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  dotNum: { fontFamily: fonts.display, fontSize: 17, lineHeight: 24, color: colors.muted },
  status: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1 },
  board: { backgroundColor: colors.surface, borderRadius: radius.block, padding: space.md, paddingTop: space.lg, alignItems: 'stretch' },
  result: { alignSelf: 'center', borderRadius: radius.chip, paddingHorizontal: 10, height: 28, justifyContent: 'center' },
  resultText: { fontFamily: fonts.display, fontSize: 14, lineHeight: 20, letterSpacing: 1 },
  scoreLine: { flexDirection: 'row', alignItems: 'center', marginTop: space.xs },
  side: { flex: 1, alignItems: 'center' },
  score: { fontFamily: fonts.display, fontSize: 64, lineHeight: 88, color: colors.text },
  dash: { fontFamily: fonts.display, fontSize: 36, lineHeight: 50, color: colors.line },
  team: { fontSize: 13, color: colors.muted, marginTop: -space.xs },
  tiles: { flexDirection: 'row', gap: space.xs },
  tile: { flex: 1, backgroundColor: colors.surface2, borderRadius: radius.chip, paddingVertical: space.sm, alignItems: 'center' },
  tileNum: { fontFamily: fonts.display, fontSize: 24, lineHeight: 33, color: colors.text },
  tileLabel: { fontFamily: fonts.semibold, fontSize: 10, letterSpacing: 1.2, color: colors.muted },
  record: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm },
  recordNum: { fontFamily: fonts.display, fontSize: 36, lineHeight: 50, color: colors.text },
  chart: { backgroundColor: colors.surface, borderRadius: radius.block, paddingVertical: space.md, paddingHorizontal: space.sm },
  empty: { alignItems: 'center', gap: space.xs, backgroundColor: colors.surface, borderRadius: radius.block, padding: space.lg },
  emptyTitle: { fontFamily: fonts.display, fontSize: 22, lineHeight: 30, color: colors.text, textAlign: 'center' },
});
