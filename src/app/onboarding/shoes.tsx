import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Shoe } from '@/components/Illustrations';
import { OnboardingScreen } from '@/components/Onboarding';
import { BlockTitle, Chips, Field, Stepper } from '@/components/ui';
import { defaults, shoeLabel, SHOES } from '@/lib/profile';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

/** Étape 4 : la paire avec laquelle on joue. Marque, gamme (ou modèle libre) et pointure. */
export default function OnboardingShoes() {
  const { state, updatePlayer } = usePlayer();
  const p = state.player;
  const [brand, setBrand] = useState(p.shoeBrand);
  const [model, setModel] = useState(p.shoeModel);
  const [size, setSize] = useState(p.shoeSize || defaults(p.gender).shoeSize);
  const lines = SHOES.find((s) => s.brand === brand)?.lines ?? [];
  const name = shoeLabel({ shoeBrand: brand, shoeModel: model.trim() });

  return (
    <OnboardingScreen
      route="/onboarding/shoes"
      title={['Tes ', 'chaussures']}
      bolt={{ text: 'Ta paire compte : amorti, maintien, accroche. Dis-moi avec quoi tu joues.', mood: 'chill' }}
      onSubmit={() => updatePlayer({ shoeBrand: brand, shoeModel: model.trim(), shoeSize: size })}
      canSubmit={!!brand}>
      <View style={styles.stage}>
        <Text aria-hidden style={styles.bigSize}>
          {size}
        </Text>
        <Shoe color={p.color} width={230} />
        <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
          {name ? name.toUpperCase() : 'TA PAIRE'}
        </Text>
      </View>

      <View>
        <BlockTitle>Marque</BlockTitle>
        <Chips
          options={SHOES.map((s) => s.brand)}
          value={brand}
          onChange={(b) => {
            setBrand(b);
            // On garde le modèle saisi seulement s'il ne vient pas d'une autre marque.
            if (SHOES.some((s) => s.brand !== b && s.lines.includes(model))) setModel('');
          }}
        />
      </View>

      {!!brand && (
        <View style={{ gap: space.sm }}>
          {lines.length > 0 && (
            <View>
              <BlockTitle detail="Ou écris-le en dessous">Modèle</BlockTitle>
              <Chips options={lines} value={model} onChange={setModel} />
            </View>
          )}
          <Field label={lines.length ? 'Modèle exact (facultatif)' : 'Modèle'} value={model} onChangeText={setModel} placeholder={lines.length ? `Ex. ${lines[0]} 5` : 'Ex. ma paire de salle'} maxLength={30} />
        </View>
      )}

      <Stepper big label="Pointure (EU)" value={size} min={30} max={52} onChange={setSize} />
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  stage: { height: 210, borderRadius: radius.block, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', gap: space.xxs },
  bigSize: { position: 'absolute', right: -8, top: -36, fontFamily: fonts.display, fontSize: 200, lineHeight: 280, color: colors.text, opacity: 0.06 },
  name: { fontFamily: fonts.display, fontSize: 20, lineHeight: 28, color: colors.text, paddingHorizontal: space.md },
});
