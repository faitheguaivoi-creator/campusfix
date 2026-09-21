# CampusFix

**Campus Complaint, Maintenance & Lost-and-Found Management System**

A full-stack web application built for **Lincoln College of Science, Management and Technology** as a Practical Skill Acquisition (PSA) semester project.

---

## Overview

CampusFix is a centralized web platform that solves two problems commonly faced on university campuses:

1. **Reporting campus maintenance issues** — broken facilities, electrical faults, plumbing problems, damaged furniture, and more.
2. **Lost and found** — helping students reunite with lost belongings through a privacy-preserving contact mechanism.

The standout feature of CampusFix is **optional anonymous complaint reporting** — students can report sensitive problems without their identity being visible to staff, administrators, or other users, while still retaining a secure audit trail for abuse prevention.

The system has **three user roles** — Student, Administrator, and Maintenance Staff — each with a dedicated dashboard, permission set, and workflow.

---

## The Problem

Universities today have no centralised way for students to report broken facilities. Complaints are made verbally, in WhatsApp groups, or not at all. There is:

- **No tracking** — students never know if their complaint was seen
- **No accountability** — maintenance performance cannot be measured
- **No safety** — students fear retaliation for reporting sensitive issues
- **No reunification** — lost items get posted in random WhatsApp groups and never found

## The Solution

CampusFix provides:

- One platform for campus problems and lost items
- Unique, unpredictable tracking references (`CFX-7K42P9`)
- Anonymous reporting that balances privacy with accountability
- Role-based access control enforced at three layers
- A REST API designed to serve both web and future mobile clients

---

## Key Features

### Student

- Register, log in, log out, update profile
- Submit complaints with title, description, category, location, department, semester, priority, and optional image
- **Submit anonymously** — identity hidden everywhere except the database
- Track complaints in real time with a unique reference number
- Browse, report, and close lost & found items
- Send "this might be mine" contact requests to item posters
- Receive and manage contact requests on their own items

### Administrator

- Full dashboard with statistics and three charts (complaints by status / category / department)
- View, filter, assign, and moderate all complaints
- Change statuses, add updates, delete inappropriate content
- Manage lost & found moderation
- Create, edit, and deactivate users
- View maintenance staff workload
- Manage complaint categories, lost & found categories, and campus locations

### Maintenance Staff

- Dedicated dashboard showing assigned workload
- View only complaints assigned to them
- Update status (Under Review → In Progress → Resolved)
- Add progress notes visible in the timeline
- Anonymous complainants remain anonymous to staff

### Public (no login required)

- Browse the landing page
- Track any complaint using its reference number (e.g. `CFX-7K42P9`)
- Public tracking never reveals reporter identity

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS 3.4, React Router 6, Axios, Recharts, Lucide Icons |
| **Backend** | Laravel 12, PHP 8.2, Laravel Sanctum |
| **Database** | MySQL 8.0+ |
| **Authentication** | Bearer token authentication (Sanctum) |
| **Deployment** | Vercel (frontend), Render (backend), Aiven (database) |

---

## System Architecture


