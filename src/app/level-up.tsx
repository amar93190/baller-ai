import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/ActionButton';
import { Bolt } from '@/components/Bolt';
import { PlayerCard } from '@/components/PlayerCard';
import { Rays } from '@/components/Rays';
import { Button, Eyebrow } from '@/components/ui';
import { play } from '@/lib/sounds';
import { levelInfo, totalXp } from '@/lib/xp';
import { usePlayer } from '@/store/player';
import { colors, fonts, space, tiers } from '@/theme';

/** Nouveau palier : l'ancienne carte s'efface, la nouvelle se retourne. */
export default function LevelUp() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { state } = usePlayer();
  const now = levelInfo(totalXp(state)).index;
  const before = Math.max(0, Math.min(now - 1, Number(from) || 0));
  const tier = tiers[now];

  const [flip] = useState(() => new Animated.Value(0));
  useEffect(() => {
    play('levelup');
    Animated.sequence([
      Animated.delay(250),
      Animated.spring(flip, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
    ]).start(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}));
  }, [flip]);
  const rotateY = flip.interpolate({ inputRange: [0, 1], outputRange: ['90deg', '0deg'] });

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.xl, paddingBottom: insets.bottom + space.md }]}>
      <Rays top={insets.top + 330} glow />
      <Eyebrow color="#FF8A5E" style={{ alignSelf: 'center' }}>
        Nouveau palier débloqué
      </Eyebrow>
      <Text style={styles.title}>
        TU PASSES <Text style={{ color: colors.orange }}>{tier.label}</Text>
      </Text>

      <View style={styles.cards}>
        <View style={styles.ghost} aria-hidden>
          <PlayerCard width={210} tier={before} />
        </View>
        <Animated.View style={{ transform: [{ perspective: 800 }, { rotateY }] }}>
          <PlayerCard width={240} live />
        </Animated.View>
        <View style={styles.bolt}>
          <Bolt mood="wow" size={84} />
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ paddingHorizontal: space.lg, gap: space.sm }}>
        <ActionButton label={`Équiper ma carte ${tier.label}`} onPress={() => router.back()} />
        <Button label="Partager ma nouvelle carte" variant="ghost" icon="share" onPress={() => router.replace('/share-card')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  title: { fontFamily: fonts.display, fontSize: 46, lineHeight: 60, color: colors.text, textAlign: 'center', paddingHorizontal: space.lg },
  cards: { alignItems: 'center', justifyContent: 'center', marginTop: space.md, height: 380 },
  ghost: { position: 'absolute', left: 10, top: 40, opacity: 0.35, transform: [{ rotate: '-12deg' }] },
  bolt: { position: 'absolute', right: 14, bottom: -6 },
});
