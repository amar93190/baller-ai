import { ScrollView, StyleSheet, View } from 'react-native';

import { Display, T } from '@/components/ui';
import { LEGAL_UPDATED } from '@/lib/config';
import { colors } from '@/theme';

export type LegalSection = { title: string; body: string[] };

/** Mise en page commune des pages légales. */
export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.inner}>
      <Display style={{ fontSize: 30 }}>{title}</Display>
      <T style={{ fontSize: 12, color: colors.muted }}>Mise à jour le {LEGAL_UPDATED}</T>
      <T style={styles.p}>{intro}</T>
      {sections.map((s, i) => (
        <View key={s.title} style={{ gap: 8 }}>
          <T weight="semibold" style={{ fontSize: 16 }}>
            {i + 1}. {s.title}
          </T>
          {s.body.map((p) => (
            <T key={p} style={styles.p}>
              {p}
            </T>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inner: { padding: 22, paddingTop: 28, gap: 16, paddingBottom: 60 },
  p: { fontSize: 14, lineHeight: 22, color: colors.muted },
});
