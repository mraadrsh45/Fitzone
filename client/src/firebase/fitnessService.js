import { db, auth } from './config';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';

// Helper to get authenticated user ID
const getUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return user.uid;
};

// ─── Workouts ──────────────────────────────────────────────────
export const createWorkout = async (workoutData) => {
  const uid = getUserId();
  const workoutsRef = collection(db, 'users', uid, 'workouts');
  const newWorkout = { ...workoutData, created_at: serverTimestamp() };
  const docRef = await addDoc(workoutsRef, newWorkout);
  return { id: docRef.id, ...newWorkout };
};

export const getWorkouts = async () => {
  const uid = getUserId();
  const workoutsRef = collection(db, 'users', uid, 'workouts');
  const querySnapshot = await getDocs(workoutsRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ─── Fitness Plans ─────────────────────────────────────────────
export const createFitnessPlan = async (planData) => {
  const uid = getUserId();
  const plansRef = collection(db, 'users', uid, 'fitness_plans');
  const newPlan = { ...planData, created_at: serverTimestamp() };
  const docRef = await addDoc(plansRef, newPlan);
  return { id: docRef.id, ...newPlan };
};

export const getFitnessPlans = async () => {
  const uid = getUserId();
  const plansRef = collection(db, 'users', uid, 'fitness_plans');
  const querySnapshot = await getDocs(plansRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ─── Progress Tracking ─────────────────────────────────────────
export const logProgress = async (progressData) => {
  const uid = getUserId();
  const progressRef = collection(db, 'users', uid, 'progress');
  const newProgress = { ...progressData, created_at: serverTimestamp() };
  const docRef = await addDoc(progressRef, newProgress);
  return { id: docRef.id, ...newProgress };
};

export const getProgressLogs = async () => {
  const uid = getUserId();
  const progressRef = collection(db, 'users', uid, 'progress');
  const querySnapshot = await getDocs(progressRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ─── Subscriptions ─────────────────────────────────────────────
export const createSubscription = async (subscriptionData) => {
  const uid = getUserId();
  const subsRef = collection(db, 'users', uid, 'subscriptions');
  const newSub = { ...subscriptionData, created_at: serverTimestamp(), status: 'active' };
  const docRef = await addDoc(subsRef, newSub);
  return { id: docRef.id, ...newSub };
};

export const getSubscriptions = async () => {
  const uid = getUserId();
  const subsRef = collection(db, 'users', uid, 'subscriptions');
  const querySnapshot = await getDocs(subsRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateSubscription = async (subId, updates) => {
  const uid = getUserId();
  const subRef = doc(db, 'users', uid, 'subscriptions', subId);
  await updateDoc(subRef, updates);
  return { id: subId, ...updates };
};
