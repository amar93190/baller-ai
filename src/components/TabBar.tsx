import type { BottomTabBarProps } from 'expo-router/js-tabs';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Raquette } from '@/components/Raquette';
import { overall } from '@/lib/stats';
import { usePlayer } from '@/store/player';
import { colors, fonts, space } from '@/theme';

const TABS: Record<string, { label: string; icon: IconName }> = {
  home: { label: 'Accueil', icon: 'home' },
  training: { label: 'Séance', icon: 'session' },
  profile: { label: 'Carte', icon: 'card' },
  stats: { label: 'Stats', icon: 'stats' },
  coach: { label: 'Coach', icon: 'coach' },
};

/** Barre d'onglets Baller : 4 icônes maison et, au centre, la carte du joueur en forme de Raquette. */
export function TabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { state: player } = usePlayer();
  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom - 6, space.sm) }]} pointerEvents="box-none">
      <View style={styles.bar} accessibilityRole="tablist">
        {state.routes.map((route, i) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const focused = i === state.index;
          const press = () => {
            Haptics.selectionAsync().catch(() => {});
            const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigateToTab(route.key);
          };
          if (route.name === 'profile') {
            return (
              <Pressable key={route.key} onPress={press} style={styles.center} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel="Ma carte">
                <Raquette fill={focused ? colors.text : colors.orange} style={styles.cardBtn}>
                  <Text style={[styles.cardNum, focused && { color: colors.bg }]}>{overall(player)}</Text>
                  <Text style={[styles.cardLabel, focused && { color: colors.bg }]}>CARTE</Text>
                </Raquette>
              </Pressable>
            );
          }
          const tint = focused ? colors.orange : colors.muted;
          return (
            <Pressable key={route.key} onPress={press} style={styles.tab} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={tab.label}>
              <Icon name={tab.icon} size={23} color={tint} />
              <Text style={[styles.label, { color: tint }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 14, right: 14 },
  bar: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  tab: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', gap: 3 },
  label: { fontFamily: fonts.semibold, fontSize: 10 },
  center: { flex: 1, alignItems: 'center' },
  cardBtn: { width: 58, height: 72, marginTop: -30, alignItems: 'center', justifyContent: 'center', paddingTop: 6 },
  cardNum: { fontFamily: fonts.display, fontSize: 22, lineHeight: 30, color: colors.white },
  cardLabel: { fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: 1, color: colors.white, marginTop: -2 },
});
