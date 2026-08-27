import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import './MentorTasks.css';

export default function MentorTasks() {
  const { tasks, interns, updateTaskStatus } = useWorkspace();
  const [filter, setFilter] = useState('ALL');

  const getStatusColor = (status) => {
    switch(status) {
      case 'TODO': return 'var(--color-accent)';
      case 'IN_PROGRESS': return 'var(--color-card-purple)';
      case 'REVIEW': return 'var(--color-card-mint)';
      case 'DONE': return 'var(--color-card-pink)';
      case 'CHANGES_REQUESTED': return 'var(--color-card-pink)';
      default: return 'var(--color-ink)';
    }
  };

  const filteredTasks = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <>
      <SEO title="Task Masterlist | Taksha Workspace" />
      <div className="mentor-tasks">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">Task Masterlist</h1>
            <p className="intern-tasks__subtitle">Global view of all assigned tasks.</p>
          </div>
          
          <div className="intern-tasks__filters">
            <button className={`filter-btn ${filter === 'ALL' ? 'filter-btn--active' : ''}`} onClick={() => setFilter('ALL')}>All Tasks</button>
            <button className={`filter-btn ${filter === 'TODO' ? 'filter-btn--active' : ''}`} onClick={() => setFilter('TODO')}>To Do</button>
            <button className={`filter-btn ${filter === 'REVIEW' ? 'filter-btn--active' : ''}`} onClick={() => setFilter('REVIEW')}>Needs Review</button>
            <button className={`filter-btn ${filter === 'DONE' ? 'filter-btn--active' : ''}`} onClick={() => setFilter('DONE')}>Completed</button>
          </div>
        </header>

        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => {
                const assigneeName = interns.find(i => i.id === task.assignee)?.name || task.assignee;
                return (
                  <tr key={task.id}>
                    <td className="task-cell-title">{task.title}</td>
                    <td>{task.project}</td>
                    <td style={{ fontWeight: 800 }}>{assigneeName}</td>
                    <td>
                      <span className="task-status-badge" style={{ background: getStatusColor(task.status) }}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className="task-priority-badge" style={{ 
                        color: task.priority === 'High' ? 'var(--color-card-pink)' : 'var(--color-ink)' 
                      }}>
                        {task.priority || 'Medium'}
                      </span>
                    </td>
                    <td>{task.date}</td>
                    <td>
                      <div className="mentor-task-actions">
                        <button className="mentor-task-btn">Edit</button>
                        <button className="mentor-task-btn mentor-task-btn--delete" onClick={() => {
                          if(confirm('Are you sure you want to delete this task?')) {
                            // Prototype doesn't actually delete, but we could add deleteTask to Context if needed.
                            alert('Task deleted (Prototype)');
                          }
                        }}>Drop</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>No tasks found for this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
