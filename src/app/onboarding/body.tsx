import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ReachScale } from '@/components/Illustrations';
import { OnboardingScreen } from '@/components/Onboarding';
import { BlockTitle, Stepper, T } from '@/components/ui';
import { apeIndex, defaults } from '@/lib/profile';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

/** Étape 2 : taille, poids, envergure. Le dessin montre la main bras levé face au cercle. */
export default function OnboardingBody() {
  const { state, updatePlayer } = usePlayer();
  const p = state.player;
  const d = defaults(p.gender);
  const [height, setHeight] = useState(p.height || d.height);
  const [weight, setWeight] = useState(p.weight || d.weight);
  const [wingspan, setWingspan] = useState(p.wingspan || p.height || d.height);
  const ape = apeIndex(height, wingspan);

  return (
    <OnboardingScreen
      route="/onboarding/body"
      title={['Ton ', 'gabarit']}
      bolt={{ text: 'Pas de mètre sous la main ? Une estimation suffit, tu pourras corriger plus tard.', mood: 'focus' }}
      onSubmit={() => updatePlayer({ height, weight, wingspan })}>
      <ReachScale height={height} wingspan={wingspan} color={p.color} />

      <View style={styles.row}>
        <Stepper big label="Taille (cm)" value={height} min={120} max={230} onChange={setHeight} />
        <Stepper big label="Poids (kg)" value={weight} min={30} max={160} onChange={setWeight} />
      </View>

      <View>
        <BlockTitle detail="Bras écartés, bout des doigts">Envergure</BlockTitle>
        <View style={styles.row}>
          <Stepper big label="Envergure (cm)" value={wingspan} min={110} max={250} onChange={setWingspan} />
          <View style={styles.ape} accessible accessibilityLabel={`Indice d'envergure ${ape > 0 ? '+' : ''}${ape} centimètres`}>
            <Text style={[styles.apeNum, ape > 0 && { color: colors.good }]}>
              {ape > 0 ? '+' : ''}
              {ape}
            </Text>
            <T style={styles.apeLabel}>INDICE</T>
          </View>
        </View>
        <T style={styles.hint}>
          {ape >= 5 ? 'Bras longs : un vrai atout en défense et au rebond.' : ape <= -5 ? 'Bras courts : mise sur ton placement et ta vitesse.' : 'Envergure égale à ta taille, comme la plupart des joueurs.'}
        </T>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.xs },
  ape: { width: 96, backgroundColor: colors.surface, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center' },
  apeNum: { fontFamily: fonts.display, fontSize: 30, lineHeight: 42, color: colors.text },
  apeLabel: { fontSize: 11, letterSpacing: 1.2, color: colors.muted },
  hint: { fontSize: 13, color: colors.muted, marginTop: space.xs, lineHeight: 19 },
});
