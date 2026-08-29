import React from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './InternProjects.css';

export default function InternProjects() {
  const { user } = useAuth();
  const { projects, tasks, submissions } = useWorkspace();
  const navigate = useNavigate();

  const myTasks = tasks.filter(t => t.assignee === user?.id);
  
  // Filter projects where intern has tasks
  const internProjects = projects.filter(p => myTasks.some(t => t.projectId === p.id));
  
  // Attach task stats to each project
  const projectStats = internProjects.map(proj => {
    const projTasks = myTasks.filter(t => t.projectId === proj.id);
    const completedTasks = projTasks.filter(t => t.status === 'DONE').length;
    const totalTasks = projTasks.length;
    
    let status = 'ACTIVE';
    let color = 'var(--color-card-lilac)';
    
    if (totalTasks > 0 && completedTasks === totalTasks) {
      status = 'COMPLETED';
      color = 'var(--color-bg)';
    } else if (completedTasks > 0) {
      color = 'var(--color-card-purple)'; // IN_PROGRESS vibe
    }
    
    return {
      ...proj,
      totalTasks,
      completedTasks,
      status,
      color,
      desc: proj.description
    };
  });

  return (
    <>
      <SEO title="My Projects | Taksha Nexus Workspace" />
      <div className="intern-projects">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">My Projects</h1>
            <p className="intern-tasks__subtitle">High-level overview of your assigned initiatives.</p>
          </div>
        </header>

        <div className="projects-grid">
          {projectStats.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: 'var(--space-8)', textAlign: 'center', background: 'var(--color-surface)', border: '4px solid var(--color-ink)', boxShadow: '8px 8px 0 0 var(--color-ink)' }}>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>No Projects Assigned</h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>You don't have tasks assigned to any projects yet.</p>
            </div>
          ) : projectStats.map((proj, idx) => {
            const percent = proj.totalTasks > 0 ? Math.round((proj.completedTasks / proj.totalTasks) * 100) : 0;
            const hasSubmission = submissions?.some(s => s.projectId === proj.id && s.internId === user?.id);
            return (
              <div key={idx} className="project-card">
                <div className="project-card__header">
                  <h2 className="project-card__title">{proj.name}</h2>
                  <span className="project-card__status" style={{ background: proj.status === 'COMPLETED' ? 'var(--color-bg)' : proj.color || 'var(--color-accent)' }}>
                    {proj.status}
                  </span>
                </div>
                
                <p className="project-card__desc">
                  {proj.desc || 'No detailed description provided for this project. Focus on completing assigned tasks on the Kanban board.'}
                </p>

                <div className="project-card__meta">
                  <div className="project-progress-row">
                    <span>Progress</span>
                    <span>{proj.completedTasks} / {proj.totalTasks} Tasks</span>
                  </div>
                  <div className="project-progress-bar">
                    <div className="project-progress-fill" style={{ width: `${percent}%`, background: proj.status === 'COMPLETED' ? 'var(--color-text-secondary)' : 'var(--color-card-mint)' }}></div>
                  </div>
                  {proj.status !== 'COMPLETED' && proj.daysRemaining > 0 && (
                    <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 800 }}>
                      ⏳ {proj.daysRemaining} days left to submit
                    </div>
                  )}
                  {proj.daysRemaining <= 0 && !hasSubmission && (
                    <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 800, background: 'var(--color-card-pink)', padding: '6px 10px', border: '2px solid var(--color-ink)', display: 'inline-block' }}>
                      Deadline passed — auto-submitted
                    </div>
                  )}
                </div>

                <button className="project-action-btn" onClick={() => navigate('/intern/tasks')}>
                  VIEW ALL TASKS
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
