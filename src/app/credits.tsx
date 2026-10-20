import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Display, T } from '@/components/ui';
import { findModel, modelName, PHOTO_CREDITS } from '@/lib/models';
import { colors } from '@/theme';

/** Crédits imposés par les licences Creative Commons des photos de joueurs. */
export default function Credits() {
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.inner}>
      <Display style={{ fontSize: 30 }}>Crédits photos</Display>
      <T style={{ color: colors.muted, fontSize: 13, lineHeight: 20 }}>
        Photos des joueurs et joueuses : Wikimedia Commons, recadrées et retouchées. Chaque photo reste sous sa licence d’origine.
      </T>
      <View style={{ gap: 2 }}>
        {PHOTO_CREDITS.map((c) => {
          const m = findModel(c.id);
          return (
            <Pressable key={c.id} onPress={() => Linking.openURL(c.source).catch(() => {})} style={styles.row}>
              <T weight="semibold">{m ? modelName(m) : c.id}</T>
              <T style={{ fontSize: 12, color: colors.muted }}>
                {c.author} · {c.license}
              </T>
            </Pressable>
          );
        })}
      </View>
      <T style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>Autres photos : Unsplash. Touche une ligne pour voir la source.</T>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inner: { padding: 22, paddingTop: 28, gap: 14, paddingBottom: 40 },
  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
});
