import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "../../context/AuthContext";

interface UserProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogout: () => void;
  onSaveProfile: (updatedData: Partial<UserProfile>) => void;
}

export default function UserProfileSidebar({ isOpen, onClose, user, onLogout, onSaveProfile }: UserProfileSidebarProps) {
  // State to handle inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email, phone: user.phone });

  const handleSave = () => {
    onSaveProfile(formData);
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. The Darkened Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // Closes when clicking outside the sidebar
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 998, backdropFilter: 'blur(2px)'
            }}
          />

          {/* 2. The Sliding Sidebar Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '400px', height: '100vh',
              backgroundColor: 'var(--color-bg)', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
              zIndex: 999, display: 'flex', flexDirection: 'column', padding: 'var(--spacing-lg)'
            }}
          >
            {/* --- HEADER --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-family-headings)', fontSize: 'var(--size-h3)' }}>
                Account
              </h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>
                ✕
              </button>
            </div>

            {/* --- PROFILE INFO & EDITING --- */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              
              {/* Avatar & Premium Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <img 
                  src={user.imageUrl || "https://via.placeholder.com/80"} 
                  alt="Profile" 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }}
                />
                <div>
                  {user.isPremium ? (
                    <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--size-sm)', fontWeight: 'bold' }}>
                      ✨ Premium Member
                    </span>
                  ) : (
                    <span style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--size-sm)' }}>
                      Standard Plan
                    </span>
                  )}
                </div>
              </div>

              {/* Editable Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                <label style={{ fontSize: 'var(--size-sm)', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>Name</label>
                {isEditing ? (
                  <input 
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-family-body)' }}
                  />
                ) : (
                  <p style={{ margin: 0, fontSize: 'var(--size-body)', color: 'var(--color-text-main)' }}>{user.name}</p>
                )}

                <label style={{ fontSize: 'var(--size-sm)', color: 'var(--color-text-muted)', fontWeight: 'bold', marginTop: '8px' }}>Email</label>
                {isEditing ? (
                  <input 
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-family-body)' }}
                  />
                ) : (
                  <p style={{ margin: 0, fontSize: 'var(--size-body)', color: 'var(--color-text-main)' }}>{user.email}</p>
                )}

                <label style={{ fontSize: 'var(--size-sm)', color: 'var(--color-text-muted)', fontWeight: 'bold', marginTop: '8px' }}>Phone</label>
                {isEditing ? (
                  <input 
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-family-body)' }}
                  />
                ) : (
                  <p style={{ margin: 0, fontSize: 'var(--size-body)', color: 'var(--color-text-main)' }}>{user.phone}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleSave} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold' }}>
                      Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} style={{ padding: '10px', backgroundColor: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: 'var(--color-text-main)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', transition: 'var(--transition-fast)' }}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* --- FOOTER (Logout) --- */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
              <button 
                onClick={onLogout} 
                style={{ width: '100%', padding: '12px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                Log Out
              </button>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}