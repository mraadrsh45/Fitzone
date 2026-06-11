import api from '../services/api';

// ─── Create Lead ─────────────────────────────────────────────
export const createLead = async (leadData) => {
  const res = await api.post('/leads/create', leadData);
  return res.data;
};

export const bulkCreateLeads = async (leadsData) => {
  const res = await api.post('/leads/bulk', { leads: leadsData });
  return res.data;
};

// ─── Get All Leads ───────────────────────────────────────────
export const getLeads = async ({ status, search } = {}) => {
  const params = {};
  if (status && status !== 'all') params.status = status;
  if (search) params.search = search;
  const res = await api.get('/leads/all', { params });
  return res.data;
};

// ─── Update Lead ─────────────────────────────────────────────
export const updateLead = async (id, updates) => {
  const res = await api.put(`/leads/${id}`, updates);
  return res.data;
};

// ─── Delete Lead ─────────────────────────────────────────────
export const deleteLead = async (id) => {
  await api.delete(`/leads/${id}`);
};

// ─── Get Lead Counts ─────────────────────────────────────────
export const getLeadCounts = async () => {
  const leads = await getLeads();
  return leads.reduce((acc, lead) => {
    acc.all = (acc.all || 0) + 1;
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});
};

// ─── Export Leads as CSV ─────────────────────────────────────
export const exportLeadsCSV = async () => {
  const leads = await getLeads();
  const headers = ['Name', 'Email', 'Phone', 'Goal', 'Membership', 'Status', 'Date'];
  const rows = leads.map(l => [
    l.customer_name, l.email, l.phone, l.fitness_goal,
    l.membership_interest, l.status,
    new Date(l.created_at).toLocaleDateString('en-IN'),
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fitzoneai-leads-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Realtime stub (no Supabase — return no-op) ───────────────
export const subscribeToLeads = (callback) => {
  // No real-time without Supabase; return a dummy subscription
  return { unsubscribe: () => {} };
};
