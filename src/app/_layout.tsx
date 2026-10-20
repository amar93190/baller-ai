import { Anton_400Regular } from '@expo-google-fonts/anton';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';

import { DevRemote } from '@/components/DevRemote';
import { Intro } from '@/components/Intro';
import { initSounds } from '@/lib/sounds';
import { PlayerProvider, usePlayerOptional } from '@/store/player';
import { SessionProvider, useSession } from '@/store/session';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();
initSounds();

// Avertissement sans conséquence des animations en boucle (cartes qui flottent), visible seulement en développement.
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered']);

// Fond noir partout, pour éviter les flashs clairs entre les écrans.
const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bg, card: colors.surface, text: colors.text, primary: colors.orange } };

const sheet = (detent: number) => ({ presentation: 'formSheet' as const, sheetAllowedDetents: [detent], sheetGrabberVisible: true, sheetCornerRadius: 32 });

function RootStack() {
  const { account } = useSession();
  const player = usePlayerOptional();
  const [fontsLoaded, fontError] = useFonts({ Anton_400Regular, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });
  // Connecté : on attend aussi les données du joueur avant d'afficher l'app.
  const done = (fontsLoaded || !!fontError) && (!account || !!player?.ready);

  useEffect(() => {
    if (done) SplashScreen.hideAsync();
  }, [done]);

  if (!done) return null;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        {/* Sans compte : présentation, inscription, connexion */}
        <Stack.Protected guard={!account} redirectTo="/">
          <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
          <Stack.Screen name="sign-up" />
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="forgot-password" options={sheet(0.6)} />
        </Stack.Protected>

        {/* Avec un compte : l'app */}
        <Stack.Protected guard={!!account} redirectTo="/welcome">
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding/profile" />
          <Stack.Screen name="onboarding/body" />
          <Stack.Screen name="onboarding/game" />
          <Stack.Screen name="onboarding/shoes" />
          <Stack.Screen name="onboarding/goals" />
          <Stack.Screen name="onboarding/model" />
          <Stack.Screen name="onboarding/jersey" />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="settings" />
          <Stack.Screen name="session" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
          <Stack.Screen name="swish" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
          <Stack.Screen name="share-card" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="level-up" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
          <Stack.Screen name="log-shots" options={sheet(0.75)} />
          <Stack.Screen name="add-match" options={sheet(0.92)} />
          <Stack.Screen name="credits" options={sheet(0.9)} />
        </Stack.Protected>

        {/* Toujours accessibles */}
        <Stack.Screen name="dev" />
        <Stack.Screen name="legal/privacy" options={sheet(0.92)} />
        <Stack.Screen name="legal/terms" options={sheet(0.92)} />
      </Stack>
      {__DEV__ && <DevRemote />}
    </ThemeProvider>
  );
}

function SessionGate() {
  const { account, ready } = useSession();
  if (!ready) return null;
  if (!account) return <RootStack />;
  // Une clé par compte : changer de compte recharge les bonnes données.
  return (
    <PlayerProvider key={account.id} userId={account.id} defaultName={account.name}>
      <RootStack />
    </PlayerProvider>
  );
}

export default function RootLayout() {
  // L'intro est ici, au-dessus de tout : elle ne se rejoue pas quand on se connecte.
  const [introDone, setIntroDone] = useState(false);
  return (
    <SessionProvider>
      <SessionGate />
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
    </SessionProvider>
  );
}
