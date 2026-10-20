import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Button, Card, Eyebrow, T, useAccent } from '@/components/ui';
import { g } from '@/lib/gender';
import { findModel, modelName, modelPhoto, programPct } from '@/lib/models';
import { usePlayer } from '@/store/player';
import { colors, displayLineHeight, fonts } from '@/theme';

/** Le joueur modèle choisi à l'inscription et son programme, avec la progression en %. */
export function ModelProgram() {
  const { state, toggleDrill } = usePlayer();
  const { accent } = useAccent();
  const model = findModel(state.player.model);

  if (!model) {
    return (
      <Card style={{ gap: 10 }}>
        <Eyebrow>Mon style de jeu</Eyebrow>
        <T style={{ color: colors.muted, fontSize: 13 }}>{g(state.player.gender, 'Choisis un joueur modèle pour recevoir un programme d’entraînement à son image.', 'Choisis une joueuse modèle pour recevoir un programme d’entraînement à son image.')}</T>
        <Button label="Choisir mon modèle" icon="arrow" onPress={() => router.push('/onboarding/model')} />
      </Card>
    );
  }

  const done = state.player.programDone;
  const pct = programPct(model, done);
  const count = model.drills.filter((d) => done.includes(d.id)).length;

  return (
    <Card style={{ gap: 14 }}>
      <View style={styles.head}>
        {modelPhoto(model) && <Image source={modelPhoto(model)} style={[styles.photo, { borderColor: accent }]} contentFit="cover" contentPosition="top" />}
        <View style={{ flex: 1, gap: 2 }}>
          <Eyebrow>Mon style de jeu</Eyebrow>
          <Text style={styles.title} numberOfLines={2}>
            Comme {modelName(model)}
          </Text>
          <T style={{ color: colors.muted, fontSize: 12.5, lineHeight: 19 }}>{model.style}</T>
        </View>
        <Text style={[styles.pct, { color: accent }]}>{pct}%</Text>
      </View>

      <View>
        <View style={styles.track}>
          <View style={{ width: `${pct}%`, height: '100%', backgroundColor: accent, borderRadius: 4 }} />
        </View>
        <T style={{ fontSize: 12, color: colors.muted, marginTop: 6 }}>
          {pct === 100 ? 'Programme terminé, bravo !' : `${count} exercice${count > 1 ? 's' : ''} sur ${model.drills.length} · touche un exercice quand tu l’as fait`}
        </T>
      </View>

      <View>
        {model.drills.map((d, i) => {
          const ok = done.includes(d.id);
          return (
            <Pressable
              key={d.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                toggleDrill(d.id);
              }}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: ok }}
              style={[styles.drill, i < model.drills.length - 1 && styles.border]}>
              <View style={[styles.check, ok && { backgroundColor: accent, borderColor: accent }]}>{ok && <Icon name="check" size={12} color={colors.white} />}</View>
              <View style={{ flex: 1, opacity: ok ? 0.55 : 1 }}>
                <T weight="semibold">{d.title}</T>
                <T style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>{d.detail}</T>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={() => router.push('/onboarding/model')} hitSlop={8} style={{ alignSelf: 'flex-start' }}>
        <T weight="semibold" style={{ fontSize: 13, color: accent }}>
          Changer de modèle
        </T>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  photo: { width: 64, height: 80, borderRadius: 14, borderWidth: 2 },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: displayLineHeight(26), color: colors.text, textTransform: 'uppercase' },
  pct: { fontFamily: fonts.display, fontSize: 38 },
  track: { height: 8, borderRadius: 4, backgroundColor: colors.surface2, overflow: 'hidden' },
  drill: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  border: { borderBottomWidth: 1, borderBottomColor: colors.line },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
});
