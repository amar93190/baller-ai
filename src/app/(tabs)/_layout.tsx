import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/TabBar';
import { colors } from '@/theme';

/** Onglets Baller : barre maison avec la carte du joueur au centre. */
export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="training" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="coach" />
    </Tabs>
  );
}
