import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Plus, X } from 'lucide-react';
import './MentorInterns.css';

export default function MentorInterns() {
  const { interns, tasks, createIntern } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newIntern, setNewIntern] = useState({ name: '', email: '', password: '', track: 'Frontend' });
  const [error, setError] = useState('');

  return (
    <>
      <SEO title="My Interns | Taksha Workspace" />
      <div className="mentor-interns">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">My Interns</h1>
            <p className="intern-tasks__subtitle">Manage and track your assigned interns.</p>
          </div>
          
          <div className="intern-tasks__filters" style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <div className="intern-tasks__search">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search interns..." />
            </div>
            <button 
              className="intern-btn intern-btn--assign" 
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} /> Add Intern
            </button>
          </div>
        </header>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}><X /></button>
              <h2>Add New Intern</h2>
              {error && <div style={{ color: 'var(--color-card-pink)', marginBottom: 'var(--space-4)', fontWeight: 800 }}>{error}</div>}
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                setError('');
                const res = await createIntern(newIntern);
                if (res.success) {
                  setIsModalOpen(false);
                  setNewIntern({ name: '', email: '', password: '', track: 'Frontend' });
                } else {
                  setError(res.error);
                }
              }}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Full Name</label>
                  <input required type="text" value={newIntern.name} onChange={e => setNewIntern({...newIntern, name: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Email Address</label>
                  <input required type="email" value={newIntern.email} onChange={e => setNewIntern({...newIntern, email: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Password</label>
                  <input required type="password" value={newIntern.password} onChange={e => setNewIntern({...newIntern, password: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Track</label>
                  <select value={newIntern.track} onChange={e => setNewIntern({...newIntern, track: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                    <option value="Frontend">Frontend Development</option>
                    <option value="Backend">Backend Development</option>
                    <option value="Design">UI/UX Design</option>
                  </select>
                </div>
                
                <button type="submit" className="intern-btn intern-btn--assign" style={{ width: '100%' }}>
                  Create Intern Account
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="interns-grid">
          {interns.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: 'var(--space-12)', textAlign: 'center', background: 'var(--color-surface)', border: '4px solid var(--color-ink)', boxShadow: '8px 8px 0 0 var(--color-ink)' }}>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>No Interns Found</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>You haven't added any interns to your roster yet.</p>
              <button className="intern-btn intern-btn--assign" onClick={() => setIsModalOpen(true)}>+ Create Your First Intern</button>
            </div>
          )}
          {interns.map((intern, idx) => {
            const internTasks = tasks.filter(t => t.assignee === intern.id);
            const total = internTasks.length;
            const completed = internTasks.filter(t => t.status === 'DONE').length;
            
            return (
              <div key={idx} className="intern-full-card">
                <div className="intern-full-card__header">
                  <div className="intern-full-card__avatar">{intern.name.charAt(0)}</div>
                  <div className="intern-full-card__info">
                    <h3>{intern.name}</h3>
                    <p>{intern.track} Track</p>
                  </div>
                </div>
                
                <div className="intern-full-card__body">
                  <div className="intern-kpi-row">
                    <span className="intern-kpi-label">Status</span>
                    <span className="intern-kpi-val" style={{ color: intern.progress > 50 ? 'var(--color-card-mint)' : 'var(--color-card-pink)' }}>
                      {intern.status}
                    </span>
                  </div>
                  
                  <div className="intern-kpi-row">
                    <span className="intern-kpi-label">Completion</span>
                    <span className="intern-kpi-val">{intern.progress}%</span>
                  </div>
                  
                  <div className="intern-kpi-row">
                    <span className="intern-kpi-label">Tasks Done</span>
                    <span className="intern-kpi-val">{completed} / {total}</span>
                  </div>
                </div>
                
                <div className="intern-full-card__footer">
                  <button className="intern-btn intern-btn--view">View Profile</button>
                  <button className="intern-btn intern-btn--assign">Assign Task</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
