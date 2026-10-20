import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from 'react-native';

import { Glass } from '@/components/Glass';
import { Icon, type IconName } from '@/components/Icon';
import { accentShades, colors, displayLineHeight, fonts, radius } from '@/theme';

/**
 * Couleur d'accent de l'interface : toujours l'orange Baller (identité « Raquette »).
 * La couleur d'équipe du joueur reste sur son maillot et sa carte.
 */
export function useAccent() {
  return accentShades(colors.orange);
}

const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

export function T({ style, weight = 'regular', ...rest }: TextProps & { weight?: keyof typeof fonts }) {
  return <Text {...rest} style={[{ fontFamily: fonts[weight], color: colors.text, fontSize: 14 }, style]} />;
}

export function Display({ style, ...rest }: TextProps) {
  const size = StyleSheet.flatten(style)?.fontSize ?? 40;
  return <Text {...rest} style={[styles.display, style, { lineHeight: displayLineHeight(size) }]} />;
}

export function Eyebrow({ children, color = colors.parquet, style }: { children: ReactNode; color?: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.eyebrow, { color }, style]}>{children}</Text>;
}

type BtnProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'glass';
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function Button({ label, onPress, variant = 'primary', icon, style, disabled }: BtnProps) {
  const { accent } = useAccent();
  const fg = variant === 'ghost' ? colors.text : colors.white;
  // Une flèche « suivant » se place après le texte, les autres icônes avant.
  const trailing = icon === 'arrow';
  const content = (
    <>
      {icon && !trailing && <Icon name={icon} size={18} color={fg} />}
      <T weight="semibold" style={{ color: fg, fontSize: 15 }}>
        {label}
      </T>
      {icon && trailing && <Icon name={icon} size={18} color={fg} />}
    </>
  );
  const press = () => {
    tap();
    onPress();
  };
  if (variant === 'glass') {
    return (
      <Pressable onPress={press} disabled={disabled} accessibilityRole="button" style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }, style]}>
        <Glass interactive style={[styles.btn, { borderRadius: 26 }]}>
          {content}
        </Glass>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={press}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' ? { backgroundColor: accent, shadowColor: accent, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } } : { backgroundColor: colors.surface2 },
        { transform: [{ scale: pressed ? 0.97 : 1 }], opacity: disabled ? 0.5 : 1 },
        style,
      ]}>
      {content}
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.chips}>
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => {
              tap();
              onChange(o);
            }}
            accessibilityState={{ selected: on }}
            style={[styles.chip, on && { backgroundColor: colors.text, borderColor: colors.text }]}>
            <T weight="medium" style={{ fontSize: 13, color: on ? colors.bg : colors.text }}>
              {o}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Segmented<V extends string>({ options, value, onChange }: { options: { label: string; value: V }[]; value: V; onChange: (v: V) => void }) {
  return (
    <View style={styles.seg}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => {
              tap();
              onChange(o.value);
            }}
            accessibilityState={{ selected: on }}
            style={[styles.segBtn, on && styles.segOn]}>
            <T weight={on ? 'semibold' : 'medium'} style={{ fontSize: 13, color: on ? colors.bg : colors.muted }}>
              {o.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Compteur + / − avec le chiffre en Anton. Garder le doigt appuyé fait défiler vite (pratique pour un score).
 * Pour VoiceOver, tout le bloc est « réglable » : glisser vers le haut ou le bas.
 */
export function Stepper({ label, value, onChange, min = 0, max = 200, big }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; big?: boolean }) {
  const current = useRef(value);
  useEffect(() => {
    current.current = value;
  }, [value]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step = (d: number) => {
    const v = Math.max(min, Math.min(max, current.current + d));
    if (v === current.current) return;
    current.current = v;
    onChange(v);
  };
  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const hold = (d: number) => {
    tap();
    step(d);
    const repeat = () => {
      step(d);
      timer.current = setTimeout(repeat, 70);
    };
    timer.current = setTimeout(repeat, 400);
  };
  useEffect(() => stop, []);

  return (
    <View
      style={styles.stepper}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: String(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => step(e.nativeEvent.actionName === 'increment' ? 1 : -1)}>
      <Text style={styles.stepLabel} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.stepRow}>
        <Pressable onPressIn={() => hold(-1)} onPressOut={stop} style={({ pressed }) => [styles.stepBtn, pressed && styles.stepPressed, value <= min && { opacity: 0.35 }]}>
          <Icon name="minus" size={18} stroke={2.5} />
        </Pressable>
        <Text style={[styles.stepNum, big && styles.stepNumBig]} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        <Pressable onPressIn={() => hold(1)} onPressOut={stop} style={({ pressed }) => [styles.stepBtn, pressed && styles.stepPressed, value >= max && { opacity: 0.35 }]}>
          <Icon name="plus" size={18} color={colors.orange} stroke={2.5} />
        </Pressable>
      </View>
    </View>
  );
}

/** Barre de progression en chevrons : 5 segments coupés en biais. */
export function Chevrons({ pct, count = 5 }: { pct: number; count?: number }) {
  const on = Math.round((pct / 100) * count);
  return (
    <View style={{ flexDirection: 'row', gap: 4 }} accessible accessibilityLabel={`Progression ${pct} %`}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={[styles.chevron, { backgroundColor: i < on ? colors.orange : colors.line }]} />
      ))}
    </View>
  );
}

