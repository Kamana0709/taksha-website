import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { Filter, Search, CheckSquare } from 'lucide-react';
import './InternTasks.css';

export default function InternTasks() {
  const { user } = useAuth();
  const { tasks, updateTaskStatus } = useWorkspace();
  const [filter, setFilter] = useState('ALL');

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
                        <button className="task-table__action" style={{ background: 'var(--color-card-purple)' }} onClick={() => updateTaskStatus(task.id, 'REVIEW')}>
                          SUBMIT
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
