import React from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './InternProjects.css';

export default function InternProjects() {
  const { user } = useAuth();
  const { tasks } = useWorkspace();
  const navigate = useNavigate();

  const myTasks = tasks.filter(t => t.assignee === user?.id);
  
  // Group tasks by project
  const projectsMap = {};
  myTasks.forEach(t => {
    if (!projectsMap[t.project]) {
      projectsMap[t.project] = {
        name: t.project,
        totalTasks: 0,
        completedTasks: 0,
        status: 'ACTIVE',
        color: 'var(--color-card-lilac)' // Default
      };
    }
    projectsMap[t.project].totalTasks += 1;
    if (t.status === 'DONE') {
      projectsMap[t.project].completedTasks += 1;
    }
  });
  
  // Calculate final status and color based on completion
  Object.values(projectsMap).forEach(proj => {
    if (proj.totalTasks > 0 && proj.completedTasks === proj.totalTasks) {
      proj.status = 'COMPLETED';
      proj.color = 'var(--color-bg)';
    } else if (proj.completedTasks > 0) {
      proj.color = 'var(--color-card-purple)'; // IN_PROGRESS vibe
    }
  });

  const projects = Object.values(projectsMap);

  // If no projects, render some dummies so the UI is visible
  if (projects.length === 0) {
    projects.push({
      name: 'Finora Project',
      totalTasks: 12,
      completedTasks: 5,
      status: 'ACTIVE',
      color: 'var(--color-card-mint)',
      desc: 'Building out the frontend dashboard for the Finora banking application. Focus on responsive design and accessibility.'
    });
    projects.push({
      name: 'NovaCare App',
      totalTasks: 8,
      completedTasks: 8,
      status: 'COMPLETED',
      color: 'var(--color-card-pink)',
      desc: 'Healthcare appointment booking system interface.'
    });
  }

  return (
    <>
      <SEO title="My Projects | Taksha Workspace" />
      <div className="intern-projects">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">My Projects</h1>
            <p className="intern-tasks__subtitle">High-level overview of your assigned initiatives.</p>
          </div>
        </header>

        <div className="projects-grid">
          {projects.map((proj, idx) => {
            const percent = proj.totalTasks > 0 ? Math.round((proj.completedTasks / proj.totalTasks) * 100) : 0;
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
