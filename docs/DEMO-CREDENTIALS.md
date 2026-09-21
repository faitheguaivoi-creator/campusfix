# CampusFix — Demo Credentials

Use the following accounts to test the live application.

**Live application:** https://campusfix-lincoln.vercel.app

**All demo accounts share the same password:** `password`

---

## Administrator

| Email | Role |
|---|---|
| `admin@campusfix.test` | Full system access |

**Where you land after login:** `/admin/dashboard`

**What you can demonstrate:**
- Dashboard with statistics and three charts
- View and filter all complaints
- Assign complaints to maintenance staff
- Change complaint status
- Manage users, staff, categories, and locations
- Moderate lost & found items

---

## Maintenance Staff

| Email | Specialty |
|---|---|
| `electrical@campusfix.test` | Electrical |
| `plumbing@campusfix.test` | Plumbing |
| `furniture@campusfix.test` | Furniture |
| `cleaning@campusfix.test` | Cleaning |

**Where you land after login:** `/staff/dashboard`

**What you can demonstrate:**
- See assigned workload and recent assignments
- View only complaints assigned to this staff member
- Update complaint status (Under Review → In Progress → Resolved)
- Add progress notes to the timeline
- Verify that anonymous complaints remain anonymous even to staff

---

## Students

| Email |
|---|
| `student1@campusfix.test` |
| `student2@campusfix.test` |
| `student3@campusfix.test` |
| … through `student12@campusfix.test` |

**Where you land after login:** `/student/dashboard`

**What you can demonstrate:**
- Submit a new complaint with or without anonymity
- Upload an image with a complaint
- Track a complaint with its reference number
- Report a lost or found item
- Browse and filter Lost & Found
- Send a "this might be mine" contact request
- Manage received contact requests

---

## Public Access (no login required)

| URL | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Sign in |
| `/register` | Create a new student account |
| `/track-complaint` | Track any complaint by reference number |