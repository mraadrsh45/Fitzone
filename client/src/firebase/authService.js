import { auth, googleProvider, db } from './config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// ─── Profile Upsert Helper ───────────────────────────────────
const upsertProfile = async (user, additionalData = {}) => {
  const userRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) {
    const newProfile = {
      email: user.email,
      name: user.displayName || additionalData.name || '',
      gymName: additionalData.gymName || '',
      avatar_url: user.photoURL || '',
      created_at: serverTimestamp(),
      ...additionalData
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    // If we just logged in, we might want to update some fields, but usually we just return existing
    return docSnap.data();
  }
};

// ─── Register ────────────────────────────────────────────────
export const signUpEmail = async (email, password, name, gymName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update display name in Firebase
  if (name) {
    await firebaseUpdateProfile(user, { displayName: name });
  }

  // Force token refresh to ensure it's fresh
  await user.getIdToken(true);

  // Sync with Firestore
  const profile = await upsertProfile(user, { name, gymName, avatar_url: user.photoURL });
  return { user, profile };
};

// ─── Login ───────────────────────────────────────────────────
export const signInEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Sync with Firestore
  const profile = await upsertProfile(user, { 
    name: user.displayName, 
    avatar_url: user.photoURL 
  });
  return { user, profile };
};

// ─── Google Login ─────────────────────────────────────────────
export const signInGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Sync with Firestore
  const profile = await upsertProfile(user, { 
    name: user.displayName, 
    avatar_url: user.photoURL 
  });
  return { user, profile };
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
  if (!auth.currentUser) throw new Error('No authenticated user');
  
  const userRef = doc(db, 'users', auth.currentUser.uid);
  
  // Map client snake_case to our schema
  const payload = {
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.gym_name !== undefined || updates.gymName !== undefined && { gymName: updates.gym_name ?? updates.gymName }),
    ...(updates.avatar_url !== undefined && { avatar_url: updates.avatar_url }),
    ...(updates.phone !== undefined && { phone: updates.phone }),
    ...(updates.location !== undefined && { location: updates.location }),
  };
  
  await updateDoc(userRef, payload);
  
  const docSnap = await getDoc(userRef);
  return docSnap.data();
};

// ─── Update Password ─────────────────────────────────────────
export const updatePassword = async (newPassword) => {
  if (auth.currentUser) {
    await firebaseUpdatePassword(auth.currentUser, newPassword);
  } else {
    throw new Error('No authenticated user');
  }
};

// ─── Upload Avatar (Base64 stored in Firestore) ────────────────
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
