# Taksha Internship Platform
## Product Requirements Document (PRD)

**Document Type:** Core Product Requirements Document
**Product:** Taksha Internship Platform
**Version:** 1.0
**Status:** Draft / Conceptual

---

## 1. Product Overview

### 1.1 Purpose
The Taksha Internship Platform is a unified, role-based internship management system. It bridges the gap between interns and mentors by providing a single source of truth for task assignment, submission tracking, and feedback loops. 

### 1.2 Core Philosophy: One Platform, Two Views
Unlike disjointed systems (e.g., combining Slack, Google Drive, and Trello), this platform operates on a **single backend/database** serving two distinct interfaces:
1. **Intern Dashboard:** Focused on task execution, file submission, and reading feedback.
2. **Admin/Mentor Dashboard:** Focused on task creation, intern assignment, submission review, and progress tracking.

---

## 2. Information Architecture & Hierarchy

### 2.1 The Internship Hierarchy
The platform organizes work into a strict three-tier hierarchy to handle multiple projects during a single internship period:

```text
INTERNSHIP (e.g., 1 Month Frontend Track)
│
├── PROJECT 01 (e.g., Finora)
│   ├── Task 01 (e.g., Responsive Navbar)
│   └── Task 02
│
└── PROJECT 02 (e.g., NovaCare)
    ├── Task 01
    └── Task 02
```

### 2.2 Database Relational Model
The system relies on the following core entities and relationships:

```text
USER (Role: Intern | Mentor/Admin)
 │
 └── Assigned Tasks
      │
      ▼
    TASK (Project, Deadline, Status, Priority, Requirements)
      │
      ▼
  SUBMISSION (Files/ZIP, GitHub URL, Live URL, Submitted At)
      │
      ▼
   REVIEW (Mentor, Remarks, Status, Reviewed At)
```
*Note: Review history must not be overwritten. Multiple submissions and reviews form an immutable audit trail.*

---

## 3. The Verification Timeline & Task Workflow

Every task follows a strict, state-machine driven workflow, generating a **Verification Timeline** that serves as a permanent record of the intern's progress and the mentor's evaluation.

### 3.1 Status Lifecycle
`Assigned` → `To Do` → `In Progress` → `Submitted for Review` → `Changes Requested` (Loop back to Submitted) → `Verified / Completed`

### 3.2 Workflow Example
1. **Task Creation:** Admin creates a task (e.g., "Build Responsive Navbar" for Project "Finora").
2. **Intern Dashboard:** Task appears immediately in the intern's `TO DO` column.
3. **Start Task:** Intern clicks "Start Task". Status updates to `IN PROGRESS` on both the intern and admin dashboards in real-time.
4. **Submission:** Intern uploads files (e.g., `responsive-navbar.zip`), a GitHub link, and a Live Demo link, then clicks "Submit for Review". Status updates to `SUBMITTED FOR REVIEW`.
5. **Mentor Review:** Mentor receives a notification and opens the dedicated "Review Task" screen.
   - If **Changes Requested**: Mentor leaves remarks (e.g., "Improve keyboard navigation"). Status reverts to `CHANGES REQUESTED`. Intern is notified.
   - If **Approved**: Mentor clicks "Verify Task". Status changes to `COMPLETED / VERIFIED`.
6. **Analytics Update:** Task statistics (Total, Completed, Pending) update automatically for both the intern and the admin.

---

## 4. User Interfaces, Authentication & Features

### 4.0 Authentication Flow & Branding
The platform intentionally avoids a single generic login page. Instead, authentication is split into three distinct URLs. Authentication routes to a shared backend service, but the frontend experience and branding are tailored to the role to ensure security and reduce confusion. **There is no public signup.** All accounts are provisioned by the administration.

#### `/intern/login` (Intern Portal)
- **Messaging:** *"Welcome back, Intern. Continue your Taksha internship journey."*
- **Fields:** Intern ID / Email, Password, Remember me, Forgot password.
- **Branding:** Friendly, Yellow dominant. Theme: *"Learn. Build. Create Impact."*

#### `/mentor/login` (Mentor Portal)
- **Messaging:** *"Welcome back, Mentor. Manage your interns and review their progress."*
- **Fields:** Work Email, Password, Remember me, Forgot password.
- **Branding:** Professional, Yellow + Blue. Theme: *"Guide. Review. Grow."*

#### `/admin/login` (Administration)
- **Messaging:** *"Taksha Administration. Secure access to the internship management system."*
- **Fields:** Admin Email, Password.
- **Security:** Requires **Two-Factor Authentication (2FA)**.
- **Branding:** Restrained, Black + Yellow. Theme: *"Manage. Monitor. Lead."*

### 4.1 Intern Dashboard
**Goal:** Remove ambiguity and focus on execution.
- **My Internship View:** Overall progress across the assigned track.
- **My Projects:** Breakdown of assigned projects.
- **Task Board:** Kanban-style or list view of tasks (`To Do`, `In Progress`, `Changes Requested`, `Completed`).
- **Submission Portal:** Interface to upload `.zip` files, paste URLs, and add notes.
- **Feedback Viewer:** Clear UI to read mentor remarks and action items for requested changes.
- **Statistics:** Real-time metrics on completed vs. pending tasks.

### 4.2 Admin/Mentor Dashboard
**Goal:** High-level oversight and streamlined review process.
- **Intern Overview:** Track progress across all active interns (e.g., "Charu → Finora → 75% complete").
- **Task Creator:** Assign tasks with deadlines, priorities, projects, and specific requirements.
- **Review Queue:** A consolidated list of all tasks currently `SUBMITTED FOR REVIEW`.
- **Review Drawer/Screen:** A dedicated UI for evaluating a submission. Includes access to uploaded files, links, a checklist of requirements, and a text area for Mentor Remarks.
- **Audit Trail:** View the complete timeline of a task (Submission #1 → Feedback → Submission #2 → Verified).

---

## 5. Technical Architecture (Recommended)

### 5.1 Frontend
- **Framework:** React (Vite / Next.js)
- **Styling:** Neo-Brutalist or Taksha Design System (Tailwind / Plain CSS)
- **State Management:** Real-time syncing (e.g., React Query or WebSockets) for instant status updates.

### 5.2 Authentication
- **System:** Unified backend authentication service validating credentials and returning a JWT/Session.
- **Roles:** `INTERN`, `MENTOR`, `ADMIN`.
- **Security:** Strict separation of frontend login routes (`/intern/login`, `/mentor/login`, `/admin/login`). 2FA required for `ADMIN` role. No public registration endpoints exist on the backend.

### 5.3 Backend & Database
- **Database:** PostgreSQL or similar relational DB to strictly enforce foreign keys and relationships between Internships, Projects, Tasks, and Reviews.
- **Workflow Engine:** API layer to handle state transitions and prevent illegal status changes (e.g., cannot verify a task that hasn't been submitted).

### 5.4 Storage
- **File Handling:** AWS S3 / Cloudflare R2 for secure storage of uploaded `.zip` files, PDFs, and images. Versioning must be supported to keep track of multiple submission iterations.
- **Notifications:** Email or in-app notification system triggered on status changes (e.g., `Changes Requested`).
