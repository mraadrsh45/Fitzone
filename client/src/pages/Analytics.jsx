import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bar, Line, Pie, Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { TrendingUp, Users, DollarSign, BarChart2, Globe } from 'lucide-react';
import { getLeads } from '../supabase/leads';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const cOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
      titleColor: '#fff', bodyColor: '#9ca3af',
    },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b7280', font: { size: 11 } } },
  },
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 16, font: { size: 12 } } },
    tooltip: { backgroundColor: '#1a1a1a', titleColor: '#fff', bodyColor: '#9ca3af' },
  },
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const leads = await getLeads();

        // Compute metrics
        const totalLeads = leads.length;
        const convertedLeads = leads.filter(l => l.status === 'converted').length;
        const newLeads = leads.filter(l => l.status === 'new').length;
        const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

        // Map memberships count
        const membershipCounts = leads.reduce((acc, lead) => {
          const plan = lead.membership_interest || 'basic';
          acc[plan] = (acc[plan] || 0) + 1;
          return acc;
        }, {});

        const finalBreakdown = [
          { plan: 'Basic (₹999)',  count: membershipCounts['basic']  || 0 },
          { plan: 'Pro (₹2499)',   count: membershipCounts['pro']    || 0 },
          { plan: 'Elite (₹7999)', count: membershipCounts['elite']  || 0 },
        ];

        // Group leads by month of creation
        const monthlyLeadsMap = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        monthNames.forEach(m => {
          monthlyLeadsMap[m] = 0;
        });

        leads.forEach(l => {
          const date = new Date(l.created_at);
          const monthName = monthNames[date.getMonth()];
          if (monthlyLeadsMap[monthName] !== undefined) {
            monthlyLeadsMap[monthName]++;
          }
        });

        const monthlyLeads = monthNames.map((m) => {
          const leadsCount = monthlyLeadsMap[m] || 0;
          return {
            month: m,
            leads: leadsCount,
            revenue: leadsCount * 999, // Simplified estimation based on basic plan
            visitors: leadsCount * 30,
          };
        });

        setData({
          overview: {
            totalLeads,
            convertedLeads,
            newLeads,
            conversionRate: `${conversionRate}%`,
            totalRevenue: `₹${(convertedLeads * 2499 + newLeads * 999).toLocaleString()}`,
            websiteVisitors: totalLeads * 115,
            instagramReach: totalLeads * 50,
            activeMemberships: convertedLeads,
          },
          monthlyLeads,
          membershipBreakdown: finalBreakdown,
          campaignPerformance: [],
        });
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setData({
          overview: {
            totalLeads: 0, convertedLeads: 0, totalRevenue: '₹0',
            websiteVisitors: 0, instagramReach: 0, activeMemberships: 0,
          },
          monthlyLeads: monthNames.map(m => ({ month: m, leads: 0, revenue: 0, visitors: 0 })),
          membershipBreakdown: [
            { plan: 'Basic (₹999)', count: 0 },
            { plan: 'Pro (₹2499)', count: 0 },
            { plan: 'Elite (₹7999)', count: 0 },
          ],
          campaignPerformance: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 300, borderRadius: 16 }} />)}
      </div>
    );
  }

  const months = data.monthlyLeads.map(d => d.month);

  const leadsBarData = {
    labels: months,
    datasets: [{
      label: 'Leads',
      data: data.monthlyLeads.map(d => d.leads),
      backgroundColor: 'rgba(239,68,68,0.4)',
      borderColor: '#ef4444',
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  };

  const revenueLineData = {
    labels: months,
    datasets: [{
      label: 'Revenue (₹)',
      data: data.monthlyLeads.map(d => d.revenue),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.08)',
      fill: true, tension: 0.4,
      pointBackgroundColor: '#22c55e', pointRadius: 4,
    }],
  };

  const visitorsLineData = {
    labels: months,
    datasets: [{
      label: 'Visitors',
      data: data.monthlyLeads.map(d => d.visitors),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      fill: true, tension: 0.4,
      pointBackgroundColor: '#3b82f6', pointRadius: 4,
    }],
  };

  const membershipPieData = {
    labels: data.membershipBreakdown.map(d => d.plan),
    datasets: [{
      data: data.membershipBreakdown.map(d => d.count),
      backgroundColor: ['rgba(239,68,68,0.8)', 'rgba(239,68,68,0.5)', 'rgba(239,68,68,0.25)'],
      borderColor: ['#ef4444', '#ef4444', '#ef4444'],
      borderWidth: 1,
    }],
  };

  const socialData = {
    labels: ['Instagram', 'Facebook', 'YouTube', 'Google'],
    datasets: [{
      data: [
        data.overview.instagramReach,
        data.overview.instagramReach * 0.6,
        data.overview.instagramReach * 0.4,
        data.overview.websiteVisitors * 0.8
      ],
      backgroundColor: ['rgba(225,48,108,0.7)', 'rgba(24,119,242,0.7)', 'rgba(255,0,0,0.7)', 'rgba(66,133,244,0.7)'],
      borderWidth: 0,
    }],
  };

  const ChartCard = ({ title, subtitle, children, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: 24,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{title}</h3>
        {subtitle && <p style={{ color: '#6b7280', fontSize: 12 }}>{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Revenue', value: data.overview.totalRevenue, icon: <DollarSign size={18} />, color: '#22c55e' },
          { label: 'Total Leads', value: data.overview.totalLeads, icon: <Users size={18} />, color: '#ef4444' },
          { label: 'Web Visitors', value: data.overview.websiteVisitors?.toLocaleString(), icon: <Globe size={18} />, color: '#3b82f6' },
          { label: 'Insta Reach', value: data.overview.instagramReach?.toLocaleString(), icon: <BarChart2 size={18} />, color: '#e1306c' },
          { label: 'Active Members', value: data.overview.activeMemberships, icon: <TrendingUp size={18} />, color: '#a855f7' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="stat-card"
          >
            <div style={{
              width: 36, height: 36,
              background: `${item.color}18`, border: `1px solid ${item.color}25`,
              borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: item.color, marginBottom: 12,
            }}>
              {item.icon}
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit' }}>{item.value}</p>
            <p style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}
        className="analytics-grid"
      >
        <ChartCard title="Monthly Leads" subtitle="Lead acquisition per month" delay={0.1}>
          <Bar data={leadsBarData} options={cOptions} height={200} />
        </ChartCard>

        <ChartCard title="Revenue Growth" subtitle="Monthly revenue in ₹" delay={0.2}>
          <Line data={revenueLineData} options={{ ...cOptions, scales: { ...cOptions.scales, y: { ...cOptions.scales.y, ticks: { ...cOptions.scales.y.ticks, callback: v => `₹${(v/1000).toFixed(0)}K` } } } }} height={200} />
        </ChartCard>

        <ChartCard title="Website Traffic" subtitle="Monthly unique visitors" delay={0.3}>
          <Line data={visitorsLineData} options={cOptions} height={200} />
        </ChartCard>

        <ChartCard title="Membership Breakdown" subtitle="Distribution by plan type" delay={0.4}>
          <Doughnut data={membershipPieData} options={pieOptions} height={200} />
        </ChartCard>

        <ChartCard title="Social Media Reach" subtitle="Platform-wise audience reach" delay={0.5}>
          <Pie data={socialData} options={{
            ...pieOptions,
            plugins: {
              ...pieOptions.plugins,
              legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 12, font: { size: 11 } } }
            }
          }} height={200} />
        </ChartCard>

        {/* Campaign performance */}
        <ChartCard title="Campaign Performance" subtitle="ROI per campaign" delay={0.6}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Clicks</th>
                  <th>Conversions</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {data.campaignPerformance.length > 0 ? data.campaignPerformance.map((c, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td>{c.clicks.toLocaleString()}</td>
                    <td>{c.conversions}</td>
                    <td><span style={{ color: '#22c55e', fontWeight: 700 }}>{c.roi}</span></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#6b7280', padding: 20 }}>No campaign data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Analytics;
