import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Camera, Save, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfileData, uploadAvatar, updatePassword } from '../firebase/authService';
import toast from 'react-hot-toast';

const Section = ({ title, icon, children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}
  >
    <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>{icon}</div>
      <h3 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h3>
    </div>
    <div style={{ padding: 24 }}>{children}</div>
  </motion.div>
);

const Toggle = ({ label, desc, value, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    <div><p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{label}</p><p style={{ fontSize: 12, color: '#6b7280' }}>{desc}</p></div>
    <div onClick={onChange} style={{ width: 44, height: 24, borderRadius: 12, background: value ? '#ef4444' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.3s' }}>
      <div style={{ position: 'absolute', top: 2, left: value ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </div>
  </div>
);

const Settings = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: profile?.name || '',
    gym_name: profile?.gymName || profile?.gym_name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        gym_name: profile.gymName || profile.gym_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
      });
    }
  }, [profile]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [notifications, setNotifications] = useState({ newLeads: true, weeklyReport: true, aiUpdates: false });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfileData(profileForm);
      refreshProfile();
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    setUploadingAvatar(true);
    try {
      const publicUrl = await uploadAvatar(file);
      // uploadAvatar automatically calls updateProfileData internally, so we don't need to call it again
      refreshProfile();
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar. Check Supabase storage bucket.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setChangingPassword(true);
    try {
      await updatePassword(passwords.newPassword);
      setPasswords({ newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const avatarUrl = profile?.avatar_url;
  const initials = (profile?.name || user?.email || 'U').charAt(0).toUpperCase();



  return (
    <div style={{ maxWidth: 720 }}>
      {/* Avatar + Account Info */}
      <Section title="Profile & Account" icon={<User size={18} />}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ position: 'relative' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(239,68,68,0.3)' }} />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', border: '3px solid rgba(239,68,68,0.3)' }}>
                {initials}
              </div>
            )}
            <label style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #0a0a0a' }}>
              <Camera size={12} color="white" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 16 }}>{profile?.name || user?.email}</p>
            <p style={{ color: '#6b7280', fontSize: 13 }}>{user?.email}</p>
            <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
              {uploadingAvatar ? 'Uploading...' : 'Click camera to change avatar'}
            </p>
          </div>
        </div>

        {/* Predefined Avatars */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>Or choose a preset avatar:</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
              'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
              'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
              'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
              'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily'
            ].map((url) => (
              <img 
                key={url} 
                src={url} 
                onClick={async () => {
                  try {
                    await updateProfileData({ avatar_url: url });
                    refreshProfile();
                    toast.success('Avatar updated!');
                  } catch (err) {
                    toast.error('Failed to update avatar');
                  }
                }}
                alt="preset" 
                style={{ 
                  width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', 
                  border: avatarUrl === url ? '2px solid #ef4444' : '2px solid transparent',
                  background: 'rgba(255,255,255,0.05)', transition: 'border 0.2s'
                }} 
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Full Name', key: 'name' },
            { label: 'Gym Name', key: 'gym_name' },
            { label: 'Phone', key: 'phone' },
            { label: 'Location', key: 'location' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="form-label">{label}</label>
              <input className="form-input" value={profileForm[key]} onChange={e => setProfileForm({ ...profileForm, [key]: e.target.value })} placeholder={`Your ${label.toLowerCase()}`} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 4 }}>
          <label className="form-label">Email Address</label>
          <input className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
          <p style={{ color: '#4b5563', fontSize: 11, marginTop: 4 }}>Email cannot be changed after registration</p>
        </div>
        <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-primary" style={{ marginTop: 20 }}>
          {savingProfile ? 'Saving...' : <><Save size={15} /> Save Profile</>}
        </button>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={<Bell size={18} />}>
        <Toggle label="New Lead Alerts" desc="Get notified when a new lead submits a form" value={notifications.newLeads} onChange={() => setNotifications(p => ({ ...p, newLeads: !p.newLeads }))} />
        <Toggle label="Weekly Reports" desc="Receive weekly analytics summary every Monday" value={notifications.weeklyReport} onChange={() => setNotifications(p => ({ ...p, weeklyReport: !p.weeklyReport }))} />
        <Toggle label="AI Feature Updates" desc="Updates about new AI tools and features" value={notifications.aiUpdates} onChange={() => setNotifications(p => ({ ...p, aiUpdates: !p.aiUpdates }))} />
        <button onClick={() => toast.success('Preferences saved!')} className="btn-primary" style={{ marginTop: 16 }}>
          <Save size={15} /> Save Preferences
        </button>
      </Section>

      {/* Security */}
      <Section title="Security" icon={<Shield size={18} />}>
        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#22c55e' }}>
          ✅ Authenticated via <strong>JWT Auth</strong> — Your data is encrypted and secure
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" placeholder="Min. 6 characters" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="Repeat password" value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
          </div>
        </div>
        <button onClick={handleChangePassword} disabled={changingPassword || !passwords.newPassword} className="btn-primary">
          <Shield size={15} /> {changingPassword ? 'Updating...' : 'Update Password'}
        </button>
      </Section>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#3b82f6', marginBottom: 8 }}>🔗 MongoDB Integration</h3>
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 12 }}>This platform is powered by MongoDB Atlas + Node.js/Express — fast, scalable, and reliable.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Auth Provider', value: 'JWT (bcrypt hashed)' },
            { label: 'Database', value: 'MongoDB Atlas' },
            { label: 'API Layer', value: 'Node.js + Express' },
            { label: 'Storage', value: 'Base64 in MongoDB' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px' }}>
              <p style={{ fontSize: 11, color: '#4b5563' }}>{item.label}</p>
              <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ef4444', marginBottom: 8 }}>⚠️ Danger Zone</h3>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>Permanently delete your account and all data. This cannot be undone.</p>
        <button onClick={() => toast.error('Account deletion disabled for demo.')} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Delete Account
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;
