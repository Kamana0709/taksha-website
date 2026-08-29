import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import './InternSettings.css';

export default function InternSettings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [taskNotif, setTaskNotif] = useState(true);
  
  return (
    <>
      <SEO title="Settings | Taksha Nexus Workspace" />
      <div className="intern-settings">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">Settings</h1>
            <p className="intern-tasks__subtitle">Manage your account preferences and notifications.</p>
          </div>
        </header>

        <div className="settings-section">
          <h2 className="settings-section-title">Notifications</h2>
          
          <div className="settings-toggle" onClick={() => setEmailNotif(!emailNotif)}>
            <div className="settings-toggle-label">Email Notifications</div>
            <div className={`toggle-switch ${emailNotif ? 'toggle-switch--on' : ''}`}></div>
          </div>
          
          <div className="settings-toggle" onClick={() => setTaskNotif(!taskNotif)}>
            <div className="settings-toggle-label">Task Assignment Alerts</div>
            <div className={`toggle-switch ${taskNotif ? 'toggle-switch--on' : ''}`}></div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">Change Password</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="leave-form-group">
              <label className="leave-label">Current Password</label>
              <input type="password" className="leave-input" />
            </div>
            <div className="leave-form-group">
              <label className="leave-label">New Password</label>
              <input type="password" className="leave-input" />
            </div>
            <button className="leave-submit" style={{ marginTop: 'var(--space-2)' }}>Update Password</button>
          </form>
        </div>
      </div>
    </>
  );
}
