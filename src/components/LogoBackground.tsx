import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { SHOW_BACKGROUND_LOGOS, TEAM_LOGOS } from '@/lib/teamLogos';

const CELL = 92;
const SIZE = 44;

/** Mur de logos en opacité basse, fixe derrière le contenu de l'écran. */
export const LogoBackground = memo(function LogoBackground({ opacity = 0.07 }: { opacity?: number }) {
  const { width, height } = useWindowDimensions();
  if (!SHOW_BACKGROUND_LOGOS || TEAM_LOGOS.length === 0) return null;

  const cols = Math.ceil(width / CELL) + 1;
  const rows = Math.ceil(height / CELL) + 1;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Une ligne sur deux est décalée d'une demi-case, et les logos alternent.
      const i = r * cols + c;
      cells.push(
        <Image
          key={i}
          source={TEAM_LOGOS[(r * 3 + c) % TEAM_LOGOS.length]}
          contentFit="contain"
          style={[styles.logo, { left: c * CELL + (r % 2 ? CELL / 2 : 0) - CELL / 4, top: r * CELL, transform: [{ rotate: i % 2 ? '-12deg' : '10deg' }] }]}
        />,
      );
    }
  }

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity, overflow: 'hidden' }]}>
      {cells}
    </View>
  );
});

const styles = StyleSheet.create({
  logo: { position: 'absolute', width: SIZE, height: SIZE },
});
