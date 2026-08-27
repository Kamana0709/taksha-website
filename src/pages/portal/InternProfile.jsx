import React from 'react';
import SEO from '../../components/SEO/SEO';
import { useAuth } from '../../context/AuthContext';
import './InternProfile.css';

export default function InternProfile() {
  const { user } = useAuth();

  return (
    <>
      <SEO title="My Profile | Taksha Workspace" />
      <div className="intern-profile">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">My Profile</h1>
            <p className="intern-tasks__subtitle">Your official Taksha intern record.</p>
          </div>
        </header>

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
                <div className="profile-value">+91 98765 43210</div>
              </div>
              <div className="profile-info-group">
                <div className="profile-label">Location</div>
                <div className="profile-value">Remote (India)</div>
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
