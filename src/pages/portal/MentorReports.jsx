import React from 'react';
import SEO from '../../components/SEO/SEO';
import { Download } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import './MentorReports.css';

export default function MentorReports() {
  const { interns, tasks } = useWorkspace();
  
  const totalTasks = tasks.length || 1;
  const todoTasks = tasks.filter(t => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const reviewTasks = tasks.filter(t => t.status === 'REVIEW').length;
  const doneTasks = tasks.filter(t => t.status === 'DONE').length;

  const totalInterns = interns.length || 1;
  const onTrackInterns = interns.filter(i => i.status === 'On Track').length;
  const behindInterns = interns.filter(i => i.status === 'Behind').length;
  const atRiskInterns = interns.filter(i => i.status === 'At Risk').length;
  
  const onTrackPct = Math.round((onTrackInterns / totalInterns) * 100);
  const behindPct = Math.round((behindInterns / totalInterns) * 100);
  const atRiskPct = Math.round((atRiskInterns / totalInterns) * 100);

  return (
    <>
      <SEO title="Reports & Analytics | Taksha Workspace" />
      <div className="mentor-reports">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">Performance Reports</h1>
            <p className="intern-tasks__subtitle">Analytics and insights on intern progress.</p>
          </div>
          
          <div>
            <button className="intern-btn intern-btn--assign" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </header>

        <div className="reports-grid">
          <div className="report-card">
            <div className="report-card__header">
              <h2 className="report-card__title">Task Distribution</h2>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>All Time</span>
            </div>
            
            <div className="mock-bar-chart">
              <div className="mock-bar" style={{ height: `${(todoTasks / totalTasks) * 100}%` }}><strong>{todoTasks}</strong><span>To Do</span></div>
              <div className="mock-bar" style={{ height: `${(inProgressTasks / totalTasks) * 100}%`, background: 'var(--color-card-purple)' }}><strong>{inProgressTasks}</strong><span>Working</span></div>
              <div className="mock-bar" style={{ height: `${(reviewTasks / totalTasks) * 100}%`, background: 'var(--color-accent)' }}><strong>{reviewTasks}</strong><span>Review</span></div>
              <div className="mock-bar" style={{ height: `${(doneTasks / totalTasks) * 100}%`, background: 'var(--color-card-pink)' }}><strong>{doneTasks}</strong><span>Done</span></div>
            </div>
          </div>

          <div className="report-card">
            <div className="report-card__header">
              <h2 className="report-card__title">Intern Progress Status</h2>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>Current Cohort</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 800 }}>
                  <span>On Track</span>
                  <span>{onTrackPct}%</span>
                </div>
                <div style={{ width: '100%', height: '16px', border: '2px solid var(--color-ink)', background: 'var(--color-bg)' }}>
                  <div style={{ width: `${onTrackPct}%`, height: '100%', background: 'var(--color-card-mint)', borderRight: '2px solid var(--color-ink)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 800 }}>
                  <span>Behind</span>
                  <span>{behindPct}%</span>
                </div>
                <div style={{ width: '100%', height: '16px', border: '2px solid var(--color-ink)', background: 'var(--color-bg)' }}>
                  <div style={{ width: `${behindPct}%`, height: '100%', background: 'var(--color-card-pink)', borderRight: '2px solid var(--color-ink)' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontWeight: 800 }}>
                  <span>At Risk</span>
                  <span>{atRiskPct}%</span>
                </div>
                <div style={{ width: '100%', height: '16px', border: '2px solid var(--color-ink)', background: 'var(--color-bg)' }}>
                  <div style={{ width: `${atRiskPct}%`, height: '100%', background: 'var(--color-card-purple)', borderRight: '2px solid var(--color-ink)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
