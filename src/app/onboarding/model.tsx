import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Jersey } from '@/components/Jersey';
import { ActionButton } from '@/components/ActionButton';
import { Card, Chips, Display, Steps, T, useAccent } from '@/components/ui';
import { g, positionLabel } from '@/lib/gender';
import { modelName, modelPhoto, modelsFor, type PlayerModel } from '@/lib/models';
import { ONBOARDING, stepOf } from '@/lib/profile';
import { positions } from '@/lib/stats';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius } from '@/theme';

const GAP = 12;
const SIDE = 22;

/** Étape 2 : choisir un joueur ou une joueuse modèle selon son poste. Son programme arrive dans Entraînement. */
export default function OnboardingModel() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { state, updatePlayer, chooseModel } = usePlayer();
  const { accent } = useAccent();
  const p = state.player;
  const editing = state.onboarded;
  const list = modelsFor(p.position, p.gender);
  const selected = list.find((m) => m.id === p.model);
  const cardWidth = (width - SIDE * 2 - GAP) / 2;

  const next = () => {
    if (!selected) return;
    if (editing) router.back();
    else router.push('/onboarding/jersey');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[styles.inner, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}>
        <Steps step={editing ? undefined : stepOf('/onboarding/model')} total={ONBOARDING.length} onBack={() => router.back()} />
        <Display style={{ fontSize: 44 }}>
          Ton <Display style={{ fontSize: 44, color: accent }}>modèle</Display>
        </Display>
        <T style={{ color: colors.muted, lineHeight: 21 }}>{g(p.gender, 'Touche le joueur dont tu veux t’inspirer.', 'Touche la joueuse dont tu veux t’inspirer.')} Tu recevras un programme à son image.</T>

        {editing ? (
          <Chips
            options={positions.map((x) => positionLabel(x.label, p.gender))}
            value={positionLabel(p.position, p.gender)}
            onChange={(label) => updatePlayer({ position: positions.find((x) => positionLabel(x.label, p.gender) === label)?.label ?? p.position })}
          />
        ) : (
          <T weight="semibold" style={{ fontSize: 13 }}>
            Poste : <T weight="semibold" style={{ fontSize: 13, color: accent }}>{positionLabel(p.position, p.gender)}</T>
          </T>
        )}

        <View style={styles.grid}>
          {list.map((m, i) => (
            <FloatingCard
              key={m.id}
              model={m}
              index={i}
              width={cardWidth}
              selected={m.id === selected?.id}
              dimmed={!!selected && m.id !== selected.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                chooseModel(m.id);
              }}
            />
          ))}
        </View>

        {selected && (
          <Card style={{ gap: 6 }}>
            <Text style={styles.selName}>{modelName(selected).toUpperCase()}</Text>
            <T style={{ color: colors.muted, fontSize: 13, lineHeight: 20 }}>{selected.style}</T>
            <T style={{ fontSize: 12, color: accent }}>Programme : {selected.drills.length} exercices · {selected.traits.join(' · ')}</T>
          </Card>
        )}

        <ActionButton label={editing ? 'Enregistrer' : 'Continuer'} icon={editing ? 'check' : 'arrow'} onPress={next} disabled={!selected} style={{ marginTop: 4 }} />
      </ScrollView>
    </View>
  );
}

/** Carte qui flotte doucement. Sélectionnée : elle grossit et s'illumine ; les autres s'estompent. */
function FloatingCard({
  model,
  index,
  width,
  selected,
  dimmed,
  onPress,
}: {
  model: PlayerModel;
  index: number;
  width: number;
  selected: boolean;
  dimmed: boolean;
  onPress: () => void;
}) {
  const { accent } = useAccent();
  const [float] = useState(() => new Animated.Value(0));
  const [focus] = useState(() => new Animated.Value(selected ? 1 : 0));

  // Lévitation : chaque carte monte et descend avec un léger décalage.
  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce) return;
      loop = Animated.loop(
        Animated.sequence([
          Animated.delay(index * 350),
          Animated.timing(float, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(float, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      );
      loop.start();
    });
    return () => loop?.stop();
  }, [float, index]);

  useEffect(() => {
    Animated.spring(focus, { toValue: selected ? 1 : 0, friction: 6, tension: 120, useNativeDriver: true }).start();
  }, [focus, selected]);

  const photo = modelPhoto(model);
  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });
  const scale = focus.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });

  return (
    <Animated.View
      style={[
        styles.shadow,
        selected && { shadowColor: accent, shadowOpacity: 0.55 },
        { width, opacity: dimmed ? 0.45 : 1, transform: [{ translateY }, { scale }] },
      ]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={modelName(model)}
        style={[styles.card, selected && { borderColor: accent }]}>
        {photo ? (
          <>
            <Image source={photo} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" transition={200} />
            {/* Fondu vers le bas pour lire le nom, et reflet de la couleur d'équipe quand la carte est choisie */}
            <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.35)', colors.surface]} locations={[0.35, 0.6, 1]} style={StyleSheet.absoluteFill} />
            {selected && <LinearGradient colors={[accent + '66', 'transparent']} locations={[0, 0.55]} style={StyleSheet.absoluteFill} />}
            <View style={[styles.numPill, selected && { backgroundColor: accent }]}>
              <Text style={styles.photoNum}>{model.num}</Text>
            </View>
          </>
        ) : (
          <>
            <LinearGradient
              colors={selected ? [accent + '55', 'transparent'] : ['rgba(255,255,255,0.06)', 'transparent']}
              locations={[0, 0.7]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.jersey}>
              <Jersey color={selected ? accent : colors.surface2} num={model.num} size={86} />
            </View>
          </>
        )}
        <T weight="semibold" style={styles.name} numberOfLines={2}>
          {modelName(model)}
        </T>
        <T style={styles.trait} numberOfLines={1}>
          {model.traits[0]}
        </T>
        {selected && (
          <View style={[styles.tick, { backgroundColor: accent }]}>
            <Icon name="check" size={12} color={colors.white} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  inner: { paddingHorizontal: SIDE, gap: 14, flexGrow: 1 },
  selName: { fontFamily: fonts.display, fontSize: 22, lineHeight: 30, color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingVertical: 8 },
  card: {
    height: 230,
    borderRadius: radius.block,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.line,
    padding: 14,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  // L'ombre est sur le conteneur : sur iOS, une vue qui rogne son contenu coupe aussi son ombre.
  shadow: { borderRadius: radius.block, backgroundColor: colors.surface, shadowColor: '#000000', shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  jersey: { position: 'absolute', top: 14, alignSelf: 'center', left: 0, right: 0, alignItems: 'center' },
  name: { fontSize: 15, lineHeight: 20 },
  trait: { fontSize: 11.5, color: 'rgba(244,241,236,0.75)', marginTop: 2 },
  numPill: { position: 'absolute', top: 10, left: 10, minWidth: 34, height: 28, paddingHorizontal: 8, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  photoNum: { fontFamily: fonts.display, fontSize: 16, color: colors.white },
  tick: { position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
