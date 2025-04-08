import { create } from 'zustand';
import { User } from 'firebase/auth';
import { getUserProfile, getUserSettings, saveUserProfile, saveUserSettings, UserProfile, UserSettings } from './firebase-store';
import { useCurrentUser } from 'app';
import React, { useEffect } from 'react';

// Interface for the user store
interface UserState {
  // Profile data
  profile: UserProfile | null;
  profileLoading: boolean;
  profileError: Error | null;
  
  // Settings data
  settings: UserSettings | null;
  settingsLoading: boolean;
  settingsError: Error | null;
  
  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  fetchSettings: (userId: string) => Promise<void>;
  updateProfile: (userId: string, data: Partial<UserProfile>) => Promise<void>;
  updateSettings: (userId: string, data: Partial<UserSettings>) => Promise<void>;
  resetState: () => void;
}

// Create the store
export const useUserStore = create<UserState>((set) => ({
  // Initial state
  profile: null,
  profileLoading: false,
  profileError: null,
  
  settings: null,
  settingsLoading: false,
  settingsError: null,
  
  // Fetch profile data from Firestore
  fetchProfile: async (userId: string) => {
    try {
      set({ profileLoading: true, profileError: null });
      const profile = await getUserProfile(userId);
      set({ profile, profileLoading: false });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      set({ profileError: error as Error, profileLoading: false });
    }
  },
  
  // Fetch settings data from Firestore
  fetchSettings: async (userId: string) => {
    try {
      set({ settingsLoading: true, settingsError: null });
      const settings = await getUserSettings(userId);
      set({ settings, settingsLoading: false });
    } catch (error) {
      console.error('Error fetching user settings:', error);
      set({ settingsError: error as Error, settingsLoading: false });
    }
  },
  
  // Update profile data in Firestore
  updateProfile: async (userId: string, data: Partial<UserProfile>) => {
    try {
      // Optimistic update
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null,
      }));
      
      // Create a fake user object with the minimum required properties
      const userObj = { uid: userId } as User;
      await saveUserProfile(userObj, data);
      
      // Refetch to ensure consistency
      await useUserStore.getState().fetchProfile(userId);
    } catch (error) {
      console.error('Error updating user profile:', error);
      set({ profileError: error as Error });
      // Refetch to revert optimistic update
      await useUserStore.getState().fetchProfile(userId);
    }
  },
  
  // Update settings data in Firestore
  updateSettings: async (userId: string, data: Partial<UserSettings>) => {
    try {
      // Optimistic update
      set((state) => ({
        settings: state.settings ? { ...state.settings, ...data } : null,
      }));
      
      await saveUserSettings(userId, data);
      
      // Refetch to ensure consistency
      await useUserStore.getState().fetchSettings(userId);
    } catch (error) {
      console.error('Error updating user settings:', error);
      set({ settingsError: error as Error });
      // Refetch to revert optimistic update
      await useUserStore.getState().fetchSettings(userId);
    }
  },
  
  // Reset the store state
  resetState: () => {
    set({
      profile: null,
      profileLoading: false,
      profileError: null,
      settings: null,
      settingsLoading: false,
      settingsError: null,
    });
  },
}));

// Custom hook to initialize and use the user store
export const useUser = () => {
  const { user } = useCurrentUser();
  const { 
    profile, profileLoading, profileError,
    settings, settingsLoading, settingsError,
    fetchProfile, fetchSettings, updateProfile, updateSettings, resetState 
  } = useUserStore();
  
  useEffect(() => {
    // Reset state when user changes
    resetState();
    
    // If user exists, fetch their data
    if (user?.uid) {
      fetchProfile(user.uid);
      fetchSettings(user.uid);
    }
  }, [user?.uid]);
  
  return {
    user,
    profile,
    profileLoading,
    profileError,
    settings,
    settingsLoading,
    settingsError,
    updateProfile: user ? (data: Partial<UserProfile>) => updateProfile(user.uid, data) : undefined,
    updateSettings: user ? (data: Partial<UserSettings>) => updateSettings(user.uid, data) : undefined,
  };
};
