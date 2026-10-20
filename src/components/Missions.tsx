import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { T } from '@/components/ui';
import { missionsFor, type Mission } from '@/lib/missions';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

export function go(m: Mission) {
  if (m.action === 'shots') router.push({ pathname: '/session', params: { drill: m.drill, target: String(m.target) } });
  else if (m.action === 'coach') router.navigate('/coach');
  else if (m.action === 'model') router.push('/onboarding/model');
  else router.navigate('/training');
}

const styles = StyleSheet.create({
  tile: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.tile, paddingVertical: space.sm, paddingHorizontal: 14 },
  tileNext: { backgroundColor: colors.orange },
  tileIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  tileXp: { fontFamily: fonts.display, fontSize: 17 },
});

const MISSION_ICON: Record<Mission['action'], IconName> = { shots: 'shot', program: 'dribble', coach: 'coach', model: 'profile' };

/** Missions du jour en tuiles : faite (grisée), suivante (orange), à venir. */
export function MissionTiles() {
  const { state } = usePlayer();
  const missions = missionsFor(state);
  const next = missions.find((m) => !m.done);
  return (
    <View style={{ gap: space.xs }}>
      {missions.map((m) => {
        const isNext = m === next;
        const progress = m.target > 1 ? `${m.progress} sur ${m.target}` : m.detail;
        return (
          <Pressable
            key={m.id}
            onPress={() => !m.done && go(m)}
            disabled={m.done}
            accessibilityRole="button"
            accessibilityLabel={`${m.title}, ${m.done ? 'faite' : progress}, ${m.xp} XP`}
            style={({ pressed }) => [styles.tile, isNext && styles.tileNext, m.done && { opacity: 0.6 }, pressed && { transform: [{ scale: 0.98 }] }]}>
            <View style={[styles.tileIcon, isNext && { backgroundColor: 'rgba(0,0,0,0.18)' }, m.done && { backgroundColor: colors.goodSoft }]}>
              <Icon name={m.done ? 'check' : MISSION_ICON[m.action]} size={20} color={m.done ? colors.good : isNext ? colors.white : colors.parquet} />
            </View>
            <View style={{ flex: 1 }}>
              <T weight="semibold" style={[{ fontSize: 15 }, m.done && { textDecorationLine: 'line-through' }, isNext && { color: colors.white }]} numberOfLines={1}>
                {m.title}
              </T>
              <T style={{ fontSize: 13, color: isNext ? 'rgba(255,255,255,0.88)' : colors.muted }} numberOfLines={1}>
                {m.done ? 'Faite' : progress}
              </T>
            </View>
            <Text style={[styles.tileXp, { color: m.done ? colors.good : isNext ? colors.white : colors.muted }]}>+{m.xp}</Text>
            {isNext && <Icon name="arrow" size={18} color={colors.white} />}
          </Pressable>
        );
      })}
    </View>
  );
}
