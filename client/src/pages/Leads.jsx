import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, CheckCircle, Phone, Mail, Target, Search, Download, RefreshCw, Upload } from 'lucide-react';
import { getLeads, createLead, updateLead, deleteLead, subscribeToLeads, exportLeadsCSV, bulkCreateLeads } from '../supabase/leads';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statusColors = {
  new: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  contacted: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.25)' },
  converted: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
  lost: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.25)' },
};

const Leads = () => {
  const { user, profile } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ customer_name: '', email: '', phone: '', fitness_goal: '', membership_interest: 'basic' });
  const [submitting, setSubmitting] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeads({ status: filter !== 'all' ? filter : undefined, search });
      setLeads(data || []);
    } catch (err) {
      console.error('Error loading leads:', err);
      toast.error(err.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Realtime subscription
  useEffect(() => {
    const subscription = subscribeToLeads((payload) => {
      if (payload.eventType === 'INSERT') {
        setLeads(prev => [payload.new, ...prev]);
        toast.success(`🔔 New lead: ${payload.new.customer_name}`);
      } else if (payload.eventType === 'UPDATE') {
        setLeads(prev => prev.map(l => l.id === payload.new.id ? payload.new : l));
      } else if (payload.eventType === 'DELETE') {
        setLeads(prev => prev.filter(l => l.id !== payload.old.id));
      }
    });
    return () => {
      if (subscription?.unsubscribe) subscription.unsubscribe();
      else if (supabase?.removeChannel) supabase.removeChannel(subscription);
    };
  }, []);

  const handleAddLead = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newLead = await createLead({ ...form, user_id: profile?.id });
      toast.success('Lead added successfully!');
      setLeads(prev => [newLead, ...prev]);
      setForm({ customer_name: '', email: '', phone: '', fitness_goal: '', membership_interest: 'basic' });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding lead:', err);
      toast.error(err.message || 'Failed to add lead');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateLead(id, { status });
      toast.success(`Marked as ${status}`);
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
    } catch (err) {
      console.error('Error deleting lead:', err);
      toast.error(err.message || 'Failed to delete lead');
    }
  };

  const handleExport = async () => {
    try {
      await exportLeadsCSV();
      toast.success('CSV exported successfully!');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) throw new Error('CSV file is empty or has no data rows');
        
        // Simple CSV parser for standard quotes handling
        const parseCSVLine = (text) => {
          const re = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
          return text.split(re).map(x => x.replace(/^"|"$/g, '').trim());
        };

        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
        const mappedData = [];
        
        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVLine(lines[i]);
          if (row.length < headers.length) continue; // Skip malformed rows
          
          const lead = {};
          headers.forEach((header, index) => {
            const val = row[index];
            if (header.includes('name')) lead.customer_name = val;
            if (header.includes('email')) lead.email = val;
            if (header.includes('phone') || header.includes('contact')) lead.phone = val;
            if (header.includes('goal')) lead.fitness_goal = val;
            if (header.includes('plan') || header.includes('membership') || header.includes('interest')) lead.membership_interest = val.toLowerCase();
          });
          
          if (lead.customer_name && lead.phone) {
            mappedData.push(lead);
          }
        }
        
        if (mappedData.length === 0) throw new Error('No valid leads found in CSV (Need at least Name and Phone columns)');
        
        await bulkCreateLeads(mappedData);
        toast.success(`Successfully imported ${mappedData.length} leads!`);
        loadLeads();
      } catch (err) {
        console.error('Import error:', err);
        toast.error(err.message || 'Failed to import CSV');
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
      setImporting(false);
    };
    reader.readAsText(file);
  };

  const counts = leads.reduce((acc, l) => {
    acc.all = (acc.all || 0) + 1;
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <Users size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Lead Management</h2>
            <p style={{ color: '#6b7280', fontSize: 13 }}>{leads.length} leads • Realtime sync active</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 16px', color: '#9ca3af', cursor: 'pointer', fontSize: 13 }}>
            <Download size={15} /> Export
          </button>
          
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} disabled={importing} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 16px', color: '#9ca3af', cursor: 'pointer', fontSize: 13, opacity: importing ? 0.5 : 1 }}>
            <Upload size={15} /> {importing ? 'Importing...' : 'Import CSV'}
          </button>
          <button onClick={loadLeads} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: '#9ca3af', cursor: 'pointer' }}>
            <RefreshCw size={15} />
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={16} /> Add Lead
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.form onSubmit={handleAddLead} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: 24, marginBottom: 24 }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Add New Lead</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {[
              { label: 'Name', key: 'customer_name', placeholder: 'Customer name' },
              { label: 'Email', key: 'email', placeholder: 'email@example.com', type: 'email' },
              { label: 'Phone', key: 'phone', placeholder: '+91 XXXXX XXXXX' },
            ].map(({ label, key, placeholder, type = 'text' }) => (
              <div key={key}>
                <label className="form-label">{label}</label>
                <input className="form-input" type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
              </div>
            ))}
            <div>
              <label className="form-label">Fitness Goal</label>
              <select className="form-input" value={form.fitness_goal} onChange={e => setForm({ ...form, fitness_goal: e.target.value })} required>
                <option value="">Select goal...</option>
                {['Weight Loss', 'Muscle Building', 'General Fitness', 'Cardio & Endurance', 'Yoga & Flexibility'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Membership Interest</label>
              <select className="form-input" value={form.membership_interest} onChange={e => setForm({ ...form, membership_interest: e.target.value })}>
                <option value="basic">Basic (₹999/mo)</option>
                <option value="pro">Pro (₹2,499/3mo)</option>
                <option value="elite">Elite (₹7,999/yr)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : <><Plus size={15} /> Add Lead</>}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </motion.form>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'new', 'contacted', 'converted', 'lost'].map(key => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: filter === key ? (key === 'all' ? '#ef4444' : statusColors[key]?.color || '#ef4444') : 'rgba(255,255,255,0.05)',
            color: filter === key ? 'white' : '#9ca3af', transition: 'all 0.2s',
          }}>
            {key.charAt(0).toUpperCase() + key.slice(1)} ({counts[key] || 0})
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 14px' }}>
          <Search size={14} color="#6b7280" />
          <input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: 13, width: 150 }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32 }}>{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8, borderRadius: 8 }} />)}</div>
        ) : leads.length === 0 ? (
          <div style={{ padding: 64, textAlign: 'center' }}>
            <Users size={40} color="#374151" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', fontSize: 15 }}>No leads found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Customer</th><th>Contact</th><th>Goal</th><th>Membership</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => {
                  const s = statusColors[lead.status] || statusColors.new;
                  return (
                    <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      <td style={{ color: '#6b7280', fontFamily: 'monospace', fontSize: 11 }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{lead.customer_name}</td>
                      <td>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}><Phone size={10} /> {lead.phone}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={10} /> {lead.email}</div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Target size={12} color="#6b7280" /> {lead.fitness_goal}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, color: '#9ca3af', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '2px 8px' }}>
                          {lead.membership_interest || 'basic'}
                        </span>
                      </td>
                      <td>
                        <select value={lead.status} onChange={e => handleUpdateStatus(lead.id, e.target.value)}
                          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer', outline: 'none', fontWeight: 600 }}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td style={{ color: '#6b7280', fontSize: 12 }}>{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleUpdateStatus(lead.id, 'converted')} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: '#22c55e' }} title="Convert">
                            <CheckCircle size={13} />
                          </button>
                          <button onClick={() => handleDelete(lead.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '5px 7px', cursor: 'pointer', color: '#ef4444' }} title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
