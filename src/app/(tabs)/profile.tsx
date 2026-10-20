import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/ActionButton';
import { Icon } from '@/components/Icon';
import { PlayerCard } from '@/components/PlayerCard';
import { Screen } from '@/components/Screen';
import { BlockTitle, Button, Chevrons, Eyebrow, T } from '@/components/ui';
import { g, positionLabel } from '@/lib/gender';
import { findModel, modelName, modelPhoto, programPct } from '@/lib/models';
import { age, apeIndex, category, GOALS, handLabel, levelLabel, meters, POSITION_SPOTS, profileComplete, shoeLabel, type OnboardingRoute } from '@/lib/profile';
import { streak } from '@/lib/stats';
import { LEVELS, levelInfo, totalXp } from '@/lib/xp';
import { usePlayer, type Player } from '@/store/player';
import { colors, fonts, radius, space, tiers } from '@/theme';

/** Profil : la carte au centre, le palier, le modèle et les réglages. */
export default function Profile() {
  const insets = useSafeAreaInsets();
  const { state } = usePlayer();
  const p = state.player;
  const model = findModel(p.model);
  const total = totalXp(state);
  const lvl = levelInfo(total);

  return (
    <Screen>
      <Text aria-hidden style={[styles.bignum, { color: p.color, top: insets.top - 40 }]}>
        {p.num}
      </Text>

      <View style={[styles.bar, { paddingTop: insets.top + space.md }]}>
        <View style={{ flex: 1 }}>
          <Eyebrow color={colors.orange}>{g(p.gender, 'Ta carte joueur', 'Ta carte joueuse')}</Eyebrow>
          <Text style={styles.title} numberOfLines={1}>
            {p.name.toUpperCase()} #{p.num}
          </Text>
        </View>
        <Pressable onPress={() => router.push('/settings')} style={styles.round} accessibilityRole="button" accessibilityLabel="Réglages" hitSlop={8}>
          <Icon name="gear" size={20} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <PlayerCard live />
        <T style={{ fontSize: 13, color: colors.muted, textAlign: 'center' }}>Incline ta carte du doigt.</T>
      </View>

      <View style={[styles.section, { gap: space.xs }]}>
        <ActionButton label="Partager ma carte" icon="share" onPress={() => router.push('/share-card')} />
        <Button label="Modifier mon maillot" icon="jersey" variant="ghost" onPress={() => router.push('/onboarding/jersey')} />
      </View>

      <View style={styles.section}>
        <BlockTitle action={{ label: 'Modifier', onPress: () => router.push('/onboarding/body') }}>Fiche joueur</BlockTitle>
        {!profileComplete(p) && (
          <Pressable onPress={() => router.push(firstMissing(p))} style={styles.complete} accessibilityRole="button">
            <Icon name="xp" size={18} color={colors.white} />
            <T weight="semibold" style={{ color: colors.white, flex: 1 }}>
              Complète ta fiche : Bolt adapte ton coaching
            </T>
            <Icon name="arrow" size={18} color={colors.white} />
          </Pressable>
        )}
        <View style={styles.fiche}>
          {[
            { label: 'Taille', value: p.height ? meters(p.height) : '', route: '/onboarding/body' },
            { label: 'Poids', value: p.weight ? `${p.weight} kg` : '', route: '/onboarding/body' },
            { label: 'Envergure', value: p.wingspan ? meters(p.wingspan) : '', sub: p.wingspan && p.height ? `Indice ${apeIndex(p.height, p.wingspan) > 0 ? '+' : ''}${apeIndex(p.height, p.wingspan)}` : '', route: '/onboarding/body' },
            { label: 'Âge', value: p.birthYear ? `${age(p.birthYear)} ans` : '', sub: category(p.birthYear), route: '/onboarding/profile' },
            { label: 'Poste', value: POSITION_SPOTS[p.position] ? `${POSITION_SPOTS[p.position].n} · ${positionLabel(p.position, p.gender)}` : positionLabel(p.position, p.gender), route: '/onboarding/game' },
            { label: 'Main forte', value: handLabel(p.hand, p.gender), route: '/onboarding/profile' },
            { label: 'Niveau', value: levelLabel(p.level), sub: p.persona === 'club' ? p.club : 'En autonome', route: '/onboarding/game' },
            { label: 'Chaussures', value: shoeLabel(p), sub: p.shoeSize ? `Pointure ${p.shoeSize}` : '', route: '/onboarding/shoes' },
          ].map((f) => (
            <Pressable key={f.label} onPress={() => router.push(f.route as OnboardingRoute)} style={({ pressed }) => [styles.fact, pressed && { opacity: 0.7 }]} accessibilityRole="button" accessibilityLabel={`${f.label} : ${f.value || 'à compléter'}`}>
              <Text style={styles.factLabel}>{f.label.toUpperCase()}</Text>
              <Text style={[styles.factValue, !f.value && { color: colors.muted }]} numberOfLines={1} adjustsFontSizeToFit>
                {f.value || '–'}
              </Text>
              {!!f.sub && (
                <T style={{ fontSize: 12, color: colors.muted }} numberOfLines={1}>
                  {f.sub}
                </T>
              )}
            </Pressable>
          ))}
        </View>
        {p.goals.length > 0 && (
          <Pressable onPress={() => router.push('/onboarding/goals')} style={styles.goals} accessibilityRole="button" accessibilityLabel={`Objectifs : ${p.goals.join(', ')}`}>
            <Text style={styles.factLabel}>OBJECTIFS</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.xs }}>
              {p.goals.map((v, i) => {
                const goal = GOALS.find((x) => x.value === v);
                return goal ? (
                  <View key={v} style={styles.goal}>
                    <Text style={styles.goalRank}>{i + 1}</Text>
                    <Icon name={goal.icon} size={16} color={colors.parquet} />
                    <T weight="semibold" style={{ fontSize: 13 }}>
                      {goal.label}
                    </T>
                  </View>
                ) : null;
              })}
            </View>
            {!!p.weeklyTarget && (
              <T style={{ fontSize: 12, color: colors.muted }}>
                Objectif : {p.weeklyTarget} séance{p.weeklyTarget > 1 ? 's' : ''} par semaine
              </T>
            )}
          </Pressable>
        )}
      </View>

      <View style={styles.section}>
        <BlockTitle detail={`${total.toLocaleString('fr-FR')} XP`}>Ton palier</BlockTitle>
        <View style={styles.block}>
          <View style={styles.tierRow}>
            {LEVELS.map((l, i) => {
              const on = i === lvl.index;
              const passed = i < lvl.index;
              return (
                <View key={l.name} style={[styles.tier, on && { backgroundColor: tiers[i].bg[1] }]} accessible accessibilityLabel={`${l.name}${on ? ', ton palier' : passed ? ', passé' : ''}`}>
                  <Text style={[styles.tierText, { color: on ? tiers[i].ink : passed ? colors.text : colors.muted }]} numberOfLines={1} adjustsFontSizeToFit>
                    {tiers[i].label}
                  </Text>
                </View>
              );
            })}
          </View>
          <Chevrons pct={lvl.pct} count={10} />
          <View style={styles.levelFoot}>
            <T style={{ fontSize: 13, color: colors.muted, flex: 1 }}>{lvl.next ? `Encore ${lvl.toNext.toLocaleString('fr-FR')} XP pour passer ${lvl.next}` : 'Palier maximum. Respect.'}</T>
            <View style={styles.streak}>
              <Icon name="streak" size={14} color={colors.orange} />
              <Text style={styles.streakNum}>{streak(state)}</Text>
              <T style={{ fontSize: 12, color: colors.muted }}>jours</T>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.section, { gap: space.xs }]}>
        <Pressable onPress={() => (model ? router.navigate({ pathname: '/stats', params: { tab: 'program' } }) : router.push('/onboarding/model'))} style={styles.row} accessibilityRole="button">
          {model && modelPhoto(model) ? (
            <Image source={modelPhoto(model)} style={styles.modelPhoto} contentFit="cover" contentPosition="top" />
          ) : (
            <View style={styles.rowIcon}>
              <Icon name="profile" size={20} color={colors.parquet} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <T style={{ fontSize: 12, color: colors.muted }}>{g(p.gender, 'Mon joueur modèle', 'Ma joueuse modèle')}</T>
            <T weight="semibold">{model ? modelName(model) : 'À choisir'}</T>
          </View>
          {model && <Text style={styles.rowPct}>{programPct(model, p.programDone)} %</Text>}
          <Icon name="arrow" size={18} color={colors.muted} />
        </Pressable>

        <Pressable onPress={() => router.push('/settings')} style={styles.row} accessibilityRole="button">
          <View style={styles.rowIcon}>
            <Icon name="gear" size={20} color={colors.parquet} />
          </View>
          <T weight="semibold" style={{ flex: 1 }}>
            Réglages et compte
          </T>
          <Icon name="arrow" size={18} color={colors.muted} />
        </Pressable>
      </View>
    </Screen>
  );
}

