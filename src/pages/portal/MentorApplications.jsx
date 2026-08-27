import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, Eye, CheckCircle, XCircle } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading/SectionHeading';

export default function MentorApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        const errText = await response.text();
        setErrorMsg(`Error ${response.status}: ${errText}`);
      }
    } catch (err) {
      console.error('Failed to fetch applications', err);
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="portal-page">
      <SectionHeading 
        title="Job Applications" 
        subtitle="Review and manage candidate applications for all open roles."
        badge="RECRUITMENT"
        badgeColor="pink"
      />

      <div className="portal-card" style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        {isLoading ? (
          <p>Loading applications...</p>
        ) : errorMsg ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'red' }}>
            <XCircle size={48} style={{ margin: '0 auto var(--space-4)' }} />
            <h3>Failed to load applications</h3>
            <p>{errorMsg}</p>
          </div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <Briefcase size={48} color="var(--color-text-secondary)" style={{ margin: '0 auto var(--space-4)' }} />
            <h3>No applications yet</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>When candidates apply on the Careers page, they will appear here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-ink)' }}>
                  <th style={{ padding: 'var(--space-3)' }}>Date</th>
                  <th style={{ padding: 'var(--space-3)' }}>Candidate</th>
                  <th style={{ padding: 'var(--space-3)' }}>Role</th>
                  <th style={{ padding: 'var(--space-3)' }}>Portfolio</th>
                  <th style={{ padding: 'var(--space-3)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--space-3)', whiteSpace: 'nowrap' }}>{app.date}</td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <strong>{app.name}</strong><br/>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{app.email}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>{app.roleTitle}</td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <a href={app.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 'bold', textDecoration: 'none' }}>
                        View Link ↗
                      </a>
                    </td>
                    <td style={{ padding: 'var(--space-3)' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '4px 8px', borderRadius: '4px', fontSize: 'var(--text-xs)', fontWeight: 'bold',
                        background: app.status === 'Pending' ? 'var(--color-bg-secondary)' : 'var(--color-card-mint)'
                      }}>
                        <Clock size={12} /> {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
