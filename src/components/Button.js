import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

const variants = {
  primary: { bg: colors.primary, fg: colors.white, border: colors.primary },
  yellow: { bg: colors.yellow, fg: colors.dark, border: '#E0B800' },
  outline: { bg: colors.white, fg: colors.primary, border: colors.primary },
};

export default function Button({ title, onPress, variant = 'primary', disabled, style }) {
  const v = variants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg, borderColor: v.border },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, { color: v.fg }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.75 },
});
