import { GlassContainer, GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

const hasLiquidGlass = (() => {
  try {
    return Platform.OS === 'ios' && isGlassEffectAPIAvailable() && isLiquidGlassAvailable();
  } catch {
    return false;
  }
})();

/**
 * Verre Liquid Glass natif sur iOS 26+.
 * Ailleurs (Android, iOS plus ancien) : un verre translucide simulé.
 */
export function Glass({
  children,
  style,
  tint,
  interactive,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: string;
  interactive?: boolean;
}) {
  if (hasLiquidGlass) {
    return (
      <GlassView style={style} glassEffectStyle="regular" tintColor={tint} isInteractive={interactive}>
        {children}
      </GlassView>
    );
  }
  return <View style={[styles.fallback, tint ? { backgroundColor: tint + 'D9' } : null, style]}>{children}</View>;
}

/**
 * Groupe de verres : sur iOS 26, les blocs proches fusionnent comme dans Messages.
 * Ailleurs, une simple rangée.
 */
export function GlassGroup({ children, style, spacing = 10 }: { children?: ReactNode; style?: StyleProp<ViewStyle>; spacing?: number }) {
  if (hasLiquidGlass) {
    return (
      <GlassContainer spacing={spacing} style={style}>
        {children}
      </GlassContainer>
    );
  }
  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
  },
});
