import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { T } from '@/components/ui';
import { pct } from '@/lib/stats';
import type { AppState } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

const W = 320;
const H = 250;

/** Où se tire chaque exercice sur le demi-terrain (panier en haut), et la réussite d'un bon niveau amateur. */
const ZONES: { drill: string; x: number; y: number; good: number }[] = [
  { drill: 'Layup', x: 160, y: 62, good: 70 },
  { drill: 'Mi-distance', x: 72, y: 104, good: 45 },
  { drill: 'Lancer franc', x: 160, y: 150, good: 75 },
  { drill: 'Tir à 3 pts', x: 160, y: 214, good: 38 },
];

/** Chaud quand on atteint le bon niveau de la zone, tiède un peu en dessous, froid sinon. */
function heat(p: number | null, good: number) {
  if (p === null) return { bg: colors.surface2, ink: colors.muted };
  if (p >= good) return { bg: colors.orange, ink: colors.white };
  if (p >= good - 12) return { bg: '#8A6A55', ink: colors.white };
  return { bg: '#2E3A52', ink: '#E6ECF7' };
}

/** Carte des tirs : la réussite de chaque exercice, posée à sa place sur le terrain. */
export function ShotChart({ state }: { state: AppState }) {
  const zones = ZONES.map((z) => {
    const list = state.shots.filter((x) => x.drill === z.drill);
    const att = list.reduce((n, x) => n + x.att, 0);
    const p = att ? pct(list.reduce((n, x) => n + x.made, 0), att) : null;
    return { ...z, p, att, ...heat(p, z.good) };
  });
  const total = zones.reduce((n, z) => n + z.att, 0);
  const cold = zones.filter((z) => z.p !== null).sort((a, b) => a.p! / a.good - b.p! / b.good)[0];
  const label = zones.map((z) => `${z.drill} ${z.p === null ? 'pas de tir' : `${z.p} %`}`).join(', ');

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>CARTE DES TIRS</Text>
        <T style={{ fontSize: 12, color: colors.muted }}>{total} tirs notés</T>
      </View>
      <View style={styles.court} accessible accessibilityRole="image" accessibilityLabel={`Carte des tirs : ${label}`}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
          <Rect x={0} y={0} width={W} height={H} fill="#1B1C1F" />
          <Path d={`M14 0 V30 A150 150 0 0 0 ${W - 14} 30 V0`} fill="none" stroke="#3A3B40" strokeWidth={2} />
          <Rect x={110} y={0} width={100} height={140} fill="rgba(208,138,94,0.08)" stroke={colors.parquet} strokeWidth={2} />
          <Circle cx={160} cy={140} r={45} fill="none" stroke="#3A3B40" strokeWidth={2} strokeDasharray="6 6" />
          <Line x1={138} y1={14} x2={182} y2={14} stroke={colors.text} strokeWidth={3} />
          <Circle cx={160} cy={26} r={10} fill="none" stroke={colors.orange} strokeWidth={2.5} />
        </Svg>
        {zones.map((z) => (
          <View key={z.drill} style={[styles.zone, { left: `${(z.x / W) * 100}%`, top: `${(z.y / H) * 100}%`, backgroundColor: z.bg }]}>
            <Text style={[styles.zonePct, { color: z.ink }]}>{z.p === null ? '–' : `${z.p} %`}</Text>
            <Text style={[styles.zoneName, { color: z.ink }]} numberOfLines={1}>
              {z.drill === 'Tir à 3 pts' ? '3 PTS' : z.drill === 'Lancer franc' ? 'LF' : z.drill === 'Mi-distance' ? 'MI-DIST.' : 'LAYUP'}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <T style={styles.legendText}>Froid</T>
        <View style={[styles.swatch, { backgroundColor: '#2E3A52' }]} />
        <View style={[styles.swatch, { backgroundColor: '#8A6A55' }]} />
        <View style={[styles.swatch, { backgroundColor: colors.orange }]} />
        <T style={styles.legendText}>Chaud</T>
        <T style={[styles.legendText, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>
          {cold && zones.filter((z) => z.p !== null).length > 1 ? `À bosser : ${cold.drill.toLowerCase()}` : ''}
        </T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radius.block, padding: space.md, gap: space.sm, marginTop: space.md },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  title: { fontFamily: fonts.display, fontSize: 20, lineHeight: 28, color: colors.text },
  court: { width: '100%', aspectRatio: W / H, borderRadius: 12, overflow: 'hidden' },
  zone: { position: 'absolute', width: 62, height: 50, marginLeft: -31, marginTop: -25, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  zonePct: { fontFamily: fonts.display, fontSize: 17, lineHeight: 23 },
  zoneName: { fontFamily: fonts.semibold, fontSize: 9, letterSpacing: 0.5, marginTop: -2 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendText: { fontSize: 11, color: colors.muted },
  swatch: { width: 14, height: 8, borderRadius: 2 },
});
