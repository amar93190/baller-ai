import Svg, { Circle, Polyline } from 'react-native-svg';

/** Mini-courbe de progression (valeurs de 0 à 100). */
export function Sparkline({ values, color, width = 110, height = 36 }: { values: number[]; color: string; width?: number; height?: number }) {
  if (values.length < 2) return null;
  const pad = 4;
  const x = (i: number) => pad + (i * (width - pad * 2)) / (values.length - 1);
  const y = (v: number) => pad + (height - pad * 2) * (1 - v / 100);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = values[values.length - 1];
  return (
    <Svg width={width} height={height}>
      <Polyline points={pts} fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
      <Circle cx={x(values.length - 1)} cy={y(last)} r={3.5} fill={color} />
    </Svg>
  );
}
