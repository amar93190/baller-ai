import { Redirect } from 'expo-router';

import { usePlayer } from '@/store/player';

/** Après connexion : l'app si le profil est fait, sinon l'inscription du profil. */
export default function Index() {
  const { state } = usePlayer();
  return <Redirect href={state.onboarded ? '/home' : '/onboarding/profile'} />;
}
