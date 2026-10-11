import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';
import { ConicType, Language } from '../types';

export interface UserProfileData {
  id: string;
  email?: string;
  displayName: string;
  photoURL?: string;
  language: Language;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface UserFavoriteItem {
  id: string;
  userId: string;
  buildingId: string;
  conicType: ConicType;
  createdAt?: any;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  score: number;
  total: number;
  percentage: number;
  completedAt?: Timestamp | null;
}

export interface JudgeFeedbackItem {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  buildingId?: string;
  createdAt?: Timestamp | null;
}

/**
 * Creates or updates user profile in Firestore
 */
export async function syncUserProfile(user: User, language: Language = 'en'): Promise<void> {
  const path = `users/${user.uid}`;
  const safeLanguage: Language = language === 'hi' ? 'hi' : 'en';
  const safeDisplayName =
    user.displayName && user.displayName.trim().length > 0
      ? user.displayName.trim().slice(0, 100)
      : (user.email ? user.email.split('@')[0].slice(0, 100) : 'Architectural Judge');

  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      // First-time user profile creation
      const newProfile: any = {
        id: user.uid,
        displayName: safeDisplayName,
        language: safeLanguage,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (user.email) {
        newProfile.email = user.email.slice(0, 256);
      }
      if (user.photoURL) {
        newProfile.photoURL = user.photoURL.slice(0, 2000);
      }

      await setDoc(userRef, newProfile);
    } else {
      // Document exists: only update mutable fields; never mutate id or createdAt
      const existingData = snap.data();
      const updatePayload: any = {
        displayName: safeDisplayName,
        language: safeLanguage,
        updatedAt: serverTimestamp(),
      };

      if (user.photoURL) {
        updatePayload.photoURL = user.photoURL.slice(0, 2000);
      }
      if (user.email && existingData?.email !== user.email) {
        updatePayload.email = user.email.slice(0, 256);
      }

      await updateDoc(userRef, updatePayload);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Toggles a building bookmark for a signed-in user
 */
export async function toggleBuildingFavorite(
  userId: string,
  buildingId: string,
  conicType: ConicType,
  currentlyFavorited: boolean
): Promise<boolean> {
  const path = `users/${userId}/favorites/${buildingId}`;
  try {
    const favRef = doc(db, 'users', userId, 'favorites', buildingId);
    if (currentlyFavorited) {
      await deleteDoc(favRef);
      return false;
    } else {
      await setDoc(favRef, {
        id: buildingId,
        userId,
        buildingId,
        conicType,
        createdAt: serverTimestamp(),
      });
      return true;
    }
  } catch (err) {
    handleFirestoreError(err, currentlyFavorited ? OperationType.DELETE : OperationType.WRITE, path);
  }
}

/**
 * Subscribes to user's saved architectural favorites
 */
export function subscribeUserFavorites(
  userId: string,
  onUpdate: (favorites: UserFavoriteItem[]) => void
): () => void {
  const path = `users/${userId}/favorites`;
  try {
    const favCollection = collection(db, 'users', userId, 'favorites');
    const unsubscribe = onSnapshot(
      favCollection,
      (snapshot) => {
        const items: UserFavoriteItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            userId: data.userId,
            buildingId: data.buildingId,
            conicType: data.conicType,
            createdAt: data.createdAt,
          });
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * Records a completed quiz result to the public leaderboard
 */
export async function submitQuizScore(
  userId: string,
  userName: string,
  score: number,
  total: number
): Promise<void> {
  const resultId = `${userId}_${Date.now()}`;
  const path = `quizResults/${resultId}`;
  try {
    const resultRef = doc(db, 'quizResults', resultId);
    const percentage = Math.round((score / total) * 100);

    await setDoc(resultRef, {
      id: resultId,
      userId,
      userName: userName || 'Judge Guest',
      score,
      total,
      percentage,
      completedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Real-time subscription to top quiz scores
 */
export function subscribeLeaderboard(
  onUpdate: (scores: LeaderboardEntry[]) => void
): () => void {
  const path = 'quizResults';
  try {
    const q = query(collection(db, 'quizResults'), orderBy('score', 'desc'), limit(8));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: LeaderboardEntry[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            userId: d.userId,
            userName: d.userName,
            score: d.score,
            total: d.total,
            percentage: d.percentage,
            completedAt: d.completedAt,
          });
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * Submits feedback from judges or visitors
 */
export async function submitFeedback(
  userId: string,
  userName: string,
  rating: number,
  comment: string,
  buildingId?: string
): Promise<void> {
  const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `feedback/${feedbackId}`;
  try {
    const fbRef = doc(db, 'feedback', feedbackId);
    const payload: any = {
      id: feedbackId,
      userId,
      userName: userName || 'Exhibition Visitor',
      rating,
      comment,
      createdAt: serverTimestamp(),
    };
    if (buildingId) {
      payload.buildingId = buildingId;
    }
    await setDoc(fbRef, payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Subscribes to recent judge and visitor reviews
 */
export function subscribeFeedback(
  onUpdate: (feedback: JudgeFeedbackItem[]) => void
): () => void {
  const path = 'feedback';
  try {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: JudgeFeedbackItem[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            userId: d.userId,
            userName: d.userName,
            rating: d.rating,
            comment: d.comment,
            buildingId: d.buildingId,
            createdAt: d.createdAt,
          });
        });
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}
