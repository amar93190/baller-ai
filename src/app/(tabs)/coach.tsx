import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bolt } from '@/components/Bolt';
import { Icon } from '@/components/Icon';
import { LogoBackground } from '@/components/LogoBackground';
import { T, useAccent } from '@/components/ui';
import { replyTo, TOPICS, type Reply } from '@/lib/coach';
import { usePlayer } from '@/store/player';
import { colors, fonts, radius, space } from '@/theme';

type Msg = { id: number; from: 'coach' | 'me'; text: string; urgent?: boolean };

function greeting() {
  const h = new Date().getHours();
  if (h < 5 || h >= 18) return 'Bonsoir';
  if (h < 12) return 'Bonjour';
  return 'Bon après-midi';
}

/** Coach mental, façon app Claude : un logo, une zone de texte, et c'est parti. */
export default function Coach() {
  const insets = useSafeAreaInsets();
  const { state, logCoach } = usePlayer();
  const { accent, deep } = useAccent();
  const scroll = useRef<ScrollViewInstance>(null);
  const nextId = useRef(1);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [replies, setReplies] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [keyboard, setKeyboard] = useState(false);
  const started = msgs.length > 0;

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
    }, []),
  );

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', () => setKeyboard(true));
    const hide = Keyboard.addListener('keyboardWillHide', () => setKeyboard(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (started) setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  }, [msgs, typing, started]);

  const push = (m: Omit<Msg, 'id'>) => setMsgs((x) => [...x, { ...m, id: nextId.current++ }]);

  const coachSays = (r: Reply) => {
    setReplies([]);
    setTyping(true);
    r.lines.forEach((line, i) => {
      setTimeout(() => {
        push({ from: 'coach', text: line, urgent: r.urgent });
        if (i === r.lines.length - 1) {
          setTyping(false);
          setReplies(r.replies);
        }
      }, 700 * (i + 1));
    });
  };

  const send = (t: string) => {
    const v = t.trim();
    if (!v || typing) return;
    push({ from: 'me', text: v });
    logCoach();
    setText('');
    coachSays(replyTo(v));
  };

  const reset = () => {
    setMsgs([]);
    setReplies([]);
    setText('');
  };

  // Au-dessus de la barre d'onglets quand le clavier est fermé, collé au clavier quand il est ouvert.
  const bottom = keyboard ? 8 : insets.bottom + 66;
  const canSend = !!text.trim() && !typing;

  const composer = (
    <View style={[styles.box, started && styles.boxCompact]}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={started ? 'Réponds à ton coach…' : 'De quoi tu veux parler ?'}
        placeholderTextColor={colors.muted}
        style={[styles.input, started && styles.inputCompact]}
        multiline
        maxLength={500}
      />
      <View style={styles.boxRow}>
        {!started && <T style={styles.boxHint}>Coach Bolt · mental</T>}
        <Pressable
          onPress={() => send(text)}
          disabled={!canSend}
          accessibilityLabel="Envoyer"
          style={[styles.send, { backgroundColor: canSend ? accent : colors.surface2 }]}>
          <Icon name="send" size={18} color={canSend ? colors.white : colors.muted} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={[styles.root, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LogoBackground />
      {!started ? (
        <ScrollView contentContainerStyle={[styles.empty, { paddingBottom: bottom }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.hello}>
            <Bolt mood="chill" size={110} />
            <Text style={styles.helloTitle}>COACH BOLT</Text>
            <T weight="medium" style={styles.helloText}>
              {greeting()} {state.player.name}. Dis-moi ce qui se passe dans ta tête.
            </T>
          </View>
          {composer}
          <T style={styles.topicsLabel}>Tu peux me parler de :</T>
          <View style={styles.topics}>
            {TOPICS.map((t) => (
              <Pressable key={t.label} onPress={() => send(t.prompt)} style={styles.topic}>
                <T weight="medium" style={{ fontSize: 13 }}>
                  {t.label}
                </T>
              </Pressable>
            ))}
          </View>
          <T style={styles.disclaimer}>Je suis une IA de coaching sportif, pas un psychologue. Si ça ne va vraiment pas, parle à un adulte de confiance ou appelle le 3114 (24h/24, gratuit).</T>
        </ScrollView>
      ) : (
        <>
          <View style={styles.bar}>
            <Bolt mood={typing ? 'focus' : 'chill'} size={44} bounce={typing} />
            <View style={{ flex: 1 }}>
              <Text style={styles.barTitle}>COACH BOLT</Text>
              <T style={{ fontSize: 12, color: colors.good }}>{typing ? 'Bolt écrit…' : 'Mental · répond tout de suite'}</T>
            </View>
            <Pressable onPress={reset} hitSlop={10} accessibilityRole="button">
              <T weight="semibold" style={{ fontSize: 13, color: accent }}>
                Nouvelle discussion
              </T>
            </Pressable>
          </View>
          <ScrollView ref={scroll} style={{ flex: 1 }} contentContainerStyle={styles.chat} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {msgs.map((m, i) =>
              m.from === 'me' ? (
                <View key={m.id} style={styles.me}>
                  <T style={styles.msgText}>{m.text}</T>
                </View>
              ) : (
                <View key={m.id} style={styles.coach}>
                  <View style={{ width: 32 }}>{msgs[i - 1]?.from !== 'coach' && <Bolt mood={m.urgent ? 'sad' : 'chill'} size={32} bounce={false} />}</View>
                  <View style={[styles.coachBubble, msgs[i - 1]?.from === 'coach' && { borderTopLeftRadius: radius.tile }, m.urgent && { borderLeftWidth: 3, borderLeftColor: deep }]}>
                    <T style={styles.msgText}>{m.text}</T>
                  </View>
                </View>
              ),
            )}
            {typing && <T style={{ color: colors.muted, fontSize: 20 }}>•••</T>}
            {replies.length > 0 && (
              <View style={[styles.topics, { justifyContent: 'flex-start', marginTop: 6 }]}>
                {replies.map((r) => (
                  <Pressable key={r} onPress={() => send(r)} style={styles.topic}>
                    <T weight="medium" style={{ fontSize: 13 }}>
                      {r}
                    </T>
                  </Pressable>
                ))}
              </View>
            )}
          </ScrollView>
          <View style={{ paddingHorizontal: 14, paddingTop: 6, paddingBottom: bottom }}>{composer}</View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  empty: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 18, gap: 14 },
  hello: { alignItems: 'center', gap: 4, marginBottom: 18, paddingHorizontal: 12 },
  helloTitle: { fontFamily: fonts.display, fontSize: 36, lineHeight: 48, color: colors.text, marginTop: 8 },
  helloText: { fontSize: 15, lineHeight: 22, color: '#C9C4BC', textAlign: 'center' },
  barTitle: { fontFamily: fonts.display, fontSize: 20, lineHeight: 27, color: colors.text },
  box: { backgroundColor: colors.surface, borderRadius: radius.block, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, minHeight: 124 },
  boxCompact: { minHeight: 0, paddingTop: 8, paddingBottom: 8, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { fontFamily: fonts.regular, fontSize: 16, color: colors.text, minHeight: 60, maxHeight: 140, textAlignVertical: 'top', padding: 0 },
  inputCompact: { flex: 1, minHeight: 36, paddingTop: 8, paddingBottom: 6 },
  boxRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  boxHint: { flex: 1, fontSize: 12, color: colors.muted },
  send: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  topicsLabel: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 8 },
  topics: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  topic: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.chip, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface },
  disclaimer: { fontSize: 11, lineHeight: 17, color: colors.muted, textAlign: 'center', marginTop: 18, paddingHorizontal: 10 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  chat: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 12, gap: space.xs },
  me: { alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: colors.orange, borderRadius: radius.tile, borderBottomRightRadius: 4, paddingVertical: 10, paddingHorizontal: 14 },
  coach: { flexDirection: 'row', alignItems: 'flex-start', gap: space.xs, paddingRight: space.xl },
  coachBubble: { flexShrink: 1, backgroundColor: colors.surface, borderRadius: radius.tile, borderTopLeftRadius: 4, paddingVertical: 10, paddingHorizontal: 14 },
  msgText: { fontSize: 15, lineHeight: 23, color: colors.text },
});
