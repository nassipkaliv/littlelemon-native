import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function Avatar({ profile, size = 40 }) {
  const style = { width: size, height: size, borderRadius: size / 2 };
  if (profile?.image) {
    return <Image source={{ uri: profile.image }} style={[styles.base, style]} />;
  }
  const initials =
    `${profile?.firstName?.[0] ?? ''}${profile?.lastName?.[0] ?? ''}`.toUpperCase() || '?';
  return (
    <View style={[styles.base, styles.placeholder, style]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  placeholder: {
    backgroundColor: colors.salmon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: colors.white, fontWeight: '700' },
});
