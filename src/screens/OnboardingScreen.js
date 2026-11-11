import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useProfile } from '../ProfileContext';
import { colors } from '../theme';
import { isValidEmail, isValidName } from '../validation';

const PAGES = [
  {
    key: 'firstName',
    title: 'Hi! What is your first name?',
    label: 'First name',
    placeholder: 'Tilly',
    validate: isValidName,
    error: 'Please enter a name using letters only.',
    inputProps: { autoCapitalize: 'words', autoComplete: 'given-name', textContentType: 'givenName' },
  },
  {
    key: 'lastName',
    title: 'Nice to meet you! And your last name?',
    label: 'Last name',
    placeholder: 'Doe',
    validate: isValidName,
    error: 'Please enter a name using letters only.',
    inputProps: { autoCapitalize: 'words', autoComplete: 'family-name', textContentType: 'familyName' },
  },
  {
    key: 'email',
    title: 'Last step: where can we reach you?',
    label: 'Email',
    placeholder: 'tilly@example.com',
    validate: isValidEmail,
    error: 'Please enter a valid email address.',
    inputProps: {
      autoCapitalize: 'none',
      autoComplete: 'email',
      keyboardType: 'email-address',
      textContentType: 'emailAddress',
    },
  },
];

export default function OnboardingScreen() {
  const { saveProfile } = useProfile();
  const [page, setPage] = useState(0);
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '' });
  const [touched, setTouched] = useState(false);

  const current = PAGES[page];
  const value = values[current.key];
  const isValid = current.validate(value);
  const isLast = page === PAGES.length - 1;

  const goNext = async () => {
    if (!isValid) {
      setTouched(true);
      return;
    }
    if (isLast) {
      await saveProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
      });
      return;
    }
    setTouched(false);
    setPage(page + 1);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Let us get to know you</Text>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.step}>
            Step {page + 1} of {PAGES.length}
          </Text>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.label}>{current.label} *</Text>
          <TextInput
            key={current.key}
            style={[styles.input, touched && !isValid && styles.inputError]}
            value={value}
            placeholder={current.placeholder}
            placeholderTextColor="#9aa5a1"
            onChangeText={(text) => setValues({ ...values, [current.key]: text })}
            onBlur={() => setTouched(true)}
            onSubmitEditing={goNext}
            returnKeyType={isLast ? 'done' : 'next'}
            autoFocus
            {...current.inputProps}
          />
          {touched && !isValid && <Text style={styles.error}>{current.error}</Text>}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {PAGES.map((p, i) => (
              <View key={p.key} style={[styles.dot, i === page && styles.dotActive]} />
            ))}
          </View>
          <View style={styles.buttons}>
            {page > 0 ? (
              <Button
                title="Back"
                variant="outline"
                onPress={() => {
                  setTouched(false);
                  setPage(page - 1);
                }}
                style={styles.button}
              />
            ) : (
              <View style={styles.button} />
            )}
            <Button
              title={isLast ? 'Finish' : 'Next'}
              variant="yellow"
              onPress={goNext}
              disabled={!isValid}
              style={styles.button}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.white },
  banner: {
    backgroundColor: colors.primary,
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  bannerText: { color: colors.white, fontSize: 24, fontWeight: '600', textAlign: 'center' },
  body: { padding: 24 },
  step: { color: colors.primary, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '700', color: colors.dark, marginBottom: 24 },
  label: { fontSize: 14, color: colors.dark, marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.dark,
  },
  inputError: { borderColor: colors.error },
  error: { color: colors.error, marginTop: 6 },
  footer: { padding: 24, backgroundColor: colors.highlight },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16, gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 24 },
  buttons: { flexDirection: 'row', gap: 12 },
  button: { flex: 1 },
});
