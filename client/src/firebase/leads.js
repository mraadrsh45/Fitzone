import { db, auth } from './config';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp, onSnapshot, writeBatch } from 'firebase/firestore';

const getUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return user.uid;
};

// Get all leads
export const getLeads = async () => {
  const uid = getUserId();
  const leadsRef = collection(db, 'users', uid, 'leads');
  const q = query(leadsRef);
  const snapshot = await getDocs(q);
  
  const leads = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at?.toDate()?.toISOString() || new Date().toISOString()
  }));

  leads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return leads;
};

// Create a new lead
export const createLead = async (leadData) => {
  const uid = getUserId();
  const leadsRef = collection(db, 'users', uid, 'leads');
  const cleanData = Object.fromEntries(Object.entries(leadData).filter(([_, v]) => v !== undefined));
  const docRef = await addDoc(leadsRef, { ...cleanData, created_at: serverTimestamp() });
  return { id: docRef.id, ...cleanData };
};

// Update an existing lead
export const updateLead = async (id, updates) => {
  const uid = getUserId();
  const leadRef = doc(db, 'users', uid, 'leads', id);
  await updateDoc(leadRef, updates);
  return { id, ...updates };
};

// Delete a lead
export const deleteLead = async (id) => {
  const uid = getUserId();
  const leadRef = doc(db, 'users', uid, 'leads', id);
  await deleteDoc(leadRef);
};

// Subscribe to real-time changes
export const subscribeToLeads = (callback) => {
  const user = auth.currentUser;
  if (!user) return () => {};
  
  const leadsRef = collection(db, 'users', user.uid, 'leads');
  
  const unsubscribe = onSnapshot(leadsRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const lead = {
        id: change.doc.id,
        ...change.doc.data(),
        created_at: change.doc.data().created_at?.toDate()?.toISOString() || new Date().toISOString()
      };
      
      let eventType = '';
      if (change.type === 'added') eventType = 'INSERT';
      if (change.type === 'modified') eventType = 'UPDATE';
      if (change.type === 'removed') eventType = 'DELETE';

      callback({
        eventType,
        new: (eventType === 'INSERT' || eventType === 'UPDATE') ? lead : null,
        old: eventType === 'DELETE' ? lead : null,
      });
    });
  });

  // Provide an unsubscribe method to match Supabase's API slightly or be called directly
  return { unsubscribe };
};

// Export to CSV
export const exportLeadsCSV = async () => {
  const leads = await getLeads();
  const headers = ['Name', 'Phone', 'Goal', 'Status', 'Date Added'];
  const csvContent = [
    headers.join(','),
    ...leads.map(lead => [
      `"${lead.customer_name || ''}"`,
      `"${lead.phone || ''}"`,
      `"${lead.fitness_goal || ''}"`,
      `"${lead.status || ''}"`,
      `"${new Date(lead.created_at).toLocaleDateString()}"`
    ].join(','))
  ].join('\\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'leads_export_' + new Date().getTime() + '.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Bulk create (for importing)
export const bulkCreateLeads = async (leadsData) => {
  const uid = getUserId();
  const batch = writeBatch(db);
  const leadsRef = collection(db, 'users', uid, 'leads');

  leadsData.forEach(lead => {
    const docRef = doc(leadsRef); // Auto-generate ID
    batch.set(docRef, { ...lead, created_at: serverTimestamp() });
  });

  await batch.commit();
};
