import React from 'react';
import SEO from '../../components/SEO/SEO';
import './InternLeave.css';

export default function InternLeave() {
  const leaveHistory = [
    { id: 1, type: 'Sick Leave', from: '2026-05-15', to: '2026-05-16', days: 2, status: 'APPROVED' },
    { id: 2, type: 'Casual Leave', from: '2026-06-01', to: '2026-06-01', days: 1, status: 'PENDING' }
  ];

  return (
    <>
      <SEO title="Leave Management | Taksha Workspace" />
      <div className="intern-leave">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">Leave Management</h1>
            <p className="intern-tasks__subtitle">Request time off and view your leave history.</p>
          </div>
        </header>

        <div className="leave-grid">
          {/* Request Form */}
          <div className="leave-form-container">
            <h2 className="leave-form-title">Request Leave</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="leave-form-group">
                <label className="leave-label">Leave Type</label>
                <select className="leave-select">
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div className="leave-form-group" style={{ flex: 1 }}>
                  <label className="leave-label">From Date</label>
                  <input type="date" className="leave-input" />
                </div>
                <div className="leave-form-group" style={{ flex: 1 }}>
                  <label className="leave-label">To Date</label>
                  <input type="date" className="leave-input" />
                </div>
              </div>

              <div className="leave-form-group">
                <label className="leave-label">Reason</label>
                <textarea className="leave-textarea" placeholder="Briefly explain the reason for your leave request..."></textarea>
              </div>

              <button type="submit" className="leave-submit">Submit Request</button>
            </form>
          </div>

          {/* History Table */}
          <div className="leave-history-container">
            <h2 className="leave-form-title">Leave History</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="leave-history-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveHistory.map(leave => (
                    <tr key={leave.id}>
                      <td style={{ fontWeight: 800 }}>{leave.type}</td>
                      <td>{leave.from} <br/><small>to {leave.to}</small></td>
                      <td>{leave.days}</td>
                      <td>
                        <span className={`leave-badge leave-badge--${leave.status}`}>
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
