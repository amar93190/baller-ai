import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

import { useAccent } from '@/components/ui';
import { fmtShort } from '@/lib/stats';
import type { Match } from '@/store/player';
import { colors, fonts } from '@/theme';

/** Courbe des points marqués sur les 8 derniers matchs. */
export function PointsChart({ matches }: { matches: Match[] }) {
  const { accent } = useAccent();
  const [W, setW] = useState(300);
  const data = matches.slice(-8);
  if (data.length < 2) return null;
  const H = 150;
  const L = 24;
  const R = 12;
  const Tp = 18;
  const B = 24;
  const max = Math.ceil((Math.max(...data.map((d) => d.pts)) + 2) / 5) * 5;
  const x = (i: number) => L + (i * (W - L - R)) / (data.length - 1);
  const y = (v: number) => Tp + (H - Tp - B) * (1 - v / max);
  const pts = data.map((d, i) => [x(i), y(d.pts)] as const);
  const line = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
  const area = `${line} L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  const last = pts[pts.length - 1];

  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      <Svg width={W} height={H}>
        <Defs>
          <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={accent} stopOpacity={0.28} />
            <Stop offset="1" stopColor={accent} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {[0, max / 2, max].map((v) => (
          <Line key={v} x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={colors.line} strokeWidth={1} />
        ))}
        {[0, max / 2, max].map((v) => (
          <SvgText key={`t${v}`} x={L - 6} y={y(v) + 3.5} textAnchor="end" fontSize={9.5} fontFamily={fonts.regular} fill={colors.muted}>
            {String(v)}
          </SvgText>
        ))}
        <Path d={area} fill="url(#area)" />
        <Path d={line} fill="none" stroke={accent} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {pts.slice(0, -1).map(([px, py], i) => (
          <Circle key={i} cx={px} cy={py} r={3} fill={colors.bg} stroke={accent} strokeWidth={2} />
        ))}
        <Circle cx={last[0]} cy={last[1]} r={9} fill={accent} opacity={0.2} />
        <Circle cx={last[0]} cy={last[1]} r={5} fill={accent} />
        <SvgText x={last[0]} y={last[1] - 13} textAnchor="end" fontSize={11} fontFamily={fonts.bold} fill={colors.text}>
          {`${data[data.length - 1].pts} pts`}
        </SvgText>
        {data.map((d, i) => (
          <SvgText key={d.id} x={x(i)} y={H - 6} textAnchor="middle" fontSize={9} fontFamily={fonts.regular} fill={colors.muted}>
            {fmtShort(d.date)}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
