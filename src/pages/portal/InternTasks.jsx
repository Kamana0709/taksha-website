import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { Filter, Search, CheckSquare, X } from 'lucide-react';
import './InternTasks.css';

export default function InternTasks() {
  const { user } = useAuth();
  const { tasks, updateTaskStatus, submitTaskWork } = useWorkspace();
  const [filter, setFilter] = useState('ALL');
  
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [submissionData, setSubmissionData] = useState({ githubUrl: '', liveUrl: '', description: '' });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myTasks = tasks.filter(t => t.assignee === user?.id);
  
  const filteredTasks = myTasks.filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return t.status === 'TODO' || t.status === 'IN_PROGRESS' || t.status === 'CHANGES_REQUESTED';
    if (filter === 'COMPLETED') return t.status === 'DONE';
    return true;
  });

  const getStatusLabel = (status) => {
    switch(status) {
      case 'IN_PROGRESS': return 'In Progress';
      case 'CHANGES_REQUESTED': return 'Changes Req';
      case 'REVIEW': return 'In Review';
      case 'TODO': return 'To Do';
      case 'DONE': return 'Completed';
      default: return status;
    }
  };

  const handleOpenSubmit = (task) => {
    setActiveTask(task);
    setSubmissionData({ githubUrl: '', liveUrl: '', description: '' });
    setSubmitError('');
    setSubmitModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!submissionData.githubUrl.includes('github.com')) {
      setSubmitError('Please provide a valid GitHub repository URL.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    const res = await submitTaskWork({
      taskId: activeTask.id,
      ...submissionData
    });
    
    setIsSubmitting(false);
    
    if (res.success) {
      setSubmitModalOpen(false);
      setActiveTask(null);
    } else {
      setSubmitError(res.error || 'Failed to submit work. Please try again.');
    }
  };

  return (
    <>
      <SEO title="My Tasks | Taksha Workspace" />
      <div className="intern-tasks">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">My Tasks</h1>
            <p className="intern-tasks__subtitle">Detailed view of all your assigned items.</p>
          </div>
          <div className="intern-tasks__actions">
            <select className="task-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">All Tasks</option>
              <option value="PENDING">Pending Action</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </header>

        {submitModalOpen && activeTask && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
              <button className="modal-close" onClick={() => setSubmitModalOpen(false)}><X /></button>
              <h2>Submit Work: {activeTask.title}</h2>
              <p style={{ marginBottom: 'var(--space-4)' }}>Submit your GitHub repository link to mark this project as completed.</p>
              
              {submitError && (
                <div style={{ padding: 'var(--space-2)', background: 'var(--color-card-pink)', color: 'var(--color-bg)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
                  {submitError}
                </div>
              )}
              
              <form onSubmit={handleFormSubmit}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>GitHub Repository URL *</label>
                  <input 
                    required 
                    type="url" 
                    placeholder="https://github.com/username/repo" 
                    value={submissionData.githubUrl} 
                    onChange={e => setSubmissionData({...submissionData, githubUrl: e.target.value})} 
                    style={{ width: '100%', padding: '12px', border: '2px solid var(--color-ink)' }} 
                  />
                </div>
                
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Live/Deployed Project URL (Optional)</label>
                  <input 
                    type="url" 
                    placeholder="https://myproject.vercel.app" 
                    value={submissionData.liveUrl} 
                    onChange={e => setSubmissionData({...submissionData, liveUrl: e.target.value})} 
                    style={{ width: '100%', padding: '12px', border: '2px solid var(--color-ink)' }} 
                  />
                </div>
                
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Description/Updates (Optional)</label>
                  <textarea 
                    rows="4"
                    placeholder="Briefly describe what you completed or any challenges faced..." 
                    value={submissionData.description} 
                    onChange={e => setSubmissionData({...submissionData, description: e.target.value})} 
                    style={{ width: '100%', padding: '12px', border: '2px solid var(--color-ink)' }} 
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="intern-btn intern-btn--assign" 
                  style={{ width: '100%' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Work'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="task-table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task & Project</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <div className="task-table__title">{task.title}</div>
                      <div className="task-table__project">{task.project}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: task.priority === 'High' ? 'var(--color-card-pink)' : 'inherit' }}>
                        {task.priority || 'Medium'}
                      </span>
                    </td>
                    <td>{task.date}</td>
                    <td>
                      <span className={`task-badge task-badge--${task.status}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </td>
                    <td>
                      {task.status === 'TODO' && (
                        <button className="task-table__action" style={{ background: 'var(--color-accent)' }} onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}>
                          START
                        </button>
                      )}
                      {(task.status === 'IN_PROGRESS' || task.status === 'CHANGES_REQUESTED') && (
                        <button className="task-table__action" style={{ background: 'var(--color-card-purple)' }} onClick={() => handleOpenSubmit(task)}>
                          SUBMIT WORK
                        </button>
                      )}
                      {task.status === 'REVIEW' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Awaiting Mentor</span>
                      )}
                      {task.status === 'DONE' && (
                        <CheckSquare color="var(--color-card-mint)" size={24} />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
