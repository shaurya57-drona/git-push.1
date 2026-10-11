import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { ConicType, Language } from '../types';
import {
  syncUserProfile,
  subscribeUserFavorites,
  toggleBuildingFavorite,
  UserFavoriteItem,
} from '../services/firebaseService';
import { useLanguage } from './LanguageContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  favorites: UserFavoriteItem[];
  favoriteIds: Set<string>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (buildingId: string, conicType: ConicType) => Promise<boolean>;
  isFavorited: (buildingId: string) => boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; lang?: Language }> = ({
  children,
  lang: propLang,
}) => {
  let contextLang: Language = 'en';
  try {
    const langCtx = useLanguage();
    contextLang = langCtx.lang;
  } catch {
    contextLang = 'en';
  }
  const lang = propLang || contextLang;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<UserFavoriteItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const favoriteIds = new Set(favorites.map((f) => f.buildingId));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        try {
          await syncUserProfile(currentUser, lang);
        } catch (e) {
          console.warn('Could not sync user profile:', e);
        }
      } else {
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, [lang]);

  // Real-time listener for user favorites when authenticated
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const unsubscribe = subscribeUserFavorites(user.uid, (items) => {
      setFavorites(items);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      const errorCode = err?.code || '';
      const errorMessage = err?.message || '';

      // User intentionally closed the popup or cancelled the request - this is normal interaction, not an error
      if (
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request' ||
        errorCode === 'auth/user-cancelled' ||
        errorMessage.includes('popup-closed-by-user')
      ) {
        return;
      }

      // Browser blocked the popup window
      if (errorCode === 'auth/popup-blocked') {
        setError(
          lang === 'en'
            ? 'Sign-in pop-up was blocked by your browser. Please allow pop-ups or use Guest Mode.'
            : 'ब्राउज़र द्वारा साइन-इन पॉप-अप ब्लॉक हुआ। कृपया पॉप-अप की अनुमति दें या अतिथि मोड का उपयोग करें।'
        );
        return;
      }

      console.warn('Google Sign-In notice:', errorCode, errorMessage);
      setError(
        lang === 'en'
          ? 'Unable to complete Google Sign-In. You can continue as a Guest Judge.'
          : 'गूगल साइन-इन पूरा नहीं हो सका। आप अतिथि जज के रूप में जारी रख सकते हैं।'
      );
    }
  };

  const signInAsGuest = async () => {
    setError(null);
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.warn('Guest sign-in notice:', err?.code, err?.message);
      setError(
        lang === 'en'
          ? 'Guest access unavailable. Please try Google Sign-In.'
          : 'अतिथि मोड अनुपलब्ध है। कृपया गूगल साइन-इन का प्रयास करें।'
      );
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setFavorites([]);
    } catch (err: any) {
      console.warn('Sign-Out notice:', err);
      setError(err?.message || 'Sign out failed');
    }
  };

  const handleToggleFavorite = async (buildingId: string, conicType: ConicType): Promise<boolean> => {
    if (!user) {
      // Trigger sign-in if guest clicks favorite
      await signInWithGoogle();
      return false;
    }
    const currentlyFavorited = favoriteIds.has(buildingId);
    try {
      return await toggleBuildingFavorite(user.uid, buildingId, conicType, currentlyFavorited);
    } catch (e: any) {
      setError(e?.message || 'Could not update favorites');
      return currentlyFavorited;
    }
  };

  const isFavorited = (buildingId: string): boolean => {
    return favoriteIds.has(buildingId);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        favorites,
        favoriteIds,
        signInWithGoogle,
        signInAsGuest,
        logout,
        toggleFavorite: handleToggleFavorite,
        isFavorited,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
