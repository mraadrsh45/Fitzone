import api from '../services/api';

const TOKEN_KEY = 'fitzone_token';
const USER_KEY  = 'fitzone_user';

// ─── Helpers ─────────────────────────────────────────────────
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser  = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
};
const storeSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ─── Register ────────────────────────────────────────────────
export const signUp = async ({ email, password, name, gymName }) => {
  const res = await api.post('/auth/register', { name, email, password, gymName });
  storeSession(res);
  return { user: res.user, session: { access_token: res.token } };
};

// ─── Login ───────────────────────────────────────────────────
export const signIn = async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password });
  storeSession(res);
  return { user: res.user, session: { access_token: res.token } };
};

// ─── Logout ──────────────────────────────────────────────────
export const signOut = async () => {
  clearSession();
};

// ─── Get Session (token-based) ────────────────────────────────
export const getSession = async () => {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const res = await api.get('/auth/me');
    return { user: res.user, access_token: token };
  } catch {
    clearSession();
    return null;
  }
};

// ─── Get Profile ─────────────────────────────────────────────
export const getProfile = async (userId) => {
  const res = await api.get('/auth/me');
  const u   = res.user;
  return {
    id:         u.id,
    name:       u.name,
    gym_name:   u.gymName,
    avatar_url: u.avatar_url || '',
    email:      u.email,
  };
};

// ─── Update Profile ──────────────────────────────────────────
export const updateProfile = async (userId, updates) => {
  // Map client snake_case to server expected fields
  const payload = {
    name:       updates.name,
    gymName:    updates.gym_name ?? updates.gymName,
    avatar_url: updates.avatar_url,
    phone:      updates.phone,
    location:   updates.location,
  };
  const res = await api.put('/auth/profile', payload);
  // Refresh stored user
  localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  return res.user;
};

// ─── Update Password ─────────────────────────────────────────
export const updatePassword = async (newPassword) => {
  await api.put('/auth/password', { newPassword });
};

// ─── Upload Avatar (Base64 stored in MongoDB) ─────────────────
export const uploadAvatar = async (userId, file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const avatar_url = e.target.result;           // data: URI
        await updateProfile(userId, { avatar_url });
        resolve(avatar_url);
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ─── Google OAuth stub (not supported without Supabase) ───────
export const signInWithGoogle = async () => {
  throw new Error('Google Sign-In is not available. Please use email/password.');
};

// ─── Reset Password stub ─────────────────────────────────────
export const resetPassword = async (email) => {
  throw new Error('Password reset email not yet available. Contact admin.');
};
