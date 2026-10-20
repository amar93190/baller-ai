import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { T } from '@/components/ui';
import { colors, radius, space } from '@/theme';

export type Mood = 'chill' | 'focus' | 'hype' | 'wow' | 'sad';

const INK = '#0B0B0C';
const SEAM = '#A33610';

/** Le visage change avec l'humeur ; le ballon et le bandeau restent les mêmes. */
function Face({ mood }: { mood: Mood }) {
  const line = { stroke: INK, strokeLinecap: 'round' as const, fill: 'none' };
  switch (mood) {
    case 'hype':
      return (
        <G>
          <Path d="M61 114 Q74 96 87 114" strokeWidth={6} {...line} />
          <Path d="M113 114 Q126 96 139 114" strokeWidth={6} {...line} />
          <Path d="M74 130 Q100 172 126 130 Z" fill={INK} />
          <Ellipse cx={100} cy={150} rx={11} ry={6} fill="#FF8A8A" />
          <Path d="M176 30 L186 18 M184 44 L198 40 M168 20 L170 6" stroke={colors.text} strokeWidth={4} strokeLinecap="round" />
        </G>
      );
    case 'focus':
      return (
        <G>
          <Ellipse cx={74} cy={114} rx={13} ry={10} fill="#FFFFFF" />
          <Ellipse cx={126} cy={114} rx={13} ry={10} fill="#FFFFFF" />
          <Circle cx={76} cy={115} r={6} fill={INK} />
          <Circle cx={128} cy={115} r={6} fill={INK} />
          <Path d="M58 96 L88 104" strokeWidth={6} {...line} />
          <Path d="M142 96 L112 104" strokeWidth={6} {...line} />
          <Path d="M86 146 L114 146" strokeWidth={5} {...line} />
        </G>
      );
    case 'sad':
      return (
        <G>
          <Ellipse cx={74} cy={112} rx={13} ry={15} fill="#FFFFFF" />
          <Ellipse cx={126} cy={112} rx={13} ry={15} fill="#FFFFFF" />
          <Circle cx={74} cy={118} r={7} fill={INK} />
          <Circle cx={126} cy={118} r={7} fill={INK} />
          <Path d="M60 100 L86 92" strokeWidth={6} {...line} />
          <Path d="M140 100 L114 92" strokeWidth={6} {...line} />
          <Path d="M82 152 Q100 138 118 152" strokeWidth={5} {...line} />
          <Path d="M60 128 Q55 138 60 142 Q66 138 60 128 Z" fill="#9FD3FF" />
        </G>
      );
    case 'wow':
      return (
        <G>
          <Ellipse cx={72} cy={110} rx={16} ry={19} fill="#FFFFFF" />
          <Ellipse cx={128} cy={110} rx={16} ry={19} fill="#FFFFFF" />
          <Circle cx={72} cy={110} r={9} fill={INK} />
          <Circle cx={128} cy={110} r={9} fill={INK} />
          <Circle cx={75} cy={106} r={3} fill="#FFFFFF" />
          <Circle cx={131} cy={106} r={3} fill="#FFFFFF" />
          <Ellipse cx={100} cy={148} rx={10} ry={13} fill={INK} />
        </G>
      );
    default:
      return (
        <G>
          <Ellipse cx={74} cy={110} rx={13} ry={16} fill="#FFFFFF" />
          <Ellipse cx={126} cy={110} rx={13} ry={16} fill="#FFFFFF" />
          <Circle cx={77} cy={113} r={7} fill={INK} />
          <Circle cx={129} cy={113} r={7} fill={INK} />
          <Path d="M80 142 Q100 158 120 142" strokeWidth={5} {...line} />
        </G>
      );
  }
}

/** Bolt, la mascotte : un ballon avec l'éclair du logo sur le bandeau. Il rebondit doucement. */
export function Bolt({ mood = 'chill', size = 120, bounce = true }: { mood?: Mood; size?: number; bounce?: boolean }) {
  const [y] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!bounce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: 1, duration: mood === 'hype' ? 380 : 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: mood === 'hype' ? 380 : 900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [bounce, mood, y]);
  const lift = y.interpolate({ inputRange: [0, 1], outputRange: [0, -size * (mood === 'hype' ? 0.08 : 0.035)] });

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ translateY: lift }] }} accessible accessibilityLabel={`Bolt, ${LABELS[mood]}`}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Ellipse cx={100} cy={190} rx={56} ry={7} fill="rgba(0,0,0,0.35)" />
        <Circle cx={100} cy={100} r={82} fill={colors.orange} />
        <Path d="M42 36 Q72 100 42 164" fill="none" stroke={SEAM} strokeWidth={4} />
        <Path d="M158 36 Q128 100 158 164" fill="none" stroke={SEAM} strokeWidth={4} />
        <Path d="M24 136 Q100 160 176 136" fill="none" stroke={SEAM} strokeWidth={4} />
        <Ellipse cx={66} cy={48} rx={20} ry={10} fill="rgba(255,255,255,0.22)" transform="rotate(-30 66 48)" />
        <Path d="M22 72 Q100 38 178 72 L175 90 Q100 58 25 90 Z" fill={colors.text} />
        <Path d="M97 50 L110 50 L103 60 L111 60 L94 78 L99 65 L91 65 Z" fill={colors.orange} />
        <Face mood={mood} />
      </Svg>
    </Animated.View>
  );
}

const LABELS: Record<Mood, string> = { chill: 'détendu', focus: 'concentré', hype: 'en feu', wow: 'impressionné', sad: 'déçu' };

/** Bolt qui parle : la mascotte et sa bulle. */
export function BoltSays({ text, mood = 'chill', size = 60, style }: { text: string; mood?: Mood; size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.row, style]}>
      <Bolt mood={mood} size={size} />
      <View style={styles.bubble} accessibilityLiveRegion="polite">
        <T style={styles.text}>{text}</T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  bubble: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.tile, borderTopLeftRadius: 4, paddingVertical: space.sm, paddingHorizontal: 14 },
  text: { fontSize: 15, lineHeight: 22 },
});
