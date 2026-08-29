import React from 'react';
import SEO from '../../components/SEO/SEO';
import './InternDetails.css';

export default function InternDetails() {
  return (
    <>
      <SEO title="Internship Details | Taksha Nexus Workspace" />
      <div className="intern-details">
        <header className="intern-tasks__header">
          <div>
            <h1 className="intern-tasks__title">Internship Details</h1>
            <p className="intern-tasks__subtitle">Program guidelines and track information.</p>
          </div>
        </header>

        <div className="details-card">
          <div className="details-section">
            <h2>Program Overview</h2>
            <p>
              Welcome to the Taksha Nexus Frontend Internship Track! This program is designed to bridge the gap between academic learning and production-grade software development. 
              Over the course of this internship, you will be assigned to real-world projects and expected to deliver high-quality, responsive, and accessible code.
            </p>
          </div>
          
          <div className="details-section">
            <h2>Core Guidelines</h2>
            <ul>
              <li><strong>Task Workflow:</strong> Always move tasks to "In Progress" before starting work. Do not submit work directly without starting the task first.</li>
              <li><strong>Submission:</strong> All UI code must be submitted with a live demo link and a source code link.</li>
              <li><strong>Feedback Loop:</strong> Mentors will review your code. If "Changes Requested" is marked, you must address all remarks before resubmitting.</li>
              <li><strong>Communication:</strong> Use the portal for all official task submissions. Do not DM mentors your ZIP files.</li>
            </ul>
          </div>
          
          <div className="details-section">
            <h2>Track Outcomes</h2>
            <p>
              By the end of this internship, you will have mastered React state management, context APIs, Vite build systems, and advanced CSS methodologies like BEM and Neo-Brutalism.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
