import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/ActionButton';
import { Button, T } from '@/components/ui';
import { colors, displayLineHeight, fonts } from '@/theme';

/** Première page, avant d'avoir un compte. */
export default function Welcome() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <StatusBar style="light" />
      <Image source={require('../../assets/images/court.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.55)', colors.bg]} locations={[0.2, 0.55, 0.85]} style={StyleSheet.absoluteFill} />
      <View style={[styles.inner, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }]}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} contentFit="contain" accessibilityLabel="Logo Baller AI" />
        <View>
          <Text style={styles.title}>BALLER</Text>
          <Text style={[styles.title, styles.ai]}>AI</Text>
          <T style={styles.pitch}>
            <T weight="semibold" style={styles.pitchStrong}>
              Ton coach de poche.{' '}
            </T>
            Missions du jour, programme de pro, stats et coach mental. Pour les joueurs et les joueuses.
          </T>
          <View style={{ gap: 10, marginTop: 26 }}>
            <ActionButton label="Créer mon compte" icon="arrow" onPress={() => router.push('/sign-up')} />
            <Button label="J’ai déjà un compte" variant="glass" onPress={() => router.push('/sign-in')} />
          </View>
          <T style={styles.legal}>
            En continuant, tu acceptes les{' '}
            <Link href="/legal/terms" style={styles.link}>
              Conditions d’utilisation
            </Link>{' '}
            et la{' '}
            <Link href="/legal/privacy" style={styles.link}>
              Politique de confidentialité
            </Link>
            .
          </T>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24 },
  logo: { width: 60, height: 56 },
  title: { fontFamily: fonts.display, fontSize: 104, lineHeight: displayLineHeight(104), color: colors.text, letterSpacing: 2 },
  ai: { color: colors.orange, marginTop: -56 },
  pitch: { color: 'rgba(255,255,255,0.85)', fontSize: 15, lineHeight: 23, marginTop: -6 },
  pitchStrong: { color: colors.white, fontSize: 15 },
  legal: { fontSize: 11.5, lineHeight: 17, color: colors.muted, textAlign: 'center', marginTop: 16 },
  link: { color: colors.text, textDecorationLine: 'underline' },
});
