import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { BoltSays } from '@/components/Bolt';
import { Icon } from '@/components/Icon';
import { Raquette } from '@/components/Raquette';
import { Eyebrow, T } from '@/components/ui';
import { boltLive } from '@/lib/bolt';
import { play } from '@/lib/sounds';
import { DRILLS } from '@/lib/missions';
import { attributes, pct } from '@/lib/stats';
import { levelInfo, totalXp } from '@/lib/xp';
import { todayISO, usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

const RING = 260;
const STROKE = 14;

/** Séance en direct : deux gros boutons, utilisables les mains moites et sans regarder. */
export default function Session() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ drill?: string; target?: string }>();
  const drill = params.drill && DRILLS.includes(params.drill) ? params.drill : DRILLS[0];
  const target = Math.max(5, Math.min(100, Number(params.target) || 25));
  const { state, addShots } = usePlayer();
  const [made, setMade] = useState(0);
  const [tries, setTries] = useState(0);
  const [combo, setCombo] = useState(0);
  const [last, setLast] = useState<'hit' | 'miss' | null>(null);
  const [seconds, setSeconds] = useState(0);
  const before = useRef({ xp: totalXp(state), level: levelInfo(totalXp(state)).index, tir: attributes(state).find((a) => a.key === 'tir')!.value });

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const finish = (m: number, a: number) => {
    if (a === 0) return router.back();
    addShots({ date: todayISO(), drill, made: m, att: a });
    router.replace({
      pathname: '/swish',
      params: { made: String(m), att: String(a), drill, xp: String(before.current.xp), level: String(before.current.level), tir: String(before.current.tir) },
    });
  };

  const shoot = (hit: boolean) => {
    if (tries >= target) return;
    if (hit) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      play('swish');
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      play('tick');
    }
    const m = made + (hit ? 1 : 0);
    const a = tries + 1;
    setMade(m);
    setTries(a);
    setCombo(hit ? combo + 1 : 0);
    setLast(hit ? 'hit' : 'miss');
    if (a >= target) setTimeout(() => finish(m, a), 700);
  };

  const undo = () => {
    if (!tries || tries >= target) return;
    if (last === 'hit') setMade(made - 1);
    setTries(tries - 1);
    setCombo(0);
    setLast(null);
  };

  const bolt = boltLive(made, tries, target, combo, last);
  const r = (RING - STROKE) / 2;
  const circ = 2 * Math.PI * r;
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.sm, paddingBottom: insets.bottom + space.md }]}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.round} accessibilityLabel="Quitter la séance" hitSlop={8}>
          <Icon name="close" size={18} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Eyebrow color={colors.orange}>Séance en direct</Eyebrow>
          <Text style={styles.title} numberOfLines={1}>
            {target} TIRS · {drill.toUpperCase()}
          </Text>
        </View>
        <View style={styles.clock}>
          <Icon name="chrono" size={15} color={colors.muted} />
          <Text style={styles.clockText}>{clock}</Text>
        </View>
      </View>

      <View style={styles.ringWrap} accessible accessibilityLabel={`${made} réussis sur ${tries} tirs, objectif ${target}`}>
        <Svg width={RING} height={RING} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={RING / 2} cy={RING / 2} r={r} stroke="#1F2023" strokeWidth={STROKE} fill="none" />
          <Circle
            cx={RING / 2}
            cy={RING / 2}
            r={r}
            stroke={colors.orange}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            strokeDashoffset={circ * (1 - tries / target)}
          />
        </Svg>
        <View style={styles.ringCenter}>
          <Text style={styles.count}>
            {made}
            <Text style={styles.countOf}> / {tries}</Text>
          </Text>
          <T style={{ fontSize: 13, color: colors.muted }}>
            {tries ? `${pct(made, tries)} %` : '0 %'} · encore {target - tries}
          </T>
        </View>
      </View>

      <BoltSays text={bolt.text} mood={bolt.mood} size={68} style={{ paddingHorizontal: space.lg }} />

      <View style={{ flex: 1 }} />

      <View style={styles.actions}>
        <Pressable onPress={() => shoot(false)} style={({ pressed }) => [styles.miss, pressed && { transform: [{ scale: 0.96 }] }]} accessibilityRole="button" accessibilityLabel="Tir raté">
          <Icon name="close" size={32} color={colors.muted} stroke={2.5} />
          <Text style={styles.btnText}>RATÉ</Text>
        </Pressable>
        <Pressable onPress={() => shoot(true)} style={({ pressed }) => [{ flex: 1 }, pressed && { transform: [{ scale: 0.96 }] }]} accessibilityRole="button" accessibilityLabel="Tir réussi">
          <Raquette fill={colors.orange} style={styles.hit}>
            <Icon name="hoop" size={34} color={colors.white} />
            <Text style={[styles.btnText, { color: colors.white }]}>DEDANS</Text>
          </Raquette>
        </Pressable>
      </View>
      <View style={styles.footer}>
        <Pressable onPress={undo} disabled={!tries} hitSlop={10} accessibilityRole="button">
          <T weight="semibold" style={{ color: tries ? colors.text : colors.line, fontSize: 13 }}>
            Annuler le dernier tir
          </T>
        </Pressable>
        <Pressable onPress={() => finish(made, tries)} disabled={!tries} hitSlop={10} accessibilityRole="button">
          <T weight="semibold" style={{ color: tries ? colors.orange : colors.line, fontSize: 13 }}>
            Terminer ici
          </T>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: 20, lineHeight: 28, color: colors.text },
  clock: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.surface, borderRadius: 999, height: 36, paddingHorizontal: 10 },
  clockText: { fontFamily: fonts.display, fontSize: 15, lineHeight: 21, color: colors.text },
  ringWrap: { alignSelf: 'center', width: RING, height: RING, marginTop: space.lg, marginBottom: space.md },
  ringCenter: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  count: { fontFamily: fonts.display, fontSize: 80, lineHeight: 104, color: colors.text },
  countOf: { fontSize: 34, color: colors.muted },
  actions: { flexDirection: 'row', gap: space.sm, paddingHorizontal: space.lg },
  miss: { flex: 1, height: 136, borderRadius: 24, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', gap: space.xs },
  hit: { height: 136, alignItems: 'center', justifyContent: 'center', gap: space.xs },
  btnText: { fontFamily: fonts.display, fontSize: 26, lineHeight: 34, letterSpacing: 1, color: colors.text },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space.lg + 4, marginTop: space.md, borderRadius: radius.chip },
});
