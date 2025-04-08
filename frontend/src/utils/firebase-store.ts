import { firebaseApp } from "app";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";

// Initialize Firestore
const db = getFirestore(firebaseApp);

// User profile interface
export interface UserProfile {
  uid: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  restaurantName?: string;
  position?: string;
  bio?: string;
  createdAt: number;
  updatedAt: number;
}

// User settings interface
export interface UserSettings {
  uid: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  appNotifications: boolean;
  marketingEmails: boolean;
  dataSharing: boolean;
  language: string;
  timezone: string;
  dateFormat: string;
  updatedAt: number;
}

/**
 * Create or update user profile in Firestore
 */
export const saveUserProfile = async (user: User, profileData: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, "profiles", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing profile
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: Date.now(),
      });
    } else {
      // Create new profile
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...profileData,
      } as UserProfile);
    }
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "profiles", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Save user settings to Firestore
 */
export const saveUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
  try {
    const settingsRef = doc(db, "settings", userId);
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      // Update existing settings
      await updateDoc(settingsRef, {
        ...settings,
        updatedAt: Date.now(),
      });
    } else {
      // Create new settings with defaults
      await setDoc(settingsRef, {
        uid: userId,
        theme: "light",
        emailNotifications: true,
        appNotifications: true,
        marketingEmails: false,
        dataSharing: true,
        language: "en",
        timezone: "UTC+0",
        dateFormat: "MM/DD/YYYY",
        updatedAt: Date.now(),
        ...settings,
      } as UserSettings);
    }
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw error;
  }
};

/**
 * Get user settings from Firestore
 */
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const settingsRef = doc(db, "settings", userId);
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      return settingsDoc.data() as UserSettings;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user settings:", error);
    throw error;
  }
};
