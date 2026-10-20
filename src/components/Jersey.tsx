import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';

import { fonts, mix } from '@/theme';

/**
 * Maillot Baller, avec la signature : panneaux latéraux en forme de raquette, éclair du logo
 * sur le flanc, double col et étiquette « B ». Avec un prénom, il est vu de dos ; sans, de face.
 */
export function Jersey({ color, num, name, size = 190, trim = '#FFFFFF' }: { color: string; num: number; name?: string; size?: number; trim?: string }) {
  const panel = mix(color, '#000000', 0.35);
  const back = !!name;
  const neck = back ? 'M92 8 Q120 24 148 8' : 'M92 8 Q120 56 148 8';
  const line = { fill: 'none', stroke: trim, strokeWidth: 10 };
  return (
    <Svg width={size} height={(size * 280) / 240} viewBox="0 0 240 280">
      <Path d={`M56 8 L92 8 ${back ? 'Q120 24' : 'Q120 56'} 148 8 L184 8 L190 52 Q206 80 232 88 L232 272 L8 272 L8 88 Q34 80 50 52 Z`} fill={color} />
      <Path d="M8 112 L30 112 L40 272 L8 272 Z" fill={panel} />
      <Path d="M232 112 L210 112 L200 272 L232 272 Z" fill={panel} />
      <Path d="M15 132 L29 132 L23 182 L33 182 L17 246 L20 198 L11 198 Z" fill={trim} />
      <Path d="M225 132 L211 132 L217 182 L207 182 L223 246 L220 198 L229 198 Z" fill={trim} />
      <Path d={neck} {...line} />
      {!back && <Path d="M84 8 Q120 68 156 8" fill="none" stroke={panel} strokeWidth={3} />}
      <Path d="M50 52 Q34 80 8 88" {...line} />
      <Path d="M190 52 Q206 80 232 88" {...line} />
      <Rect x={8} y={262} width={224} height={10} fill={trim} />
      {back ? (
        <SvgText x={120} y={78} textAnchor="middle" fontFamily={fonts.display} fontSize={28} letterSpacing={4} fill={trim}>
          {name.toUpperCase().slice(0, 12)}
        </SvgText>
      ) : (
        <>
          <SvgText x={120} y={104} textAnchor="middle" fontFamily={fonts.display} fontSize={22} letterSpacing={5} fill={trim}>
            BALLER
          </SvgText>
          <Path d="M48 230 L62 230 L68 236 L68 256 L42 256 L42 236 Z" fill={trim} />
          <SvgText x={55} y={251} textAnchor="middle" fontFamily={fonts.display} fontSize={16} fill={color}>
            B
          </SvgText>
        </>
      )}
      <SvgText
        x={120}
        y={back ? 212 : 196}
        textAnchor="middle"
        fontFamily={fonts.display}
        fontSize={back ? 116 : 86}
        fill={trim}
        stroke={panel}
        strokeWidth={back ? 5 : 4}>
        {String(num)}
      </SvgText>
    </Svg>
  );
}
