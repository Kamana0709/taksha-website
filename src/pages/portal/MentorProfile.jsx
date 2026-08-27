import React from 'react';
import SEO from '../../components/SEO/SEO';
import { useAuth } from '../../context/AuthContext';
import { Mail, Briefcase, Key } from 'lucide-react';

export default function MentorProfile() {
  const { user } = useAuth();

  return (
    <>
      <SEO title="Mentor Profile | Taksha Workspace" />
      <div style={{ padding: 'var(--space-6)', maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 'var(--space-2)' }}>My Profile</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage your personal details and account security.</p>
        </header>

        <div style={{
          background: 'var(--color-surface)',
          border: '4px solid var(--color-ink)',
          boxShadow: '8px 8px 0 0 var(--color-ink)',
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          gap: 'var(--space-6)',
          alignItems: 'center'
        }}>
          <div style={{
            width: '120px', height: '120px',
            background: 'var(--color-card-purple)',
            border: '4px solid var(--color-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', fontWeight: 900
          }}>
            {user?.initials || 'MK'}
          </div>
          
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 'var(--space-2)' }}>{user?.name || 'Lead Mentor'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', fontWeight: 800 }}>
              <Briefcase size={18} /> Role: {user?.role || 'MENTOR'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 800 }}>
              <Mail size={18} /> {user?.email || 'mentor@taksha.in'}
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--color-bg)',
          border: '4px solid var(--color-ink)',
          boxShadow: '8px 8px 0 0 var(--color-ink)',
          padding: 'var(--space-6)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Key size={24} /> Change Password
          </h3>
          
          <form onSubmit={e => { e.preventDefault(); alert('Password updated! (Prototype)'); }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Current Password</label>
              <input type="password" required style={{ width: '100%', padding: '12px', border: '2px solid var(--color-ink)', background: 'var(--color-surface)' }} />
            </div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>New Password</label>
              <input type="password" required style={{ width: '100%', padding: '12px', border: '2px solid var(--color-ink)', background: 'var(--color-surface)' }} />
            </div>
            
            <button type="submit" style={{
              background: 'var(--color-ink)',
              color: 'var(--color-bg)',
              padding: '12px 24px',
              border: 'none',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)'
            }}>
              Update Security Details
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
