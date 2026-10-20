import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';

/** Rayons de lumière derrière un moment fort (mission réussie, nouveau palier). */
export function Rays({ size = 900, color = '#E4501F', glow = false, top = 0 }: { size?: number; color?: string; glow?: boolean; top?: number }) {
  const c = size / 2;
  const wedges = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15 * Math.PI) / 180;
    const b = ((i * 15 + 5) * Math.PI) / 180;
    return `M${c} ${c} L${c + c * Math.cos(a)} ${c + c * Math.sin(a)} L${c + c * Math.cos(b)} ${c + c * Math.sin(b)} Z`;
  });
  return (
    <Svg width={size} height={size} style={{ position: 'absolute', left: '50%', top, marginLeft: -c, marginTop: -c }} pointerEvents="none">
      {glow && (
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={0.55} />
            <Stop offset="0.35" stopColor={color} stopOpacity={0.12} />
            <Stop offset="0.7" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
      )}
      {wedges.map((d) => (
        <Path key={d} d={d} fill={color} opacity={0.07} />
      ))}
      {glow && <Circle cx={c} cy={c} r={c * 0.6} fill="url(#glow)" />}
    </Svg>
  );
}
