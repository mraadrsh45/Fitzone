import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Zap, Globe, BarChart2, Users,
  Settings, Menu, X, Dumbbell, LogOut, ChevronRight, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { path: '/dashboard/ai', label: 'AI Generator', icon: <Zap size={18} /> },
  { path: '/dashboard/seo', label: 'SEO Tools', icon: <Globe size={18} /> },
  { path: '/dashboard/analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { path: '/dashboard/leads', label: 'Leads', icon: <Users size={18} /> },
  { path: '/dashboard/settings', label: 'Settings', icon: <Settings size={18} /> },
];

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/dashboard/ai': 'AI Content Generator',
  '/dashboard/seo': 'Local SEO Tools',
  '/dashboard/analytics': 'Analytics & Reports',
  '/dashboard/leads': 'Lead Management',
  '/dashboard/settings': 'Account Settings',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, displayName, gymName, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Logout failed');
    }
  };

  const avatarUrl = profile?.avatar_url;
  const initials = displayName?.charAt(0)?.toUpperCase() || 'U';
  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ef4444, #b91c1c)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Dumbbell size={19} color="white" />
        </div>
        {sidebarOpen && (
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Outfit' }}>FitZone <span style={{ color: '#ef4444' }}>AI</span></p>
            <p style={{ fontSize: 10, color: '#4b5563' }}>Marketing Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: sidebarOpen ? '11px 14px' : '11px 0', justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderRadius: 10, textDecoration: 'none',
              background: isActive ? 'rgba(239,68,68,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid #ef4444' : '3px solid transparent',
              color: isActive ? '#ef4444' : '#6b7280',
              fontSize: 14, fontWeight: isActive ? 600 : 400,
              transition: 'all 0.2s ease',
            })}
          >
            {item.icon}
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div style={{ padding: '16px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {sidebarOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 8 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {initials}
              </div>
            )}
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</p>
              <p style={{ fontSize: 11, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{gymName || user?.email}</p>
            </div>
          </div>
        ) : null}
        <button onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 12px', justifyContent: sidebarOpen ? 'flex-start' : 'center',
            borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.08)',
            color: '#ef4444', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
        >
          <LogOut size={16} />
          {sidebarOpen && 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 68 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0, overflow: 'hidden',
          position: 'sticky', top: 0, height: '100vh',
        }}
        className="desktop-sidebar"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 40 }}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 250, background: '#111', borderRight: '1px solid rgba(255,255,255,0.08)', zIndex: 50, overflow: 'hidden' }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.01)', position: 'sticky', top: 0, zIndex: 30, backdropFilter: 'blur(10px)' }}>
          {/* Mobile menu */}
          <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} className="mobile-menu-btn">
            <Menu size={20} />
          </button>

          {/* Desktop toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }} className="desktop-sidebar-toggle">
            {sidebarOpen ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>

          {/* Page title */}
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 700 }}>{pageTitle}</h1>
            <p style={{ fontSize: 12, color: '#4b5563' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Supabase badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#22c55e', fontWeight: 500 }} className="supabase-badge">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              Supabase Connected
            </div>

            {/* Bell */}
            <button style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', cursor: 'pointer' }}>
              <Bell size={16} />
            </button>

            {/* Avatar */}
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(239,68,68,0.3)' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .desktop-sidebar-toggle { display: none !important; }
          .supabase-badge { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
