import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as authService from '../firebase/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Listen to Firebase Auth State ────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Fetch Firestore profile data
          const userRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            // Auto-upsert if missing
            try {
              const newProfile = {
                email: firebaseUser.email,
                name: firebaseUser.displayName || '',
                gymName: '',
                avatar_url: firebaseUser.photoURL || '',
                created_at: serverTimestamp()
              };
              await setDoc(userRef, newProfile);
              setProfile(newProfile);
            } catch (upsertErr) {
              console.error("Failed to auto-upsert user", upsertErr);
              setProfile(null);
            }
          }
        } catch (err) {
          console.error("Failed to fetch profile", err);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const data = await authService.signInEmail(email, password);
    setProfile(data.profile);
    return data.user;
  };

  const register = async (email, password, name, gymName) => {
    const data = await authService.signUpEmail(email, password, name, gymName);
    setProfile(data.profile);
    return data.user;
  };

  const loginWithGoogle = async () => {
    const data = await authService.signInGoogle();
    setProfile(data.profile);
    return data.user;
  };

  const logout = async () => {
    await authService.signOutFirebase();
    // onAuthStateChanged will handle setting user/profile to null
  };

  const forgotPassword = async (email) => {
    await authService.resetPasswordEmail(email);
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const displayName = profile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';
  const gymName     = profile?.gym_name || profile?.gymName || '';

  return (
    <AuthContext.Provider value={{
      user, profile, session: !!user, loading,
      login, register, loginWithGoogle, logout, forgotPassword, refreshProfile,
      displayName, gymName,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
