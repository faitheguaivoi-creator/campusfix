# CampusFix — PSA Project Report

**Project Title:** CampusFix — Campus Complaint, Maintenance & Lost-and-Found Management System

**Institution:** Lincoln College of Science, Management and Technology

**Author:** Faith Eguaivoi

**Year:** 2026

---

## 1. Introduction

CampusFix is a full-stack web application designed to modernise how students at Lincoln College of Science, Management and Technology report campus problems and manage lost-and-found items. The platform provides a single, centralised system that connects students, administrators, and maintenance staff through a shared digital infrastructure.

The system comprises two modules:

1. **Campus Complaints & Maintenance** — for reporting and tracking problems with campus facilities
2. **Lost & Found** — for reporting, browsing, and reclaiming lost belongings

A distinctive feature of CampusFix is **anonymous complaint reporting**, which enables students to raise sensitive issues without their identity being publicly revealed, while retaining the accountability that comes from being an authenticated user.

---

## 2. Background of the Study

Before this project, Lincoln College had no centralised digital channel for students to report facility problems. Complaints were typically communicated verbally to lecturers or student representatives, or posted in WhatsApp groups. This approach had several drawbacks:

- Issues were frequently forgotten or lost track of
- Maintenance staff had no prioritised work queue
- Administrators had no visibility into complaint volumes or trends
- Students who feared reprisal for sensitive reports stayed silent
- Lost items were rarely reunited with their owners

The rapid adoption of smartphones and web technologies on campus creates an opportunity to replace these ad-hoc processes with a modern, web-based platform.

---

## 3. Problem Statement

Lincoln College of Science, Management and Technology lacks a centralised system for:

1. Recording and tracking campus maintenance complaints
2. Assigning complaints to appropriate maintenance personnel
3. Providing feedback to students about the status of their complaints
4. Protecting the identity of students who wish to report problems anonymously
5. Allowing students to report, browse, and reclaim lost-and-found items
6. Giving administrators visibility into complaint volumes, categories, and response times

Without such a system, maintenance problems persist longer than necessary, students lose trust in reporting channels, and lost items are rarely returned to their owners.

---

## 4. Aim

To design and develop a web-based campus complaint, maintenance, and lost-and-found management system that centralises the reporting process, enforces role-based accountability, and provides students with a safe option for anonymous reporting.

---

## 5. Objectives

1. Develop a secure web application with three distinct user roles: Student, Administrator, and Maintenance Staff.
2. Enable students to submit complaints with optional anonymous reporting.
3. Provide unique, unpredictable complaint tracking references so students can monitor progress.
4. Implement a complete Lost & Found module with privacy-preserving contact requests.
5. Provide administrators with dashboards, filtering tools, and charts for managing complaints and items.
6. Provide maintenance staff with a focused view of only their assigned complaints.
7. Enforce security through role-based access control, policies, and query scoping.
8. Deploy the system to production at zero cost.

---

## 6. Significance of the Project

The project delivers value to multiple stakeholders:

- **Students** gain a convenient, trustworthy channel for reporting problems and finding lost items
- **Maintenance staff** receive a prioritised, filtered queue of assigned work
- **Administrators** gain visibility into campus problem trends and can measure performance
- **The institution** benefits from faster issue resolution, higher student satisfaction, and a safety mechanism for anonymous reporting

---

## 7. Scope

The system covers:

- User registration, authentication, and profile management
- Complaint submission with category, location, department, semester, priority, description, and optional image
- Anonymous complaint reporting
- Unique tracking references with public tracking
- Complaint assignment and status workflow
- Complaint comments and updates
- Lost & found item reporting and browsing
- Privacy-preserving contact requests between users
- Administrative dashboards, filtering, and moderation
- Role-based access control

---

## 8. Limitations

The following are outside the scope of the current version:

- No real-time chat or instant messaging
- No push notifications or email notifications
- No map integration
- No payment features
- No third-party login (Google, Facebook)
- Image storage on the free Render tier uses ephemeral disk; images are lost on service restart
- The system does not include a mobile application (though the API is designed to support one)

---

## 9. Target Users

| Role | Description |
|---|---|
| **Students** | Any Lincoln College student with a valid email address |
| **Administrators** | ICT and administrative staff responsible for complaint management |
| **Maintenance Staff** | Works & Maintenance personnel who resolve complaints |

---

## 10. Functional Requirements

- The system shall allow students to register with name, email, and password.
- The system shall authenticate users and issue Bearer tokens.
- The system shall allow students to submit complaints with title, description, category, location, department, semester, priority, and optional image.
- The system shall allow students to submit complaints anonymously.
- The system shall generate a unique, unpredictable tracking reference (`CFX-XXXXXX`) for each complaint.
- The system shall allow any user to track a complaint using its reference number without logging in.
- The system shall allow administrators to view, filter, assign, and moderate all complaints.
- The system shall allow maintenance staff to view and update only the complaints assigned to them.
- The system shall allow students to report and browse lost & found items.
- The system shall allow users to send "this might be mine" contact requests without exposing personal contact details.
- The system shall allow administrators to manage users, staff, categories, and locations.
- The system shall enforce role-based access control at the middleware, policy, and query levels.

