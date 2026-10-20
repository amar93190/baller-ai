import Svg, { Circle, Path, Rect } from 'react-native-svg';

/** Jeu d'icônes Baller : grille de 24, trait de 2, angles coupés en biais quand c'est possible. */
const BALLER = {
  home: 'M3 11 L12 4 L21 11 M5 10 V20 H19 V10 M10 20 V14 H14 V20',
  session: 'M3 12 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M3 12 H21 M12 3 V21 M5.6 5.6 Q10 12 5.6 18.4 M18.4 5.6 Q14 12 18.4 18.4',
  card: 'M8 3 H16 L20 6 V20 L19 21 H5 L4 20 V6 Z M10 3 a2 2 0 0 0 4 0 M9 15 H15',
  stats: 'M5 20 V15 M10 20 V11 M15 20 V13 M20 20 V8 M3 20 H22 M4 10 L9 6 L14 8 L20 3 M16 3 H20 V7',
  coach: 'M4 5 H20 V16 H10 L5 20 V16 H4 Z M13 7 L10 11 H14 L11 15',
  shot: 'M3 18 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M8 15 Q12 4 19 6 M16 8 H22',
  dribble: 'M8 7 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M12 14 V15.5 M12 18 V19.5 M8 21 H16',
  defense: 'M4 12 H9 M15 12 H20 M6 9 L3 12 L6 15 M18 9 L21 12 L18 15 M12 6 V18',
  streak: 'M12 21 c4 0 7 -3 7 -7 c0 -5 -5 -7 -5 -11 c-3 2 -5 5 -5 8 c-1 -1 -2 -2 -2 -4 c-2 2 -2 5 -2 7 c0 4 3 7 7 7 Z',
  xp: 'M13 2 L5 13 H11 L10 22 L19 10 H13 Z',
  jersey: 'M8 3 H10 Q12 6 14 3 H16 L17 7 Q18 9 21 10 V21 H3 V10 Q6 9 7 7 Z',
  match: 'M3 6 H21 V17 H3 Z M12 6 V17 M7 21 H17 M7 10 V13 M16 10 V13',
  hoop: 'M4 6 H20 M6 6 L8 16 H16 L18 6 M9 6 L11 16 M15 6 L13 16 M7 11 H17',
  chrono: 'M4 13 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M12 9 V13 L15 15 M10 3 H14',
  profile: 'M8 8 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M4 21 Q12 13 20 21',
  sliders: 'M4 7 H20 M4 17 H20 M9 4 V10 M15 14 V20',
  close: 'M6 6 L18 18 M18 6 L6 18',
} as const;

export type IconName =
  | keyof typeof BALLER
  | 'arrow' | 'check' | 'plus' | 'minus' | 'send' | 'bolt' | 'flame' | 'share' | 'ball' | 'team' | 'camera' | 'back' | 'eye' | 'eyeOff' | 'gear' | 'logout' | 'lock' | 'mail' | 'shield' | 'doc' | 'trash' | 'info';

/** Petites icônes au trait, reprises de la maquette. */
export function Icon({ name, size = 20, color = '#F4F1EC', stroke = 2 }: { name: IconName; size?: number; color?: string; stroke?: number }) {
  const p = { stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  if (name in BALLER) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={BALLER[name as keyof typeof BALLER]} {...p} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'arrow' && <Path d="m9 5 7 7-7 7" {...p} strokeWidth={stroke + 0.4} />}
      {name === 'back' && <Path d="m15 5-7 7 7 7" {...p} strokeWidth={stroke + 0.4} />}
      {name === 'check' && <Path d="m5 12.5 4.5 4.5L19 7" {...p} strokeWidth={stroke + 1} />}
      {name === 'plus' && <Path d="M12 5v14M5 12h14" {...p} />}
      {name === 'minus' && <Path d="M5 12h14" {...p} />}
      {name === 'send' && <Path d="M5 12h13M13 6l6 6-6 6" {...p} />}
      {name === 'bolt' && <Path d="M13 3 5 14h6l-1 7 8-11h-6z" {...p} />}
      {name === 'flame' && (
        <Path d="M12 2c.6 3.2-1.4 5-3 6.8C7.4 10.6 6 12.4 6 15a6 6 0 0 0 12 0c0-2.3-1-4.1-2.2-5.4-.2 1.4-.9 2.5-2 3 .5-3.6-.6-7.6-1.8-10.6z" fill={color} />
      )}
      {name === 'share' && (
        <>
          <Path d="M12 15V3M7 8l5-5 5 5" {...p} />
          <Path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" {...p} />
        </>
      )}
      {name === 'ball' && (
        <>
          <Circle cx={12} cy={12} r={9} {...p} />
          <Path d="M3 12h18M12 3v18M5.6 5.6c3 2.6 3 10.2 0 12.8M18.4 5.6c-3 2.6-3 10.2 0 12.8" {...p} />
        </>
      )}
      {name === 'team' && (
        <>
          <Circle cx={9} cy={8} r={3.5} {...p} />
          <Path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6" {...p} />
        </>
      )}
      {name === 'eye' && (
        <>
          <Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" {...p} />
          <Circle cx={12} cy={12} r={3} {...p} />
        </>
      )}
      {name === 'eyeOff' && <Path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2" {...p} />}
      {name === 'gear' && (
        <>
          <Circle cx={12} cy={12} r={3} {...p} />
          <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" {...p} />
        </>
      )}
      {name === 'logout' && <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" {...p} />}
      {name === 'lock' && (
        <>
          <Rect x={4} y={11} width={16} height={10} rx={2.5} {...p} />
          <Path d="M8 11V7a4 4 0 0 1 8 0v4" {...p} />
        </>
      )}
      {name === 'mail' && (
        <>
          <Rect x={3} y={5} width={18} height={14} rx={2.5} {...p} />
          <Path d="m3.5 6.5 8.5 6.5 8.5-6.5" {...p} />
        </>
      )}
      {name === 'shield' && <Path d="M12 3 4.5 6v6c0 4.4 3.2 8.2 7.5 9 4.3-.8 7.5-4.6 7.5-9V6z" {...p} />}
      {name === 'doc' && <Path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6" {...p} />}
      {name === 'trash' && <Path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" {...p} />}
      {name === 'info' && (
        <>
          <Circle cx={12} cy={12} r={9} {...p} />
          <Path d="M12 11v5M12 8h.01" {...p} />
        </>
      )}
      {name === 'camera' && (
        <>
          <Rect x={2.5} y={6} width={13.5} height={12} rx={3} {...p} />
          <Path d="m16 10.5 5.5-3v9l-5.5-3" {...p} />
        </>
      )}
    </Svg>
  );
}
