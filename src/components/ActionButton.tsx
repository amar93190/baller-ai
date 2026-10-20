import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Raquette } from '@/components/Raquette';
import { colors, fonts } from '@/theme';

/**
 * L'action principale d'un écran : épaules coupées, texte en Anton.
 * Une seule par écran, en orange ; « light » pour l'action sur fond orange ou de célébration.
 */
export function ActionButton({ label, onPress, icon, tone = 'orange', style, disabled }: { label: string; onPress: () => void; icon?: IconName; tone?: 'orange' | 'light'; style?: StyleProp<ViewStyle>; disabled?: boolean }) {
  const fg = tone === 'light' ? colors.bg : colors.white;
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }], opacity: disabled ? 0.4 : 1 }, style]}>
      <Raquette kind="button" fill={tone === 'light' ? colors.text : colors.orange} style={styles.btn}>
        <Text style={[styles.label, { color: fg }]}>{label.toUpperCase()}</Text>
        {icon && <Icon name={icon} size={18} color={fg} stroke={2.5} />}
      </Raquette>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 20 },
  label: { fontFamily: fonts.display, fontSize: 19, lineHeight: 27, letterSpacing: 1 },
});
