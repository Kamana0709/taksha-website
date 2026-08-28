import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import { useAuth } from '../../context/AuthContext';
import { Pencil, Save, X } from 'lucide-react';
import './InternProfile.css';

export default function InternProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: user?.phone || '',
    location: user?.location || ''
  });
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({
      phone: user?.phone || '',
      location: user?.location || ''
    });
    setError('');
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    setError('');
    const res = await updateProfile(editData);
    if (res.success) {
      setIsEditing(false);
    } else {
      setError(res.error || 'Failed to save changes.');
    }
    setIsSaving(false);
  };

  return (
    <>
      <SEO title="My Profile | Taksha Workspace" />
      <div className="intern-profile">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">My Profile</h1>
            <p className="intern-tasks__subtitle">Your official Taksha intern record.</p>
          </div>
          <div>
             {!isEditing ? (
               <button className="intern-btn intern-btn--view" onClick={handleEditClick} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                 <Pencil size={16} /> Edit Profile
               </button>
             ) : (
               <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                 <button className="intern-btn intern-btn--view" onClick={handleCancelClick} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-bg)' }}>
                   <X size={16} /> Cancel
                 </button>
                 <button className="intern-btn intern-btn--assign" onClick={handleSaveClick} disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                   <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
                 </button>
               </div>
             )}
          </div>
        </header>

        {error && <div style={{ color: 'var(--color-card-pink)', marginBottom: 'var(--space-4)', fontWeight: 800 }}>{error}</div>}

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">{user?.initials || 'KA'}</div>
            <div>
              <h2 className="profile-title">{user?.name || 'Kamana Agrawal'}</h2>
              <div className="profile-role">Frontend Track Intern</div>
            </div>
          </div>
          
          <div className="profile-body">
            <div>
              <div className="profile-info-group">
                <div className="profile-label">Email Address</div>
                <div className="profile-value">{user?.email || 'kamana@taksha.in'}</div>
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Phone Number</div>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="profile-input" 
                    value={editData.phone} 
                    onChange={e => setEditData({...editData, phone: e.target.value})} 
                    placeholder="+91 98765 43210"
                  />
                ) : (
                  <div className="profile-value">{user?.phone || '+91 98765 43210'}</div>
                )}
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Location</div>
                {isEditing ? (
                  <input 
                    type="text" 
                    className="profile-input" 
                    value={editData.location} 
                    onChange={e => setEditData({...editData, location: e.target.value})} 
                    placeholder="Remote (India)"
                  />
                ) : (
                  <div className="profile-value">{user?.location || 'Remote (India)'}</div>
                )}
              </div>
            </div>
            
            <div>
              <div className="profile-info-group">
                <div className="profile-label">Intern ID</div>
                <div className="profile-value">TAK-2026-042</div>
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Lead Mentor</div>
                <div className="profile-value">Mentor Kamana</div>
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Start Date</div>
                <div className="profile-value">01 May 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
