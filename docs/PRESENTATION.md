# CampusFix — Presentation & Demonstration Guide

**Time budget:** 15–20 minutes

**Setup:** Have two browser tabs open — the live URL and the Render API. Have the demo credentials visible in a text file for quick copy.

**Live URL:** https://campusfix-lincoln.vercel.app

---

## Before You Present (5 minutes before)

1. Wake the Render backend: open `https://campusfix-api-ob90.onrender.com/api/complaints/track/WARMUP` in a browser tab. Wait for the JSON response. This takes 30–50 seconds.
2. Log out of all accounts.
3. Have your demo credentials ready:
   - Admin: `admin@campusfix.test` / `password`
   - Staff: `electrical@campusfix.test` / `password`
   - Student: `student1@campusfix.test` / `password`

---

## Slide 1 — Introduction (1 minute)

> "Good morning. My name is Faith Eguaivoi. My PSA project is CampusFix — a campus complaint, maintenance, and lost-and-found management system for Lincoln College.

> The problem: our campus has no centralised way for students to report broken facilities or find lost items.

> The solution: a web application with three roles — students, administrators, and maintenance staff — and a unique feature: **anonymous reporting**."

---

## Slide 2 — Live Demonstration

### Part A — Landing and public tracking (2 minutes)

1. Open `https://campusfix-lincoln.vercel.app`
2. **Say:** *"This is the landing page. Notice the Lincoln red brand colour."*
3. Click **Track a Complaint**
4. **Say:** *"Students can track their complaint without logging in, using a reference number like CFX-7K42P9. Let me enter a bogus one."*
5. Enter `CFX-XXXXXX` → point out the friendly error

### Part B — Student registers and submits anonymously (5 minutes)

1. Go back, click **Login** → use `student1@campusfix.test` / `password`
2. **Say:** *"This is the student dashboard. Four stat cards, four action buttons."*
3. Click **Report a Problem**
4. Fill in:
   - Title: `Broken ceiling fan in Main Hall`
   - Description: `The ceiling fan has stopped working entirely.`
   - Category: `Electrical`
   - Location: `Main Hall`
   - Department: `Computer Software Engineering` → **point out the Semester dropdown appears with 6 options**
   - Change Department to `Foundation of Nursing` → **point out only 2 semesters appear**
   - Change back to `Computer Software Engineering`, Semester 1
   - Priority: `High`
   - **Tick "Submit this complaint anonymously"**
   - **Say:** *"This is the standout feature. The student's name will not appear anywhere."*
5. Submit → **point out the tracking reference displayed in large text**
6. **Copy the reference**
7. Click **View My Complaints** → point out the "Anonymous" tag

### Part C — Public anonymity proof (2 minutes)

1. **Log out**
2. Click **Track a Complaint**
3. Paste the reference
4. **Say:** *"Look at this. Even though the student was logged in when they submitted, the public tracking page shows Anonymous Student. No name, no email, no identity."*

### Part D — Admin sees it, assigns it (3 minutes)

1. Click **Login** → use `admin@campusfix.test` / `password`
2. **Say:** *"The admin dashboard. Real statistics, three charts."*
3. Click **Complaints**
4. Filter by status "Submitted"
5. Click the anonymous complaint
6. **Say:** *"Even the administrator cannot see who submitted this. The reporter field says Anonymous Student."*
7. Click **Assign to Staff** → choose **John Electrical** → Assign
8. Click **Change Status** → "In Progress" → add message → Update

### Part E — Staff updates it (3 minutes)

1. **Log out**
2. Log in as `electrical@campusfix.test` / `password`
3. **Say:** *"The staff dashboard shows only the complaints assigned to this staff member."*
4. Click **My Assignments** → click the complaint
5. **Say:** *"Notice — no reporter name. The anonymity holds even for staff."*
6. Click **Update Status** → "Resolved" → add message → submit
7. Point out the status badge changed to green "Resolved"

### Part F — Lost & Found (3 minutes)

1. **Log out** → log in as `student1@campusfix.test`
2. Click **Lost & Found**
3. **Say:** *"Students can browse all lost and found items."*
4. Filter by Category = Phone
5. Click an item you did not post
6. **Say:** *"The poster's name is masked as Campus Member — privacy is preserved."*
7. Click **This might be mine** → write a message → Send
8. Go to **My Reports** → **Sent** tab → point out the request

### Part G — Closing (1 minute)

1. **Say:** *"The system is live on the internet. The React frontend is on Vercel, the Laravel API is on Render, and the database is MySQL on Aiven. Total hosting cost: zero."*

---

## Q&A — Prepare for These Questions

**Q: How does anonymous reporting work?**
A: A boolean flag `is_anonymous` on the complaints table. The `user_id` is stored for accountability, but the `ComplaintResource` conditionally replaces the reporter's name with "Anonymous Student" in every API response. This is centralised in one file so it cannot be forgotten anywhere.

**Q: How do you prevent guessing tracking references?**
A: Each reference is 6 characters from a 32-character alphabet (32⁶ ≈ 1 billion combinations), and the endpoint is rate-limited to 10 requests per minute per IP.

**Q: How do you prevent students accessing others' complaints?**
A: Three layers — role middleware, complaint policy, and query scoping (`$user->complaints()` instead of `Complaint::all()`).

**Q: Why React and Laravel?**
A: Separation of concerns. Laravel is one of the best PHP frameworks for structured APIs. React is the most widely used frontend library. Together they let me build a professional application with clear boundaries.

**Q: Why Bearer tokens instead of cookies?**
A: The same API can serve a React Native mobile app without any code changes.

**Q: What would you add with more time?**
A: React Native mobile app, push notifications, S3 image storage, and complaint analytics.

**Q: Is the student truly anonymous?**
A: From every UI and API perspective, yes. Only a database administrator with direct MySQL access could recover the identity. This mirrors whistleblower systems and is the standard trade-off between privacy and abuse prevention.

**Q: What database did you use?**
A: MySQL. 15 tables, foreign keys, indexes on filter columns, and soft deletes for audit trails.

---

## Emergency Recovery — If Something Breaks

- **Login hangs at "Signing in..."** → Render is waking up. Wait 50 seconds.
- **CORS error in console** → Open DevTools, copy the error. If CORS, the frontend URL has changed and Render's `FRONTEND_URL` needs updating.
- **Red 500 error** → Open Render logs, show the actual error to the audience, and explain that you know where to look.

**Do not panic.** If something fails, calmly explain what it would normally show, and offer to demonstrate the same thing on your local machine.

---

## Ending Statement

> "CampusFix is a complete, secure, deployed full-stack application that solves two real problems on campus. The anonymous reporting feature shows that privacy and accountability can coexist. Thank you for your time."