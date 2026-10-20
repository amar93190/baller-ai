import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BoltSays } from '@/components/Bolt';
import { Icon } from '@/components/Icon';
import { MissionTiles } from '@/components/Missions';
import { PlayerCard } from '@/components/PlayerCard';
import { Screen } from '@/components/Screen';
import { BlockTitle, Chevrons, Eyebrow, T } from '@/components/ui';
import { boltHome } from '@/lib/bolt';
import { g } from '@/lib/gender';
import { missionsFor } from '@/lib/missions';
import { findModel, modelName, modelPhoto, programPct } from '@/lib/models';
import { fmtDate, fmtToday, streak } from '@/lib/stats';
import { levelInfo, totalXp, XP } from '@/lib/xp';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { state } = usePlayer();
  const p = state.player;
  const lvl = levelInfo(totalXp(state));
  const bolt = boltHome(state);
  const missions = missionsFor(state);
  const done = missions.filter((m) => m.done).length;
  const last = state.matches[state.matches.length - 1];
  const model = findModel(p.model);
  const nextDrill = model?.drills.find((d) => !p.programDone.includes(d.id));

  return (
    <Screen>
      <View aria-hidden style={styles.arc} />

      <View style={[styles.bar, { paddingTop: insets.top + space.xs }]}>
        <Image source={require('../../../assets/images/logo.png')} style={{ width: 38, height: 35 }} contentFit="contain" accessibilityLabel="Baller" />
        <View style={styles.streak} accessibilityLabel={`${streak(state)} jours de série`}>
          <Icon name="streak" size={16} color={colors.orange} />
          <Text style={styles.streakNum}>{streak(state)}</Text>
          <T style={{ fontSize: 12, color: colors.muted }}>jours</T>
        </View>
      </View>

      <View style={styles.hero}>
        <Pressable onPress={() => router.navigate('/profile')} accessibilityLabel="Voir ma carte">
          <PlayerCard width={150} />
        </Pressable>
        <View style={{ flex: 1, gap: space.xs }}>
          <Eyebrow color={colors.orange}>{fmtToday()}</Eyebrow>
          <Text style={styles.hello} numberOfLines={2}>
            YO {p.name.toUpperCase()}.
          </Text>
          <T style={{ fontSize: 13, lineHeight: 19, color: '#C9C4BC' }}>
            {lvl.next ? (
              <>
                Encore <T weight="bold">{lvl.toNext} XP</T> et tu passes <T weight="bold">{lvl.next}</T>.
              </>
            ) : (
              'Palier maximum. Respect.'
            )}
          </T>
          <Chevrons pct={lvl.pct} />
        </View>
      </View>

      <View style={styles.section}>
        <BoltSays text={bolt.text} mood={bolt.mood} />
      </View>

      <View style={styles.section}>
        <BlockTitle detail={`${done} sur ${missions.length} · +${XP.allMissionsBonus} XP si tout est fait`}>Missions du jour</BlockTitle>
        <MissionTiles />
      </View>

      <View style={styles.section}>
        <Pressable onPress={() => (model ? router.navigate('/training') : router.push('/onboarding/model'))} style={styles.program} accessibilityRole="button">
          <Image source={(model && modelPhoto(model)) || require('../../../assets/images/court.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" transition={200} />
          <LinearGradient colors={['rgba(11,11,12,0.94)', 'rgba(11,11,12,0.25)']} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          <Eyebrow color="#FF8A5E">{model ? `Programme ${modelName(model)} · ${programPct(model, p.programDone)} %` : 'Programme pro'}</Eyebrow>
          <Text style={styles.programTitle} numberOfLines={2}>
            {model ? (nextDrill ? nextDrill.title : 'Programme terminé') : g(p.gender, 'Choisis ton joueur modèle', 'Choisis ta joueuse modèle')}
          </Text>
          <T style={{ fontSize: 12, color: '#C9C4BC' }}>{model ? `+${XP.drill} XP par exercice` : 'Et reçois son programme'}</T>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.matchRow} onPress={() => (last ? router.navigate({ pathname: '/stats', params: { tab: 'matches' } }) : router.push('/add-match'))} accessibilityRole="button">
          <View style={styles.matchIcon}>
            <Icon name="match" size={20} color={colors.parquet} />
          </View>
          {last ? (
            <View style={{ flex: 1 }}>
              <T weight="semibold">
                {last.us > last.them ? 'Victoire' : 'Défaite'} {last.us}–{last.them} contre {last.opp}
              </T>
              <T style={{ fontSize: 13, color: colors.muted }}>
                {fmtDate(last.date)} · {last.pts} pts, {last.reb} reb, {last.ast} pd
              </T>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <T weight="semibold">Pas encore de match</T>
              <T style={{ fontSize: 13, color: colors.muted }}>Ajoute ton premier match en 1 minute.</T>
            </View>
          )}
          <Icon name="arrow" size={18} color={colors.muted} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  arc: { position: 'absolute', left: -120, top: -330, width: 630, height: 630, borderRadius: 315, borderWidth: 1.5, borderColor: '#1F2023' },
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.lg },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: space.sm, height: 36 },
  streakNum: { fontFamily: fonts.display, fontSize: 17, lineHeight: 24, color: colors.text },
  hero: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, marginTop: space.md },
  hello: { fontFamily: fonts.display, fontSize: 32, lineHeight: 42, color: colors.text },
  section: { paddingHorizontal: space.lg, marginTop: space.lg },
  program: { height: 128, borderRadius: radius.block, overflow: 'hidden', padding: space.md, justifyContent: 'center', gap: 2, backgroundColor: colors.black },
  programTitle: { fontFamily: fonts.display, fontSize: 24, lineHeight: 33, color: colors.white, textTransform: 'uppercase', maxWidth: '80%' },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.tile, paddingVertical: space.sm, paddingHorizontal: 14 },
  matchIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
});
