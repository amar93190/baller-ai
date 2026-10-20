import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

/**
 * Forme signature « Raquette » : épaules coupées en biais comme le trapèze de la raquette,
 * coins du bas cassés, et en option l'encoche ronde du lancer franc.
 * - card : la carte joueur, les badges ;
 * - button : le bouton d'action, seules les épaules sont coupées.
 */
export type RaquetteKind = 'card' | 'button';

export function raquettePath(w: number, h: number, kind: RaquetteKind = 'card', notch = 0) {
  const sx = kind === 'card' ? w * 0.22 : Math.min(14, w * 0.04);
  const sy = kind === 'card' ? h * 0.12 : h * 0.3;
  const c = kind === 'card' ? Math.min(w, h) * 0.06 : 0;
  const top = notch > 0 ? `H${w / 2 - notch} A${notch} ${notch} 0 0 0 ${w / 2 + notch} 0 ` : '';
  return `M${sx} 0 ${top}H${w - sx} L${w} ${sy} V${h - c} L${w - c} ${h} H${c} L0 ${h - c} V${sy} Z`;
}

type Props = {
  kind?: RaquetteKind;
  /** Couleur unie, ou 2-3 couleurs pour un dégradé en diagonale. */
  fill: string | readonly string[];
  /** Rayon de l'encoche du lancer franc (carte seulement). */
  notch?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/** Conteneur en forme de Raquette. Il mesure sa taille, donc il s'adapte à sa largeur. */
export function Raquette({ kind = 'card', fill, notch = 0, style, children }: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const colors = typeof fill === 'string' ? [fill] : fill;
  const id = `rq-${colors.join('').replace(/[^a-z0-9]/gi, '')}`;
  return (
    <View style={style} onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {size.w > 0 && (
        <Svg width={size.w} height={size.h} style={StyleSheet.absoluteFill}>
          {colors.length > 1 && (
            <Defs>
              <LinearGradient id={id} x1="0" y1="0" x2="0.6" y2="1">
                {colors.map((c, i) => (
                  <Stop key={c + i} offset={i / (colors.length - 1)} stopColor={c} />
                ))}
              </LinearGradient>
            </Defs>
          )}
          <Path d={raquettePath(size.w, size.h, kind, notch)} fill={colors.length > 1 ? `url(#${id})` : colors[0]} />
        </Svg>
      )}
      {children}
    </View>
  );
}
