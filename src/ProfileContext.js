import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY, emptyProfile } from './theme';
import { clearMenu } from './database';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null); // null => onboarding not completed

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setProfile({ ...emptyProfile, ...JSON.parse(raw) });
      } catch (e) {
        console.warn('Failed to load profile', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveProfile = useCallback(async (next) => {
    const merged = { ...emptyProfile, ...next };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setProfile(merged);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.clear();
    try {
      await clearMenu();
    } catch (e) {
      console.warn('Failed to clear menu cache', e);
    }
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ isLoading, profile, isOnboarded: profile !== null, saveProfile, logout }),
    [isLoading, profile, saveProfile, logout]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export const useProfile = () => useContext(ProfileContext);
