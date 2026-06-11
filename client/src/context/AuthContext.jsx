import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import * as authService from '../firebase/authService';
import api from '../services/api';

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
          // Fetch MongoDB profile data using our API
          const res = await api.get('/auth/me');
          setProfile(res.user);
        } catch (err) {
          if (err.message.includes('User not found')) {
            try {
              const upsertRes = await api.post('/auth/upsert', {
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                avatar_url: firebaseUser.photoURL
              });
              setProfile(upsertRes.user);
            } catch (upsertErr) {
              console.error("Failed to auto-upsert user", upsertErr);
              setProfile(null);
            }
          } else {
            console.error("Failed to fetch profile", err);
            setProfile(null);
          }
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
        const res = await api.get('/auth/me');
        setProfile(res.user);
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
