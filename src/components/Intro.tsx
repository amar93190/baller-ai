import { useEventListener } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INTRO = require('../../assets/videos/intro.mp4');

/**
 * Intro animée du logo, jouée à chaque ouverture de l'app.
 * Elle commence sur du noir, comme l'écran de démarrage, donc l'enchaînement est invisible.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const [opacity] = useState(() => new Animated.Value(1));
  const finished = useRef(false);
  const player = useVideoPlayer(INTRO, (p) => {
    p.muted = true;
    p.loop = false;
    p.play();
  });

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    Animated.timing(opacity, { toValue: 0, duration: 450, useNativeDriver: true }).start(() => onDone());
  };

  useEventListener(player, 'playToEnd', finish);
  useEventListener(player, 'statusChange', ({ status }) => {
    if (status === 'error') finish();
  });

  // Filet de sécurité : si la vidéo ne se lance pas, on n'attend pas plus de 7 secondes.
  useEffect(() => {
    const t = setTimeout(finish, 7000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, { opacity }]}>
      <StatusBar style="light" />
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} allowsPictureInPicture={false} />
      <Pressable onPress={finish} style={[styles.skip, { top: insets.top + 12 }]} accessibilityRole="button" accessibilityLabel="Passer l'intro" hitSlop={12}>
        <Text style={styles.skipText}>
          Passer
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: '#000000', zIndex: 100 },
  skip: { position: 'absolute', right: 20, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.12)' },
  skipText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
});