/** La première étape où il manque une info, pour les comptes créés avant la fiche joueur. */
function firstMissing(p: Player): OnboardingRoute {
  if (!p.birthYear || !p.hand) return '/onboarding/profile';
  if (!p.height || !p.weight) return '/onboarding/body';
  if (!p.level) return '/onboarding/game';
  if (!p.shoeBrand) return '/onboarding/shoes';
  return '/onboarding/goals';
}

const styles = StyleSheet.create({
  complete: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.orange, borderRadius: radius.tile, paddingVertical: space.sm, paddingHorizontal: 14, marginBottom: space.xs },
  fiche: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  fact: { flexBasis: '48%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: radius.tile, paddingVertical: space.sm, paddingHorizontal: 14 },
  factLabel: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.2, color: colors.muted },
  factValue: { fontFamily: fonts.display, fontSize: 22, lineHeight: 31, color: colors.text },
  goals: { backgroundColor: colors.surface, borderRadius: radius.tile, paddingVertical: space.sm, paddingHorizontal: 14, gap: space.xs, marginTop: space.xs },
  goal: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface2, borderRadius: radius.chip, paddingHorizontal: 10, height: 34 },
  goalRank: { fontFamily: fonts.display, fontSize: 14, lineHeight: 20, color: colors.orange },
  bignum: { position: 'absolute', right: -10, fontFamily: fonts.display, fontSize: 260, lineHeight: 360, opacity: 0.1 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg },
  title: { fontFamily: fonts.display, fontSize: 36, lineHeight: 50, color: colors.text },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  card: { alignItems: 'center', gap: space.sm, marginTop: space.md },
  section: { paddingHorizontal: space.lg, marginTop: space.lg },
  block: { backgroundColor: colors.surface, borderRadius: radius.block, padding: space.md, gap: space.sm },
  tierRow: { flexDirection: 'row', gap: space.xxs },
  tier: { flex: 1, height: 30, borderRadius: 8, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  tierText: { fontFamily: fonts.display, fontSize: 12, lineHeight: 17, letterSpacing: 0.5 },
  levelFoot: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface2, borderRadius: 999, paddingHorizontal: 10, height: 30 },
  streakNum: { fontFamily: fonts.display, fontSize: 15, lineHeight: 21, color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, backgroundColor: colors.surface, borderRadius: radius.tile, paddingVertical: space.sm, paddingHorizontal: 14 },
  rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  rowPct: { fontFamily: fonts.display, fontSize: 18, lineHeight: 25, color: colors.orange },
  modelPhoto: { width: 40, height: 48, borderRadius: 10 },
});
