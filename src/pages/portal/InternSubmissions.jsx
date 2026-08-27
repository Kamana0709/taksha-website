import React from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { ExternalLink, MessageSquare, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import './InternSubmissions.css';

export default function InternSubmissions() {
  const { user } = useAuth();
  const { tasks } = useWorkspace();

  const myTasks = tasks.filter(t => t.assignee === user?.id);
  const submissions = myTasks.filter(t => t.status === 'REVIEW' || t.status === 'DONE' || t.status === 'CHANGES_REQUESTED');

  // If no submissions exist, we'll inject some dummies for the prototype visualization
  if (submissions.length === 0) {
    submissions.push(
      { id: 'd1', title: 'Responsive Navbar', project: 'Finora Project', status: 'DONE', date: '06 May', submissionLink: 'https://github.com/taksha/navbar', feedback: 'Great job! The mobile drawer works perfectly on iOS devices.' },
      { id: 'd2', title: 'Login Page UI', project: 'NovaCare App', status: 'CHANGES_REQUESTED', date: '08 May', submissionLink: 'https://github.com/taksha/login', feedback: 'The contrast on the input borders needs to be thicker to match the Neo-Brutalist spec. Please update and resubmit.' }
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'DONE': return 'var(--color-card-mint)';
      case 'CHANGES_REQUESTED': return 'var(--color-card-pink)';
      case 'REVIEW': return 'var(--color-card-lilac)';
      default: return 'var(--color-ink)';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'DONE': return <CheckCircle size={14} />;
      case 'CHANGES_REQUESTED': return <AlertTriangle size={14} />;
      case 'REVIEW': return <Clock size={14} />;
      default: return null;
    }
  };

  return (
    <>
      <SEO title="Submissions Audit | Taksha Workspace" />
      <div className="intern-submissions">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">Submissions Audit</h1>
            <p className="intern-tasks__subtitle">Permanent record of your submitted work and mentor feedback.</p>
          </div>
        </header>

        <div className="timeline">
          {submissions.map((sub, idx) => (
            <div key={sub.id || idx} className="timeline-item">
              <div className="timeline-item__dot" style={{ borderColor: getStatusColor(sub.status) }}></div>
              <div className="timeline-item__content">
                <div className="timeline-header">
                  <h3 className="timeline-title">{sub.title}</h3>
                  <span className="timeline-date">{sub.date}</span>
                </div>
                
                <span className="timeline-project">{sub.project}</span>
                
                {sub.submissionLink && (
                  <a href={sub.submissionLink} target="_blank" rel="noreferrer" className="timeline-link">
                    <ExternalLink size={16} /> View Submitted Artifact
                  </a>
                )}

                <div className="timeline-feedback" style={{ borderLeftColor: getStatusColor(sub.status) }}>
                  <h4 style={{ color: getStatusColor(sub.status) }}>
                    {getStatusIcon(sub.status)} 
                    {sub.status === 'DONE' ? 'Verified / Completed' : sub.status === 'CHANGES_REQUESTED' ? 'Changes Requested' : 'Pending Mentor Review'}
                  </h4>
                  {sub.feedback ? (
                    <p>{sub.feedback}</p>
                  ) : (
                    <p style={{ fontStyle: 'italic' }}>Mentor has not left any remarks yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
