import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Easing, PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Jersey } from '@/components/Jersey';
import { raquettePath } from '@/components/Raquette';
import { attributes, overall, positions } from '@/lib/stats';
import { levelInfo, totalXp } from '@/lib/xp';
import { usePlayer } from '@/store/player';
import { fonts, tiers } from '@/theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const W = 260;
const H = 380;

const SHORT: Record<string, string> = { tir: 'TIR', passe: 'PAS', rebond: 'REB', defense: 'DÉF', mental: 'MEN' };

/**
 * Carte joueur Baller, en forme de Raquette. Son métal dépend du palier (niveau d'XP) :
 * Rookie bronze, Titulaire argent, All-Star or, MVP Feu, Légende noire.
 * `tier` force un palier (écran de passage de palier).
 * `live` : un reflet passe sur la carte, et on peut l'incliner du doigt.
 */
export function PlayerCard({ width = W, tier, live = false }: { width?: number; tier?: number; live?: boolean }) {
  const { state } = usePlayer();
  const p = state.player;
  const t = tiers[tier ?? levelInfo(totalXp(state)).index];
  const attrs = attributes(state);
  const code = positions.find((x) => x.label === p.position)?.code ?? 'AIL';
  const k = width / W;
  const s = (n: number) => n * k;
  const shape = raquettePath(W, H, 'card', 25);
  const ink = { color: t.ink };

  // Reflet qui traverse la carte, puis une pause.
  const [shine] = useState(() => new Animated.Value(-W));
  useEffect(() => {
    if (!live) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shine, { toValue: W, duration: 1600, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.delay(2200),
        Animated.timing(shine, { toValue: -W, duration: 0, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [live, shine]);

  // Inclinaison au doigt, qui revient en place au lâcher.
  const [tilt] = useState(() => new Animated.ValueXY());
  const [pan] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
      onPanResponderGrant: () => Haptics.selectionAsync().catch(() => {}),
      onPanResponderMove: Animated.event([null, { dx: tilt.x, dy: tilt.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => Animated.spring(tilt, { toValue: { x: 0, y: 0 }, friction: 4, useNativeDriver: false }).start(),
      onPanResponderTerminate: () => Animated.spring(tilt, { toValue: { x: 0, y: 0 }, friction: 4, useNativeDriver: false }).start(),
    }),
  );
  const rotateY = tilt.x.interpolate({ inputRange: [-160, 160], outputRange: ['-18deg', '18deg'], extrapolate: 'clamp' });
  const rotateX = tilt.y.interpolate({ inputRange: [-160, 160], outputRange: ['16deg', '-16deg'], extrapolate: 'clamp' });
  const shineX = Animated.add(shine, Animated.multiply(tilt.x, 1.2));

  return (
    <Animated.View
      {...(live ? pan.panHandlers : {})}
      style={{ width, height: s(H), alignSelf: 'center', transform: live ? [{ perspective: 900 }, { rotateX }, { rotateY }] : [] }}
      accessible
      accessibilityLabel={`Carte ${t.label}, note ${overall(state)}, ${p.name}, numéro ${p.num}`}>
      <Svg width={width} height={s(H)} viewBox={`0 0 ${W} ${H}`} style={StyleSheet.absoluteFill}>
        <Defs>
          <ClipPath id="card">
            <Path d={shape} />
          </ClipPath>
          <LinearGradient id="metal" x1="0" y1="0" x2="0.55" y2="1">
            {t.bg.map((c, i) => (
              <Stop key={c} offset={i / (t.bg.length - 1)} stopColor={c} />
            ))}
          </LinearGradient>
          <LinearGradient id="sheen" x1="0" y1="0" x2="1" y2="0.7">
            <Stop offset="0.3" stopColor={t.sheen} stopOpacity={0} />
            <Stop offset="0.45" stopColor={t.sheen} stopOpacity={1} />
            <Stop offset="0.6" stopColor={t.sheen} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <G clipPath="url(#card)">
          <Rect x={0} y={0} width={W} height={H} fill="url(#metal)" />
          {live ? <AnimatedRect x={shineX} y={0} width={W} height={H} fill="url(#sheen)" /> : <Rect x={0} y={0} width={W} height={H} fill="url(#sheen)" />}
          <Circle cx={W / 2} cy={300} r={150} fill="none" stroke={t.ink} strokeOpacity={0.18} strokeWidth={1.5} />
        </G>
      </Svg>

      <View style={[styles.ovr, { left: s(22), top: s(36) }]}>
        <Text style={[styles.display, ink, { fontSize: s(52), lineHeight: s(64) }]}>{overall(state)}</Text>
        <Text style={[styles.display, ink, { fontSize: s(17), lineHeight: s(22), letterSpacing: 1 }]}>{code}</Text>
        <View style={{ width: s(26), height: 2, backgroundColor: t.ink, opacity: 0.6, marginVertical: s(7) }} />
        <Text style={[styles.display, ink, { fontSize: s(13), lineHeight: s(18), opacity: 0.85 }]}>#{p.num}</Text>
      </View>

      <View style={[styles.badge, { right: s(16), top: s(44), borderColor: t.ink, paddingHorizontal: s(7), paddingVertical: s(3), borderRadius: s(6) }]}>
        <Text style={[styles.display, ink, { fontSize: s(12), lineHeight: s(16), letterSpacing: 1.5 }]}>{t.label}</Text>
      </View>

      <View style={{ position: 'absolute', left: s(76), top: s(72) }}>
        <Jersey color={p.color} num={p.num} size={s(128)} />
      </View>

      <Text numberOfLines={1} style={[styles.display, styles.name, ink, { top: s(222), fontSize: s(27), lineHeight: s(38), paddingHorizontal: s(20) }]}>
        {p.name || 'Joueur'}
      </Text>
      <View style={{ position: 'absolute', left: s(34), right: s(34), top: s(266), height: 1, backgroundColor: t.ink, opacity: 0.4 }} />

      <View style={[styles.attrs, { left: s(24), right: s(24), top: s(276), rowGap: s(2) }]}>
        {attrs.map((a) => (
          <View key={a.key} style={[styles.attr, { gap: s(4) }]}>
            <Text style={[styles.display, ink, { fontSize: s(19), lineHeight: s(27) }]}>{a.value}</Text>
            <Text style={[styles.attrLabel, ink, { fontSize: s(10) }]}>{SHORT[a.key] ?? a.label}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  display: { fontFamily: fonts.display },
  ovr: { position: 'absolute', alignItems: 'center' },
  badge: { position: 'absolute', borderWidth: 1 },
  name: { position: 'absolute', left: 0, right: 0, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  attrs: { position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  attr: { width: '33%', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  attrLabel: { fontFamily: fonts.semibold, letterSpacing: 1, opacity: 0.85 },
});
