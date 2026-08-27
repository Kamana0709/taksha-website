import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Link2 } from 'lucide-react';
import './MentorReviews.css';

export default function MentorReviews() {
  const { tasks, interns, updateTaskStatus } = useWorkspace();
  const [feedback, setFeedback] = useState({});

  const reviewTasks = tasks.filter(t => t.status === 'REVIEW');

  const handleFeedbackChange = (taskId, text) => {
    setFeedback({ ...feedback, [taskId]: text });
  };

  const handleApprove = (taskId) => {
    updateTaskStatus(taskId, 'DONE');
  };

  const handleReject = (taskId) => {
    updateTaskStatus(taskId, 'CHANGES_REQUESTED', { feedback: feedback[taskId] || 'Please review and resubmit.' });
  };

  return (
    <>
      <SEO title="Reviews | Taksha Workspace" />
      <div className="mentor-reviews">
        <header className="intern-tasks__header" style={{ marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 className="intern-tasks__title">Pending Reviews</h1>
            <p className="intern-tasks__subtitle">Evaluate intern submissions and provide feedback.</p>
          </div>
          <div style={{ background: 'var(--color-card-mint)', padding: 'var(--space-2) var(--space-4)', border: '2px solid var(--color-ink)', fontWeight: 900 }}>
            {reviewTasks.length} Awaiting Review
          </div>
        </header>

        {reviewTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', border: '2px dashed var(--color-ink)' }}>
            <h2>All caught up! 🎉</h2>
            <p>No tasks currently awaiting review.</p>
          </div>
        ) : (
          reviewTasks.map(task => {
            const assigneeName = interns.find(i => i.id === task.assignee)?.name || task.assignee;
            return (
              <div key={task.id} className="review-card">
                <div className="review-card__header">
                  <div>
                    <h2 className="review-card__title">{task.title}</h2>
                    <div className="review-card__meta">
                      <span>Project: {task.project}</span>
                      <span>Assignee: {assigneeName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p style={{ fontWeight: 800, marginBottom: 'var(--space-2)' }}>Submission Link:</p>
                  <a href={task.submissionLink || '#'} target="_blank" rel="noreferrer" className="review-card__link">
                    <Link2 size={16} />
                    {task.submissionLink || 'No link provided'}
                  </a>
                </div>

                <div>
                  <label style={{ fontWeight: 800, display: 'block', marginBottom: 'var(--space-2)' }}>Feedback / Remarks:</label>
                  <textarea 
                    rows="3" 
                    className="review-feedback-input" 
                    placeholder="Leave constructive feedback here..."
                    value={feedback[task.id] || ''}
                    onChange={(e) => handleFeedbackChange(task.id, e.target.value)}
                  ></textarea>
                </div>

                <div className="review-card__actions">
                  <button className="review-btn review-btn--reject" onClick={() => handleReject(task.id)}>Request Changes</button>
                  <button className="review-btn review-btn--approve" onClick={() => handleApprove(task.id)}>Approve Task</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
