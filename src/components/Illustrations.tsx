import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { T } from '@/components/ui';
import { positionLabel } from '@/lib/gender';
import { meters, POSITION_SPOTS, RIM, standingReach } from '@/lib/profile';
import type { Gender } from '@/store/player';
import { colors, fonts, mix, radius } from '@/theme';

const RW = 320;
const RH = 270;
const GROUND = 252;
/** Pixels par cm : le cercle (305 cm) et un peu de marge tiennent dans le dessin. */
const K = 222 / 330;

/**
 * Le joueur à l'échelle à côté du panier : sa taille, sa main bras levé, et ce qui manque pour toucher le cercle.
 * Les membres sont des traits épais, comme les icônes Baller.
 */
export function ReachScale({ height, wingspan, color }: { height: number; wingspan: number; color: string }) {
  const reach = standingReach(height, wingspan);
  const gap = RIM - reach;
  const y = (cm: number) => GROUND - cm * K;
  const h = height * K;
  const cx = 118;
  // Proportions du corps, en fraction de la taille.
  const head = y(height * 0.935);
  const shoulder = y(height * 0.82);
  const hip = y(height * 0.52);
  const handY = y(reach);
  const limb = Math.max(5, h * 0.05);
  const rimY = y(RIM);
  const label = `${meters(height)}, main bras levé à ${meters(reach)}, cercle à ${meters(RIM)}`;

  return (
    <View style={styles.reach} accessible accessibilityRole="image" accessibilityLabel={label}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${RW} ${RH}`}>
        <Rect x={0} y={GROUND} width={RW} height={RH - GROUND} fill="#1B1C1F" />
        <Line x1={0} y1={GROUND} x2={RW} y2={GROUND} stroke={colors.parquet} strokeWidth={2} />

        {/* Panier : poteau, planche, cercle et filet */}
        <Path d={`M300 ${GROUND} V${rimY - 46} H284`} stroke="#3A3B40" strokeWidth={6} fill="none" />
        <Rect x={276} y={rimY - 62} width={8} height={70} rx={2} fill={colors.text} />
        <Line x1={238} y1={rimY} x2={276} y2={rimY} stroke={colors.orange} strokeWidth={4} strokeLinecap="round" />
        <Path d={`M240 ${rimY} L246 ${rimY + 26} H268 L274 ${rimY}`} stroke="rgba(244,241,236,0.5)" strokeWidth={1.5} fill="none" />
        <Path d={`M249 ${rimY} L254 ${rimY + 26} M257 ${rimY} L257 ${rimY + 26} M265 ${rimY} L260 ${rimY + 26}`} stroke="rgba(244,241,236,0.3)" strokeWidth={1.2} />

        {/* Ligne du cercle et ligne de la main */}
        <Line x1={24} y1={rimY} x2={236} y2={rimY} stroke={colors.orange} strokeWidth={1.5} strokeDasharray="5 5" />
        <SvgText x={24} y={rimY - 7} fill={colors.orange} fontSize={13} fontFamily={fonts.display}>
          {`CERCLE ${meters(RIM)}`}
        </SvgText>
        <Line x1={cx + 16} y1={handY} x2={236} y2={handY} stroke={colors.text} strokeWidth={1.5} strokeDasharray="2 5" />
        <SvgText x={cx + 20} y={handY - 7} fill={colors.text} fontSize={13} fontFamily={fonts.display}>
          {`TA MAIN ${meters(reach)}`}
        </SvgText>
        {gap > 0 && (
          <G>
            <Line x1={222} y1={rimY + 4} x2={222} y2={handY - 4} stroke={colors.orange} strokeWidth={2} />
            <Path d={`M217 ${rimY + 10} L222 ${rimY + 3} L227 ${rimY + 10}`} stroke={colors.orange} strokeWidth={2} fill="none" />
          </G>
        )}

        {/* Toise */}
        <Line x1={44} y1={GROUND} x2={44} y2={y(height)} stroke={colors.muted} strokeWidth={1.5} />
        <Line x1={38} y1={y(height)} x2={50} y2={y(height)} stroke={colors.muted} strokeWidth={1.5} />
        <SvgText x={40} y={y(height) - 8} fill={colors.muted} fontSize={12} fontFamily={fonts.display} textAnchor="middle">
          {meters(height)}
        </SvgText>

        {/* Le joueur, bras droit levé */}
        <G stroke={color} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Line x1={cx - limb * 0.7} y1={hip} x2={cx - limb * 0.9} y2={GROUND - limb / 2} strokeWidth={limb} />
          <Line x1={cx + limb * 0.7} y1={hip} x2={cx + limb * 0.9} y2={GROUND - limb / 2} strokeWidth={limb} />
          <Path d={`M${cx} ${shoulder + limb} V${hip - limb / 2}`} strokeWidth={limb * 2.6} />
          <Line x1={cx - limb * 1.3} y1={shoulder + limb * 0.6} x2={cx - limb * 2} y2={hip} strokeWidth={limb * 0.85} />
          <Line x1={cx + limb * 1.3} y1={shoulder + limb * 0.6} x2={cx + limb * 1.5} y2={handY + limb / 2} strokeWidth={limb * 0.85} />
        </G>
        <Circle cx={cx} cy={head} r={limb * 1.25} fill={color} />
        <Circle cx={cx + limb * 1.5} cy={handY - limb * 0.9} r={limb * 1.1} fill={colors.orange} />
      </Svg>
      <View style={[styles.reachBadge, gap <= 0 && { backgroundColor: colors.goodSoft }]}>
        <Text style={[styles.reachBadgeText, gap <= 0 && { color: colors.good }]}>{gap > 0 ? `+${gap} CM POUR LE CERCLE` : 'TU TOUCHES LE CERCLE'}</Text>
      </View>
    </View>
  );
}

const CW = 320;
const CH = 230;

/** Demi-terrain : on touche un poste de 1 à 5 à sa place sur le parquet. */
export function CourtPositions({ value, onChange, gender }: { value: string; onChange: (position: string) => void; gender: Gender }) {
  return (
    <View style={styles.court}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${CW} ${CH}`}>
        <Rect x={0} y={0} width={CW} height={CH} fill="#1B1C1F" />
        <Path d={`M14 0 V40 A150 150 0 0 0 ${CW - 14} 40 V0`} fill="none" stroke="#3A3B40" strokeWidth={2} />
        <Rect x={110} y={0} width={100} height={130} fill="rgba(208,138,94,0.08)" stroke={colors.parquet} strokeWidth={2} />
        <Circle cx={160} cy={130} r={42} fill="none" stroke="#3A3B40" strokeWidth={2} strokeDasharray="6 6" />
        <Line x1={138} y1={14} x2={182} y2={14} stroke={colors.text} strokeWidth={3} />
        <Circle cx={160} cy={26} r={10} fill="none" stroke={colors.orange} strokeWidth={2.5} />
      </Svg>
      {Object.entries(POSITION_SPOTS).map(([pos, s]) => {
        const on = pos === value;
        return (
          <Pressable
            key={pos}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onChange(pos);
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${s.n}, ${positionLabel(pos, gender)}`}
            hitSlop={6}
            style={[styles.spot, { left: `${(s.x / CW) * 100}%`, top: `${(s.y / CH) * 100}%` }, on && styles.spotOn]}>
            <Text style={[styles.spotNum, on && { color: colors.white }]}>{s.n}</Text>
          </Pressable>
        );
      })}
      <View style={styles.courtLabel} pointerEvents="none">
        <T weight="semibold" style={{ fontSize: 13 }}>
          {POSITION_SPOTS[value] ? `${POSITION_SPOTS[value].n} · ${positionLabel(value, gender)}` : 'Touche ton poste'}
        </T>
      </View>
    </View>
  );
}

/** Chaussure montante vue de côté, aux couleurs de l'équipe, avec l'éclair Baller sur le flanc. */
export function Shoe({ color, width = 200 }: { color: string; width?: number }) {
  const dark = mix(color, '#000000', 0.45);
  return (
    <Svg width={width} height={width * 0.6} viewBox="0 0 200 120">
      <Path d="M8 96 Q6 112 24 112 H182 Q198 112 196 98 L192 90 H12 Z" fill={colors.text} />
      <Rect x={12} y={90} width={182} height={5} fill={colors.orange} />
      <Path d="M14 92 L16 34 Q18 14 38 12 L72 10 Q82 10 82 22 L86 40 Q102 52 132 58 Q178 64 190 80 L194 92 Z" fill={color} />
      <Path d="M150 61 Q182 66 191 84 L194 92 H156 Q150 76 150 61 Z" fill={dark} />
      <Path d="M14 92 L16 40 H26 L24 92 Z" fill={dark} />
      <Path d="M18 16 Q30 8 44 10" stroke={dark} strokeWidth={5} strokeLinecap="round" fill="none" />
      <G stroke={colors.text} strokeWidth={3} strokeLinecap="round">
        <Line x1={84} y1={30} x2={94} y2={26} />
        <Line x1={90} y1={40} x2={100} y2={34} />
        <Line x1={98} y1={48} x2={107} y2={41} />
        <Line x1={108} y1={53} x2={116} y2={46} />
      </G>
      <Path d="M62 32 L42 62 H55 L46 86 L74 52 H60 L70 32 Z" fill={colors.text} />
      <Rect x={17} y={50} width={6} height={14} rx={1.5} fill={colors.orange} />
    </Svg>
  );
}

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** La semaine type : les jours d'entraînement allumés, répartis au mieux. */
export function WeekDots({ count }: { count: number }) {
  const on = new Set(Array.from({ length: count }, (_, i) => Math.floor((i * 7) / count)));
  return (
    <View style={styles.week} accessible accessibilityLabel={`${count} séances par semaine`}>
      {DAYS.map((d, i) => (
        <View key={i} style={[styles.day, on.has(i) && { backgroundColor: colors.orange }]}>
          <Text style={[styles.dayText, on.has(i) && { color: colors.white }]}>{d}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  reach: { width: '100%', aspectRatio: RW / RH, borderRadius: radius.block, overflow: 'hidden', backgroundColor: colors.surface },
  reachBadge: { position: 'absolute', right: 12, bottom: 26, backgroundColor: 'rgba(228,80,31,0.18)', borderRadius: 8, paddingHorizontal: 8, height: 26, justifyContent: 'center' },
  reachBadgeText: { fontFamily: fonts.display, fontSize: 13, lineHeight: 18, letterSpacing: 0.5, color: colors.orange },
  court: { width: '100%', aspectRatio: CW / CH, borderRadius: radius.block, overflow: 'hidden' },
  spot: { position: 'absolute', width: 48, height: 48, marginLeft: -24, marginTop: -24, borderRadius: 24, backgroundColor: colors.surface2, borderWidth: 2, borderColor: '#3A3B40', alignItems: 'center', justifyContent: 'center' },
  spotOn: { backgroundColor: colors.orange, borderColor: colors.orange, transform: [{ scale: 1.12 }] },
  spotNum: { fontFamily: fonts.display, fontSize: 22, lineHeight: 30, color: colors.muted },
  courtLabel: { position: 'absolute', left: 12, bottom: 10, backgroundColor: 'rgba(11,11,12,0.7)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  week: { flexDirection: 'row', gap: 6 },
  day: { flex: 1, height: 40, borderRadius: radius.chip, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontFamily: fonts.display, fontSize: 15, lineHeight: 21, color: colors.muted },
});