/** Haut des écrans d'inscription : retour, et « Étape 2 sur 3 » en chevrons. Sans étape (modification), juste le retour. */
export function Steps({ step, total = 3, onBack }: { step?: number; total?: number; onBack?: () => void }) {
  return (
    <View style={styles.steps}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Retour" style={styles.backBtn}>
          <Icon name="back" size={20} />
        </Pressable>
      ) : (
        <View style={{ width: 40 }} />
      )}
      {!!step && (
        <View style={{ width: 120, gap: 6 }} accessible accessibilityLabel={`Étape ${step} sur ${total}`}>
          <Text style={styles.stepsText}>
            ÉTAPE {step} SUR {total}
          </Text>
          <Chevrons pct={(step / total) * 100} count={total} />
        </View>
      )}
    </View>
  );
}

/** Titre de bloc en Anton, avec un détail ou un lien à droite. */
export function BlockTitle({ children, detail, action }: { children: ReactNode; detail?: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View style={styles.blockRow}>
      <Text style={styles.blockTitle}>{children}</Text>
      {action ? (
        <Pressable onPress={action.onPress} hitSlop={10} accessibilityRole="button">
          <T weight="semibold" style={{ fontSize: 13, color: colors.orange }}>
            {action.label}
          </T>
        </Pressable>
      ) : (
        !!detail && <T style={{ fontSize: 12, color: colors.muted, flexShrink: 1, textAlign: 'right' }}>{detail}</T>
      )}
    </View>
  );
}

/** Champ de saisie avec libellé, message d'erreur et œil pour les mots de passe. */
export function Field({ label, error, secure, ...input }: { label: string; error?: string | null; secure?: boolean } & ComponentProps<typeof TextInput>) {
  const { accent } = useAccent();
  const [focus, setFocus] = useState(false);
  const [hidden, setHidden] = useState(true);
  return (
    <View style={{ gap: 6 }}>
      <T weight="semibold" style={{ fontSize: 12.5 }}>
        {label}
      </T>
      <View style={[styles.field, focus && { borderColor: accent }, !!error && { borderColor: colors.danger }]}>
        <TextInput
          placeholderTextColor={colors.muted}
          {...input}
          secureTextEntry={secure && hidden}
          onFocus={(e) => {
            setFocus(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            input.onBlur?.(e);
          }}
          style={styles.fieldInput}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} accessibilityLabel={hidden ? 'Afficher le mot de passe' : 'Masquer le mot de passe'}>
            <Icon name={hidden ? 'eye' : 'eyeOff'} size={20} color={colors.muted} />
          </Pressable>
        )}
      </View>
      {!!error && <T style={{ fontSize: 12, color: colors.danger }}>{error}</T>}
    </View>
  );
}

/** En-tête d'écran : bouton retour et titre centré. */
export function TopBar({ title, onBack, right }: { title?: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <View style={styles.topBar}>
      <View style={{ width: 40 }}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={12} accessibilityRole="button" accessibilityLabel="Retour" style={styles.backBtn}>
            <Icon name="back" size={20} />
          </Pressable>
        )}
      </View>
      <T weight="semibold" style={{ fontSize: 16, flex: 1, textAlign: 'center' }} numberOfLines={1}>
        {title}
      </T>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 16 },
  fieldInput: { flex: 1, height: '100%', fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 48 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  display: { fontFamily: fonts.display, color: colors.text, fontSize: 40, textTransform: 'uppercase', letterSpacing: 0.5 },
  eyebrow: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase' },
  btn: { height: 52, borderRadius: 16, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 22, padding: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { height: 36, paddingHorizontal: 14, borderRadius: radius.chip, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, justifyContent: 'center' },
  seg: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 14, padding: 4 },
  segBtn: { flex: 1, height: 40, borderRadius: radius.chip, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.text },
  stepper: { flex: 1, minWidth: 140, backgroundColor: colors.surface, borderRadius: 16, paddingTop: 10, paddingBottom: 8, paddingHorizontal: 10, gap: 2 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1.2, textAlign: 'center' },
  stepNum: { flex: 1, fontFamily: fonts.display, fontSize: 30, lineHeight: displayLineHeight(30), color: colors.text, textAlign: 'center' },
  stepNumBig: { fontSize: 52, lineHeight: displayLineHeight(52) },
  stepBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  stepPressed: { transform: [{ scale: 0.92 }], backgroundColor: colors.line },
  chevron: { flex: 1, height: 10, transform: [{ skewX: '-30deg' }], borderRadius: 2 },
  steps: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 40, marginBottom: 4 },
  stepsText: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.4, color: colors.muted, textAlign: 'right' },
  blockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, gap: 8 },
  blockTitle: { fontFamily: fonts.display, fontSize: 22, lineHeight: 30, color: colors.text, textTransform: 'uppercase' },
});
