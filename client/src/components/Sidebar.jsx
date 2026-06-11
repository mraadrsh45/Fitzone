import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Zap, Search, BarChart3, Users,
  Settings, LogOut, Dumbbell, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <Zap size={18} />, label: 'AI Generator', path: '/dashboard/ai' },
  { icon: <Search size={18} />, label: 'SEO Tools', path: '/dashboard/seo' },
  { icon: <BarChart3 size={18} />, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: <Users size={18} />, label: 'Leads', path: '/dashboard/leads' },
  { icon: <Settings size={18} />, label: 'Settings', path: '/dashboard/settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            zIndex: 49, display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}

      <motion.aside
        initial={false}
        style={{
          width: 240,
          background: 'rgba(10,10,10,0.98)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          height: '100vh',
          position: 'fixed',
          left: 0, top: 0,
          display: 'flex', flexDirection: 'column',
          zIndex: 50,
          overflowY: 'auto',
        }}
        className="sidebar"
      >
        {/* Logo */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
              borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Dumbbell size={18} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: 'white', fontFamily: 'Outfit' }}>
              FitZone <span style={{ color: '#ef4444' }}>AI</span>
            </span>
          </NavLink>
          <button onClick={onClose} className="sidebar-close" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'none' }}>
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: 'white', truncate: true, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Gym Owner'}
              </p>
              <p style={{ fontSize: 11, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '12px 12px', flex: 1 }}>
          <p style={{ color: '#374151', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px', marginBottom: 4 }}>
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
              <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
              color: '#ef4444', cursor: 'pointer',
              fontSize: 14, fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </motion.aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(${isOpen ? '0' : '-100%'});
            transition: transform 0.3s ease;
          }
          .sidebar-overlay { display: block !important; }
          .sidebar-close { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
