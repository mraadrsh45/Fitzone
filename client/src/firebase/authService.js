import { auth, googleProvider } from './config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import api from '../services/api';

// ─── Register ────────────────────────────────────────────────
export const signUpEmail = async (email, password, name, gymName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update display name in Firebase
  if (name) {
    await updateProfile(user, { displayName: name });
  }

  // Force token refresh to ensure it's fresh
  await user.getIdToken(true);

  // Sync with MongoDB backend
  const res = await api.post('/auth/upsert', { email, name, gymName, avatar_url: user.photoURL });
  return { user, profile: res.user };
};

// ─── Login ───────────────────────────────────────────────────
export const signInEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Sync with MongoDB backend
  const res = await api.post('/auth/upsert', { 
    email: user.email, 
    name: user.displayName, 
    avatar_url: user.photoURL 
  });
  return { user, profile: res.user };
};

// ─── Google Login ─────────────────────────────────────────────
export const signInGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Sync with MongoDB backend
  const res = await api.post('/auth/upsert', { 
    email: user.email, 
    name: user.displayName, 
    avatar_url: user.photoURL 
  });
  return { user, profile: res.user };
};

// ─── Logout ──────────────────────────────────────────────────
export const signOutFirebase = async () => {
  await signOut(auth);
};

// ─── Forgot Password ─────────────────────────────────────────
export const resetPasswordEmail = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// ─── Get Token ───────────────────────────────────────────────
export const getToken = async () => {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return null;
};

// ─── Update Profile ──────────────────────────────────────────
export const updateProfileData = async (updates) => {
  // Map client snake_case to server expected fields
  const payload = {
    name:       updates.name,
    gymName:    updates.gym_name ?? updates.gymName,
    avatar_url: updates.avatar_url,
    phone:      updates.phone,
    location:   updates.location,
  };
  const res = await api.put('/auth/profile', payload);
  return res.user;
};

// ─── Update Password ─────────────────────────────────────────
import { updatePassword as firebaseUpdatePassword } from 'firebase/auth';

export const updatePassword = async (newPassword) => {
  if (auth.currentUser) {
    await firebaseUpdatePassword(auth.currentUser, newPassword);
  } else {
    throw new Error('No authenticated user');
  }
};

// ─── Upload Avatar (Base64 stored in MongoDB) ─────────────────
export const uploadAvatar = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const avatar_url = e.target.result;           // data: URI
        await updateProfileData({ avatar_url });
        resolve(avatar_url);
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
