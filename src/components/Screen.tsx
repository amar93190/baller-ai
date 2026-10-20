import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

/** Écran défilant plein cadre. Laisse de la place sous la barre d'onglets. */
export function Screen({ children, bar = 'light', tabs = true }: { children: ReactNode; bar?: 'light' | 'dark'; tabs?: boolean }) {
  const insets = useSafeAreaInsets();
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(bar);
    }, [bar]),
  );
  // Même structure que l'écran Coach : la photo du haut passe derrière la barre d'état.
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + (tabs ? 100 : 30) }} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}
