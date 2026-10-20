import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/ActionButton';
import { Bolt } from '@/components/Bolt';
import { Icon } from '@/components/Icon';
import { Raquette } from '@/components/Raquette';
import { Rays } from '@/components/Rays';
import { Button, Eyebrow, T } from '@/components/ui';
import { shout } from '@/lib/bolt';
import { play } from '@/lib/sounds';
import { attributes, pct, streak } from '@/lib/stats';
import { levelInfo, totalXp } from '@/lib/xp';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

/** Fin de série : le cri de victoire, l'XP gagnée, la stat qui monte. */
export default function Swish() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ made: string; att: string; drill: string; xp: string; level: string; tir: string }>();
  const { state } = usePlayer();
  const made = Number(params.made) || 0;
  const att = Number(params.att) || 1;
  const p = pct(made, att);
  const gained = Math.max(0, totalXp(state) - (Number(params.xp) || 0));
  const levelBefore = Number(params.level) || 0;
  const levelNow = levelInfo(totalXp(state)).index;
  const tirBefore = Number(params.tir) || 0;
  const tirNow = attributes(state).find((a) => a.key === 'tir')!.value;
  const word = shout(p);

  const [pop] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    play('swish');
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }).start();
  }, [pop]);
  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  const next = () => {
    if (levelNow > levelBefore) router.replace({ pathname: '/level-up', params: { from: String(levelBefore) } });
    else router.back();
  };

  const share = () =>
    Share.share({ message: `${word} ! ${made} sur ${att} (${p} %) en ${params.drill?.toLowerCase()} sur Baller. Ma note de tir : ${tirNow}.` }).catch(() => {});

  // Les tirs réussis d'abord, puis les ratés (on ne connaît pas l'ordre exact).
  const dots = Array.from({ length: Math.min(att, 40) }, (_, i) => i < Math.round((made / att) * Math.min(att, 40)));

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.xl, paddingBottom: insets.bottom + space.md }]}>
      <Rays top={250} />
      <View style={styles.ring} />

      <Eyebrow color="#FF8A5E" style={{ alignSelf: 'center' }}>
        Série terminée
      </Eyebrow>
      <Animated.Text style={[styles.word, { transform: [{ scale }, { skewX: '-8deg' }] }]} numberOfLines={1} adjustsFontSizeToFit>
        {word}
      </Animated.Text>

      <View style={styles.center}>
        <Bolt mood={p >= 50 ? 'hype' : 'chill'} size={96} />
        <Raquette fill={colors.orange} style={styles.xp}>
          <Text style={styles.xpNum}>+{gained}</Text>
          <Text style={styles.xpLabel}>XP</Text>
        </Raquette>
      </View>

      <Text style={styles.result}>
        {made} SUR {att} · {params.drill?.toUpperCase()}
      </Text>
      <T style={{ textAlign: 'center', color: '#C9C4BC' }}>{p} % de réussite</T>

      <View style={styles.dots} accessible accessibilityLabel={`${made} tirs réussis sur ${att}`}>
        {dots.map((on, i) => (
          <View key={i} style={[styles.dot, on ? { backgroundColor: colors.orange, borderColor: colors.orange } : null]} />
        ))}
      </View>

      <View style={styles.chips}>
        <View style={styles.chip}>
          <T weight="semibold" style={{ fontSize: 12, color: colors.muted }}>
            TIR
          </T>
          <Text style={styles.chipNum}>{tirBefore}</Text>
          <Icon name="arrow" size={14} color={tirNow > tirBefore ? colors.good : colors.muted} />
          <Text style={[styles.chipNum, tirNow > tirBefore && { color: colors.good }]}>{tirNow}</Text>
        </View>
        <View style={styles.chip}>
          <Icon name="streak" size={16} color={colors.orange} />
          <Text style={styles.chipNum}>{streak(state)}</Text>
          <T style={{ fontSize: 12, color: colors.muted }}>jours de suite</T>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ paddingHorizontal: space.lg, gap: space.sm }}>
        <ActionButton label={levelNow > levelBefore ? 'Voir ma nouvelle carte' : 'Continuer'} icon="arrow" tone="light" onPress={next} />
        <Button label="Partager ma série" variant="ghost" icon="share" onPress={share} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  ring: { position: 'absolute', left: '50%', top: 250, width: 330, height: 330, marginLeft: -165, marginTop: -165, borderRadius: 165, borderWidth: 2, borderColor: 'rgba(228,80,31,0.5)' },
  word: { fontFamily: fonts.display, fontSize: 96, lineHeight: 124, color: colors.orange, textAlign: 'center', paddingHorizontal: space.lg },
  center: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.md },
  xp: { width: 110, height: 128, alignItems: 'center', justifyContent: 'center' },
  xpNum: { fontFamily: fonts.display, fontSize: 44, lineHeight: 58, color: colors.white },
  xpLabel: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 2, color: colors.white, marginTop: -6 },
  result: { fontFamily: fonts.display, fontSize: 26, lineHeight: 36, color: colors.text, textAlign: 'center', marginTop: space.lg },
  dots: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, paddingHorizontal: space.xl, marginTop: space.md },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#3A3B40' },
  chips: { flexDirection: 'row', justifyContent: 'center', gap: space.xs, marginTop: space.lg, flexWrap: 'wrap', paddingHorizontal: space.lg },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: radius.tile, paddingHorizontal: 14, height: 44 },
  chipNum: { fontFamily: fonts.display, fontSize: 19, lineHeight: 27, color: colors.text },
});
