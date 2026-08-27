import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Plus, X } from 'lucide-react';
import './InternTasks.css'; // Missing import fixed
import './MentorTasks.css';

export default function MentorTasks() {
  const { tasks, interns, createTask, updateTaskDetails, deleteTask } = useWorkspace();
  const [filter, setFilter] = useState('ALL');
  
  // Modals state
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null); // If not null, edit modal is open
  const [newTask, setNewTask] = useState({ title: '', project: '', priority: 'Medium', status: 'TODO', assignee: '' });
  const [error, setError] = useState('');

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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.assignee) {
      setError('Please select an intern to assign this task to.');
      return;
    }
    setError('');
    await createTask(newTask);
    setCreateModalOpen(false);
    setNewTask({ title: '', project: '', priority: 'Medium', status: 'TODO', assignee: '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await updateTaskDetails(editTaskData.id, editTaskData);
    if (res.success) {
      setEditTaskData(null);
    } else {
      setError(res.error || 'Failed to update task');
    }
  };

  const handleDropTask = async (taskId) => {
    if (confirm('Are you sure you want to permanently delete this task?')) {
      await deleteTask(taskId);
    }
  };

  return (
    <>
      <SEO title="Task Masterlist | Taksha Workspace" />
      <div className="mentor-tasks">
        <header className="intern-tasks__header" style={{ marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 className="intern-tasks__title">Task Masterlist</h1>
            <p className="intern-tasks__subtitle">Global view of all assigned tasks.</p>
          </div>
          
          <div className="intern-tasks__filters" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
            <button className="task-filter" style={filter === 'ALL' ? {background:'var(--color-ink)', color:'var(--color-bg)'} : {}} onClick={() => setFilter('ALL')}>All Tasks</button>
            <button className="task-filter" style={filter === 'TODO' ? {background:'var(--color-ink)', color:'var(--color-bg)'} : {}} onClick={() => setFilter('TODO')}>To Do</button>
            <button className="task-filter" style={filter === 'REVIEW' ? {background:'var(--color-ink)', color:'var(--color-bg)'} : {}} onClick={() => setFilter('REVIEW')}>Needs Review</button>
            <button className="task-filter" style={filter === 'DONE' ? {background:'var(--color-ink)', color:'var(--color-bg)'} : {}} onClick={() => setFilter('DONE')}>Completed</button>
            
            {/* Added Create Task Button */}
            <button 
              className="intern-btn intern-btn--assign" 
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus size={16} /> Assign Task
            </button>
          </div>
        </header>

        {/* CREATE TASK MODAL */}
        {isCreateModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <button className="modal-close" onClick={() => setCreateModalOpen(false)}><X /></button>
              <h2>Assign New Task</h2>
              {error && <div style={{ color: 'var(--color-card-pink)', marginBottom: 'var(--space-4)', fontWeight: 800 }}>{error}</div>}
              
              <form onSubmit={handleCreateSubmit}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Task Title</label>
                  <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Project Category</label>
                  <input required type="text" placeholder="e.g. Project 1" value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <div style={{ marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Priority</label>
                    <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Assignee</label>
                    <select required value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                      <option value="" disabled>Select Intern...</option>
                      {interns.map(intern => (
                        <option key={intern.id} value={intern.id}>{intern.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="intern-btn intern-btn--assign" style={{ width: '100%' }}>Create Task</button>
              </form>
            </div>
          </div>
        )}

        {/* EDIT TASK MODAL */}
        {editTaskData && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <button className="modal-close" onClick={() => setEditTaskData(null)}><X /></button>
              <h2>Edit Task</h2>
              {error && <div style={{ color: 'var(--color-card-pink)', marginBottom: 'var(--space-4)', fontWeight: 800 }}>{error}</div>}
              
              <form onSubmit={handleEditSubmit}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Task Title</label>
                  <input required type="text" value={editTaskData.title} onChange={e => setEditTaskData({...editTaskData, title: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Project Category</label>
                  <input required type="text" value={editTaskData.project} onChange={e => setEditTaskData({...editTaskData, project: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }} />
                </div>
                <div style={{ marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Status</label>
                    <select value={editTaskData.status} onChange={e => setEditTaskData({...editTaskData, status: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">Review</option>
                      <option value="CHANGES_REQUESTED">Changes Req.</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Priority</label>
                    <select value={editTaskData.priority} onChange={e => setEditTaskData({...editTaskData, priority: e.target.value})} style={{ width: '100%', padding: '8px', border: '2px solid var(--color-ink)' }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="intern-btn intern-btn--view" style={{ width: '100%' }}>Save Changes</button>
              </form>
            </div>
          </div>
        )}

        <div className="task-table-container">
          <table className="task-table">
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
                    <td className="task-table__title">{task.title}</td>
                    <td className="task-table__project">{task.project}</td>
                    <td style={{ fontWeight: 800 }}>{assigneeName}</td>
                    <td>
                      <span className="task-badge" style={{ background: getStatusColor(task.status) }}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className="task-badge" style={{ 
                        color: task.priority === 'High' ? 'var(--color-card-pink)' : 'var(--color-ink)' 
                      }}>
                        {task.priority || 'Medium'}
                      </span>
                    </td>
                    <td>{task.date}</td>
                    <td>
                      <div className="mentor-task-actions">
                        <button className="mentor-task-btn" onClick={() => setEditTaskData(task)}>Edit</button>
                        <button className="mentor-task-btn mentor-task-btn--delete" onClick={() => handleDropTask(task.id)}>Drop</button>
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
