import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Link2 } from 'lucide-react';
import './MentorReviews.css';

export default function MentorReviews() {
  const { submissions, reviewSubmission } = useWorkspace();
  const [feedback, setFeedback] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingSubmissions = submissions.filter(s => s.status === 'Submitted');

  const handleFeedbackChange = (submissionId, text) => {
    setFeedback({ ...feedback, [submissionId]: text });
  };

  const handleApprove = async (submissionId) => {
    setIsSubmitting(true);
    await reviewSubmission(submissionId, { status: 'Approved', mentorFeedback: feedback[submissionId] || 'Great job!' });
    setIsSubmitting(false);
  };

  const handleReject = async (submissionId) => {
    if (!feedback[submissionId]) {
      alert("Please provide feedback explaining what changes are requested.");
      return;
    }
    setIsSubmitting(true);
    await reviewSubmission(submissionId, { status: 'Changes Requested', mentorFeedback: feedback[submissionId] });
    setIsSubmitting(false);
  };

  return (
    <>
      <SEO title="Reviews | Taksha Nexus Workspace" />
      <div className="mentor-reviews">
        <header className="intern-tasks__header" style={{ marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 className="intern-tasks__title">Pending Reviews</h1>
            <p className="intern-tasks__subtitle">Evaluate intern submissions and provide feedback.</p>
          </div>
          <div style={{ background: 'var(--color-card-mint)', padding: 'var(--space-2) var(--space-4)', border: '2px solid var(--color-ink)', fontWeight: 900 }}>
            {pendingSubmissions.length} Awaiting Review
          </div>
        </header>

        {pendingSubmissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', border: '2px dashed var(--color-ink)' }}>
            <h2>All caught up! 🎉</h2>
            <p>No submissions currently awaiting review.</p>
          </div>
        ) : (
          pendingSubmissions.map(sub => {
            const projectName = sub.project?.name || 'Unknown Project';
            const assigneeName = sub.intern?.name || 'Unknown Intern';
            
            return (
              <div key={sub.id} className="review-card">
                <div className="review-card__header">
                  <div>
                    <h2 className="review-card__title">Project: {projectName}</h2>
                    <div className="review-card__meta">
                      <span>Intern: {assigneeName}</span>
                      <span>Submitted: {new Date(sub.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <p style={{ fontWeight: 800, marginBottom: 'var(--space-2)' }}>GitHub Repository:</p>
                  <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="review-card__link">
                    <Link2 size={16} />
                    {sub.githubUrl}
                  </a>
                </div>

                {sub.liveUrl && (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <p style={{ fontWeight: 800, marginBottom: 'var(--space-2)' }}>Live Project:</p>
                    <a href={sub.liveUrl} target="_blank" rel="noreferrer" className="review-card__link">
                      <Link2 size={16} />
                      {sub.liveUrl}
                    </a>
                  </div>
                )}
                
                {sub.description && (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <p style={{ fontWeight: 800, marginBottom: 'var(--space-2)' }}>Intern's Comments:</p>
                    <p style={{ fontStyle: 'italic', padding: 'var(--space-2)', background: 'rgba(0,0,0,0.03)', borderRadius: '4px' }}>
                      "{sub.description}"
                    </p>
                  </div>
                )}

                {sub.fileUrl && (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <p style={{ fontWeight: 800, marginBottom: 'var(--space-2)' }}>Attachment:</p>
                    <a href={(import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '') + sub.fileUrl} target="_blank" rel="noreferrer" className="review-card__link" download>
                      <Link2 size={16} />
                      Download {sub.fileName || 'Attachment'}
                    </a>
                  </div>
                )}

                <div>
                  <label style={{ fontWeight: 800, display: 'block', marginBottom: 'var(--space-2)' }}>Feedback / Remarks:</label>
                  <textarea 
                    rows="3" 
                    className="review-feedback-input" 
                    placeholder="Leave constructive feedback here... (Required for requesting changes)"
                    value={feedback[sub.id] || ''}
                    onChange={(e) => handleFeedbackChange(sub.id, e.target.value)}
                  ></textarea>
                </div>

                <div className="review-card__actions">
                  <button className="review-btn review-btn--reject" disabled={isSubmitting} onClick={() => handleReject(sub.id)}>Request Changes</button>
                  <button className="review-btn review-btn--approve" disabled={isSubmitting} onClick={() => handleApprove(sub.id)}>Approve Project</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
