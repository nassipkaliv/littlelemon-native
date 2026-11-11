import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { useProfile } from '../ProfileContext';
import { colors, emptyProfile } from '../theme';
import { formatPhone, isValidEmail, isValidName, isValidPhone } from '../validation';

const NOTIFICATIONS = [
  ['orderStatuses', 'Order statuses'],
  ['passwordChanges', 'Password changes'],
  ['specialOffers', 'Special offers'],
  ['newsletter', 'Newsletter'],
];

function Field({ label, error, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#9aa5a1"
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export default function ProfileScreen() {
  const { profile, saveProfile, logout } = useProfile();
  const [form, setForm] = useState(profile ?? emptyProfile);

  // Keep the form in sync if the stored profile changes (e.g. after saving).
  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setNotification = (key, value) =>
    setForm((f) => ({ ...f, notifications: { ...f.notifications, [key]: value } }));

  const errors = {
    firstName: isValidName(form.firstName) ? null : 'Enter a valid first name.',
    lastName: isValidName(form.lastName) ? null : 'Enter a valid last name.',
    email: isValidEmail(form.email) ? null : 'Enter a valid email address.',
    phone: isValidPhone(form.phone) ? null : 'Enter a 10-digit US phone number.',
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const isDirty = JSON.stringify(form) !== JSON.stringify(profile);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets?.[0]?.uri) set('image', result.assets[0].uri);
  };

  const onSave = async () => {
    if (hasErrors) return;
    await saveProfile({
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
    });
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  const onLogout = () => {
    const confirm = () => logout();
    if (Platform.OS === 'web') return confirm();
    Alert.alert('Log out', 'This will delete all your data from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: confirm },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>Personal information</Text>

          <Text style={styles.label}>Avatar</Text>
          <View style={styles.avatarRow}>
            <Avatar profile={form} size={80} />
            <Button title="Change" onPress={pickImage} style={styles.avatarButton} />
            <Button
              title="Remove"
              variant="outline"
              onPress={() => set('image', null)}
              disabled={!form.image}
              style={styles.avatarButton}
            />
          </View>

          <Field
            label="First name"
            value={form.firstName}
            onChangeText={(v) => set('firstName', v)}
            error={errors.firstName}
            autoCapitalize="words"
          />
          <Field
            label="Last name"
            value={form.lastName}
            onChangeText={(v) => set('lastName', v)}
            error={errors.lastName}
            autoCapitalize="words"
          />
          <Field
            label="Email"
            value={form.email}
            onChangeText={(v) => set('email', v)}
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Field
            label="Phone number"
            value={form.phone}
            onChangeText={(v) => set('phone', formatPhone(v))}
            error={errors.phone}
            placeholder="(217) 555-0113"
            keyboardType="phone-pad"
          />

          <Text style={[styles.heading, styles.sectionGap]}>Email notifications</Text>
          {NOTIFICATIONS.map(([key, label]) => (
            <Pressable
              key={key}
              style={styles.checkRow}
              onPress={() => setNotification(key, !form.notifications[key])}
            >
              <Checkbox
                value={!!form.notifications[key]}
                onValueChange={(v) => setNotification(key, v)}
                color={form.notifications[key] ? colors.primary : undefined}
              />
              <Text style={styles.checkLabel}>{label}</Text>
            </Pressable>
          ))}

          <Button title="Log out" variant="yellow" onPress={onLogout} style={styles.logout} />
          <View style={styles.actions}>
            <Button
              title="Discard changes"
              variant="outline"
              onPress={() => setForm(profile)}
              disabled={!isDirty}
              style={styles.actionButton}
            />
            <Button
              title="Save changes"
              onPress={onSave}
              disabled={!isDirty || hasErrors}
              style={styles.actionButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 20, fontWeight: '700', color: colors.dark, marginBottom: 14 },
  sectionGap: { marginTop: 10 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  avatarButton: { paddingHorizontal: 16 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, color: colors.primary, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.dark,
  },
  inputError: { borderColor: colors.error },
  error: { color: colors.error, marginTop: 4, fontSize: 13 },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  checkLabel: { fontSize: 16, color: colors.dark },
  logout: { marginTop: 24 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  actionButton: { flex: 1 },
});
