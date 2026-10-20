import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { T } from '@/components/ui';
import { usePlayerOptional, type Gender } from '@/store/player';
import { useSession } from '@/store/session';
import { colors } from '@/theme';

const TEST_EMAILS = { m: 'test@baller.dev', f: 'test-f@baller.dev' };
const TEST_PASSWORD = 'baller-test-2026';

/**
 * Écran de test, uniquement en développement (absent de la version publiée).
 * ballerai://dev           → connecte un compte de test (account=f : compte joueuse)
 * ballerai://dev?seed=1    → remplit l'app d'exemples et ouvre l'accueil
 *   options : gender=F, model=clark, position=Meneur
 */
export default function Dev() {
  const { account, signIn, signUp, signOut } = useSession();
  const player = usePlayerOptional();
  const params = useLocalSearchParams<{ seed?: string; gender?: string; model?: string; position?: string; account?: string }>();
  const email = params.account === 'f' ? TEST_EMAILS.f : TEST_EMAILS.m;
  // Chaque commande ne s'exécute qu'une fois, même si les données changent ensuite.
  const handled = useRef<string | null>(null);
  const command = JSON.stringify(params);

  useEffect(() => {
    if (!__DEV__) return;
    (async () => {
      if (account && account.email !== email) {
        await signOut();
        return;
      }
      if (!account) {
        const r = await signIn(email, TEST_PASSWORD);
        if (!r.ok) await signUp(params.account === 'f' ? 'Léa' : 'Noah', email, TEST_PASSWORD);
        return;
      }
      if (!player || handled.current === command) return;
      handled.current = command;
      if (params.gender && !params.seed) {
        player.updatePlayer({ gender: params.gender === 'F' ? 'F' : 'M' });
        router.replace('/onboarding/profile');
        return;
      }
      if (params.seed) {
        const gender: Gender = params.gender === 'F' ? 'F' : 'M';
        player.loadExamples();
        player.updatePlayer({
          gender,
          name: gender === 'F' ? 'Léa' : 'Noah',
          position: params.position ?? 'Meneur',
          persona: 'club',
          club: 'BCM Lyon U18',
          birthYear: new Date().getFullYear() - 17,
          height: gender === 'F' ? 172 : 184,
          weight: gender === 'F' ? 62 : 76,
          wingspan: gender === 'F' ? 175 : 190,
          hand: 'R',
          level: 'regional',
          shoeBrand: 'Nike',
          shoeModel: 'Sabrina',
          shoeSize: gender === 'F' ? 40 : 44,
          goals: ['tir', 'dribble', 'mental'],
          weeklyTarget: 4,
        });
        player.chooseModel(params.model ?? (gender === 'F' ? 'clark' : 'curry'));
        player.finishOnboarding();
        router.replace('/home');
      }
    })();
  }, [account, player, email, command, params.account, params.seed, params.gender, params.model, params.position, signIn, signUp, signOut]);

  if (!__DEV__) return <Redirect href="/" />;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <T style={{ color: colors.muted }}>Mode test…</T>
    </View>
  );
}
