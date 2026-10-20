import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View, type ViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { ActionButton } from '@/components/ActionButton';
import { Icon } from '@/components/Icon';
import { PlayerCard } from '@/components/PlayerCard';
import { Rays } from '@/components/Rays';
import { T } from '@/components/ui';
import { overall, streak } from '@/lib/stats';
import { levelInfo, totalXp } from '@/lib/xp';
import { usePlayer } from '@/store/player';
import { colors, fonts, space, tiers } from '@/theme';

/** Story à partager (format 9:16) : la carte, le palier et la signature Baller. */
export default function ShareCard() {
  const insets = useSafeAreaInsets();
  const { state } = usePlayer();
  const story = useRef<ViewInstance>(null);
  const [busy, setBusy] = useState(false);
  const tier = tiers[levelInfo(totalXp(state)).index];

  const share = async () => {
    setBusy(true);
    try {
      const uri = await captureRef(story, { format: 'png', quality: 1, width: 1080, height: 1920 });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: 'Partager ma carte' });
      else await Share.share({ url: uri });
    } catch {
      await Share.share({ message: `Ma carte Baller : ${state.player.name} #${state.player.num}, note ${overall(state)}, palier ${tier.label}.` }).catch(() => {});
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + space.sm, paddingBottom: insets.bottom + space.md }]}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.round} accessibilityLabel="Fermer" hitSlop={8}>
          <Icon name="close" size={18} />
        </Pressable>
        <T weight="semibold" style={{ fontSize: 15 }}>
          Ta story
        </T>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.previewWrap}>
        <View ref={story} collapsable={false} style={styles.story}>
          <Rays size={700} top={250} glow />
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} contentFit="contain" />
          <Text style={styles.tier}>{tier.label}</Text>
          <PlayerCard width={158} />
          <View style={styles.facts}>
            <View style={styles.fact}>
              <Text style={styles.factNum}>{overall(state)}</Text>
              <Text style={styles.factLabel}>NOTE</Text>
            </View>
            <View style={styles.fact}>
              <Text style={styles.factNum}>{streak(state)}</Text>
              <Text style={styles.factLabel}>JOURS DE SÉRIE</Text>
            </View>
            <View style={styles.fact}>
              <Text style={styles.factNum}>{state.shots.reduce((n, x) => n + x.att, 0)}</Text>
              <Text style={styles.factLabel}>TIRS</Text>
            </View>
          </View>
          <Text style={styles.slogan}>JOUE POUR TA CARTE.</Text>
          <Text style={styles.brand}>BALLER</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: space.lg, gap: space.sm }}>
        <ActionButton label={busy ? 'Préparation…' : 'Partager en story'} icon="share" onPress={() => !busy && share()} />
        <T style={{ textAlign: 'center', fontSize: 12, color: colors.muted }}>Instagram, TikTok, Snapchat ou en message.</T>
      </View>
    </View>
  );
}

const STORY_W = 270;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  previewWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: space.md },
  story: {
    width: STORY_W,
    height: (STORY_W * 16) / 9,
    backgroundColor: colors.bg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: space.md,
    paddingBottom: space.md,
    justifyContent: 'space-between',
  },
  logo: { width: 34, height: 32 },
  tier: { fontFamily: fonts.display, fontSize: 26, lineHeight: 34, color: colors.orange, letterSpacing: 1 },
  facts: { flexDirection: 'row', gap: space.md },
  fact: { alignItems: 'center' },
  factNum: { fontFamily: fonts.display, fontSize: 22, lineHeight: 30, color: colors.text },
  factLabel: { fontFamily: fonts.semibold, fontSize: 7.5, letterSpacing: 1, color: colors.muted },
  slogan: { fontFamily: fonts.display, fontSize: 18, lineHeight: 25, color: colors.text },
  brand: { fontFamily: fonts.display, fontSize: 11, lineHeight: 15, letterSpacing: 4, color: colors.muted },
});