---

## 11. Non-Functional Requirements

- **Security** — passwords hashed with bcrypt; tokens via Laravel Sanctum; rate limiting on authentication routes.
- **Privacy** — anonymous reporters must never be identified through the UI or API.
- **Performance** — pages should load in under 3 seconds on a normal connection.
- **Responsiveness** — the interface must work on desktop, tablet, and mobile.
- **Reliability** — the database must preserve data integrity across concurrent writes.
- **Usability** — the interface must be intuitive without training.
- **Maintainability** — code must follow Laravel and React best practices.

---

## 12. System Architecture

CampusFix uses a decoupled, three-tier architecture:

**Presentation tier** — React 18 SPA deployed on Vercel. Communicates with the backend exclusively via JSON over HTTPS using Bearer tokens.

**Application tier** — Laravel 12 REST API deployed on Render. Handles authentication, authorization, business logic, validation, and image storage.

**Data tier** — MySQL 8 database hosted on Aiven. Stores all user, complaint, and lost-and-found data.

This separation of concerns allows the backend to serve any client — web, mobile, or desktop — without modification, satisfying a key design goal of the project.

---

## 13. Database Design

The database consists of 15 tables. The core tables are:

| Table | Purpose |
|---|---|
| `users` | All accounts with role, contact, and profile fields |
| `locations` | 16 campus locations |
| `departments` | 5 college departments with `max_semesters` |
| `complaint_categories` | 10 complaint categories |
| `complaints` | Main complaint records |
| `complaint_updates` | Timeline of status changes and comments |
| `lost_found_categories` | 11 lost & found categories |
| `lost_found_items` | Lost and found item reports |
| `lost_found_contacts` | Privacy-preserving contact requests |
| `personal_access_tokens` | Sanctum API tokens |

**Key relationships:**

- User has many Complaints (as reporter and as assignee)
- Complaint belongs to User, Category, Location, Department; has many Updates
- LostFoundItem belongs to User, Category, Location, Department; has many Contacts
- LostFoundContact belongs to Item, Sender, Receiver

**Design decisions:**

- `is_anonymous` is a boolean flag on `complaints`. The `user_id` is always stored, but the reporter is hidden in the `ComplaintResource`.
- `tracking_reference` is a 6-character random string with a 32-character alphabet — 32⁶ ≈ 1 billion possibilities.
- Soft deletes preserve audit trails on complaints and lost/found items.
- `departments.max_semesters` is a single integer column that dynamically drives the semester dropdown.

---

## 14. Technologies Used

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS 3.4 |
| Routing | React Router 6 |
| HTTP client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Backend framework | Laravel 12 |
| Language | PHP 8.2 |
| Authentication | Laravel Sanctum |
| Database | MySQL 8.4 |
| Hosting (frontend) | Vercel |
| Hosting (backend) | Render |
| Hosting (database) | Aiven |

---

## 15. Testing

Testing was performed at three levels:

**Manual functional testing** — every user flow was tested on the live and local deployments: registration, login, complaint submission, anonymous reporting, public tracking, admin assignment, staff status updates, and lost & found lifecycle.

**Authorization testing** — attempts to access endpoints across roles were made; students and staff correctly received `403 Forbidden` when accessing admin routes. Staff could not access complaints not assigned to them.

**Privacy testing** — anonymous complaints were submitted and verified to hide the reporter's identity in the student view, admin view, staff view, and public tracking view.

---

## 16. Expected Results

The delivered system:

- Provides a working, deployed, three-role web application
- Successfully hides the identity of anonymous reporters at all times
- Allows students to track their complaints publicly with a reference number
- Allows administrators to assign complaints and change statuses
- Allows maintenance staff to update only their assigned tasks
- Handles lost & found reporting with a privacy-preserving contact mechanism
- Runs at zero monthly cost on free-tier hosting

---

## 17. Conclusion

CampusFix demonstrates that a small, focused full-stack web application can meaningfully improve campus operations when it addresses real workflows, respects user privacy, and enforces role-based accountability. The project delivers a complete, secure, deployable product within the PSA timeframe, and its architecture is designed to extend to a mobile application in the future.

---

## 18. Future Improvements

- **React Native mobile app** — the API was designed for this from the start
- **Push notifications** — for status changes and contact requests
- **Email notifications** — for admins on new complaints and for students on updates
- **S3 or Cloudinary storage** — for permanent image storage
- **Dashboard analytics** — average resolution time, complaint trends over time
- **Two-way contact messaging** — replacing the current one-shot request mechanism
- **College SSO login** — integrating with the institution's existing authentication
- **Bulk complaint actions** — assigning or closing multiple complaints at once