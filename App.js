import { ActivityIndicator, Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Avatar from './src/components/Avatar';
import Logo from './src/components/Logo';
import { ProfileProvider, useProfile } from './src/ProfileContext';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

function HeaderAvatar({ navigation }) {
  const { profile } = useProfile();
  return (
    <Pressable
      onPress={() => navigation.navigate('Profile')}
      accessibilityRole="button"
      accessibilityLabel="Open profile"
    >
      <Avatar profile={profile} size={36} />
    </Pressable>
  );
}

function RootNavigator() {
  const { isLoading, isOnboarded } = useProfile();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => <Logo />,
        headerTitleAlign: 'center',
        headerTintColor: colors.primary,
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
      }}
    >
      {isOnboarded ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerRight: () => <HeaderAvatar navigation={navigation} />,
            })}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ProfileProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
