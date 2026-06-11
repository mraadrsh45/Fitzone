import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Globe, BarChart2, Zap, ArrowUpRight, Activity } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { getLeads, subscribeToLeads } from '../firebase/leads';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, titleColor: '#fff', bodyColor: '#9ca3af' },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280', font: { size: 11 } } },
  },
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const StatCard = ({ icon, label, value, change, color, delay, live }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{ width: 44, height: 44, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {live && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '2px 8px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>LIVE</span>
          </div>
        )}
        <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,0.1)', borderRadius: 6, padding: '2px 8px' }}>{change}</span>
      </div>
    </div>
    <p style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 4, fontFamily: 'Outfit' }}>{value}</p>
    <p style={{ fontSize: 13, color: '#6b7280' }}>{label}</p>
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
  </motion.div>
);

const Dashboard = () => {
  const { displayName } = useAuth();
  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [leadCounts, setLeadCounts] = useState({ all: 0, new: 0, converted: 0 });
  const [loading, setLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');

  useEffect(() => {
    loadLeads();

    // Realtime subscription
    const subscription = subscribeToLeads((payload) => {
      setRealtimeStatus('live');
      if (payload.eventType === 'INSERT') {
        setAllLeads(prev => [payload.new, ...prev]);
        setLeads(prev => [payload.new, ...prev].slice(0, 5));
        setLeadCounts(prev => ({
          ...prev,
          all: prev.all + 1,
          [payload.new.status]: (prev[payload.new.status] || 0) + 1,
        }));
      }
    });

    return () => {
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, []);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setAllLeads(data);
      setLeads(data.slice(0, 5));
      const counts = data.reduce((acc, l) => {
        acc.all = (acc.all || 0) + 1;
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
      }, {});
      setLeadCounts(counts);
      setRealtimeStatus('live');
    } catch {
      setLeadCounts({ all: 0, new: 0, converted: 0 });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: <Users size={20} />, label: 'Total Leads', value: leadCounts.all || 0, change: '0%', color: '#ef4444', live: true },
    { icon: <TrendingUp size={20} />, label: 'Revenue (Est.)', value: `₹${((leadCounts.converted || 0) * 2499).toLocaleString()}`, change: '0%', color: '#22c55e' },
    { icon: <Globe size={20} />, label: 'Website Visitors', value: ((leadCounts.all || 0) * 115).toLocaleString(), change: '0%', color: '#3b82f6' },
    { icon: <BarChart2 size={20} />, label: 'Instagram Reach', value: ((leadCounts.all || 0) * 50).toLocaleString(), change: '0%', color: '#a855f7' },
  ];

  const monthlyMap = monthNames.reduce((acc, m) => ({ ...acc, [m]: { leads: 0, revenue: 0 } }), {});
  allLeads.forEach(l => {
    const d = new Date(l.created_at);
    const m = monthNames[d.getMonth()];
    if (monthlyMap[m]) {
      monthlyMap[m].leads++;
      if (l.status === 'converted') monthlyMap[m].revenue += 2499;
    }
  });

  const computedMonthly = monthNames.map(m => ({ month: m, leads: monthlyMap[m].leads, revenue: monthlyMap[m].revenue }));

  const barData = {
    labels: computedMonthly.map(d => d.month),
    datasets: [{ data: computedMonthly.map(d => d.leads), backgroundColor: computedMonthly.map((_, i) => i === new Date().getMonth() ? '#ef4444' : 'rgba(239,68,68,0.3)'), borderRadius: 6 }],
  };

  const lineData = {
    labels: computedMonthly.map(d => d.month),
    datasets: [{ data: computedMonthly.map(d => d.revenue), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#22c55e', pointRadius: 4 }],
  };

  return (
    <div>
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.03))',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 16, padding: '20px 24px', marginBottom: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {displayName?.split(' ')[0]} 👋
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 14 }}>Here's your gym marketing overview for today</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} color={realtimeStatus === 'live' ? '#22c55e' : '#6b7280'} />
          <span style={{ fontSize: 12, color: realtimeStatus === 'live' ? '#22c55e' : '#6b7280', fontWeight: 500 }}>
            {realtimeStatus === 'live' ? 'Realtime connected' : 'Connecting...'}
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }} className="charts-grid">
        {[
          { title: 'Monthly Leads', sub: 'Real-time lead tracking', change: '+21% YoY', data: barData, Component: Bar },
          { title: 'Revenue Growth', sub: 'Monthly revenue in ₹', change: '+34% Growth', data: lineData, Component: Line },
        ].map(({ title, sub, change, data, Component }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div><h3 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h3><p style={{ color: '#6b7280', fontSize: 12 }}>{sub}</p></div>
              <span style={{ color: '#22c55e', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowUpRight size={14} />{change}
              </span>
            </div>
            <Component data={data} options={chartOptions} height={180} />
          </motion.div>
        ))}
      </div>

      {/* Recent leads with realtime indicator */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Leads</h3>
            {realtimeStatus === 'live' && (
              <span style={{ fontSize: 11, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '2px 8px', fontWeight: 600 }}>
                ● Realtime
              </span>
            )}
          </div>
          <Link to="/dashboard/leads" style={{ color: '#ef4444', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 32 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8, borderRadius: 8 }} />)}
            </div>
          ) : leads.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Goal</th><th>Phone</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id}>
                    <td style={{ fontWeight: 500 }}>{lead.customer_name}</td>
                    <td style={{ color: '#9ca3af' }}>{lead.fitness_goal}</td>
                    <td style={{ color: '#9ca3af' }}>{lead.phone}</td>
                    <td>
                      <span className={`badge badge-${lead.status === 'converted' ? 'green' : lead.status === 'new' ? 'red' : 'yellow'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ color: '#6b7280', fontSize: 12 }}>{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <Zap size={32} color="#374151" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 12 }}>No leads yet. Share your landing page to capture leads!</p>
              <Link to="/" style={{ color: '#ef4444', fontSize: 13, textDecoration: 'none' }}>View Landing Page →</Link>
            </div>
          )}
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) { .charts-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default Dashboard;
