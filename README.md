# Launch Deck — Placement Prep Platform

**Phase 1: Auth (Student / Company / Admin) + JWT + Email OTP 2FA + 3D landing UI.**
**Phase 2: Courses, Tests (with auto-grading), and auto-issued Certificates — with real seed data.**

This is the foundation for the full Ultimate Placement Preparation Platform. Everything else
(Resume Builder, ATS Checker, Coding Platform, AI Interview, Job Alerts, Placement Analytics,
Discussion Forum, etc.) plugs into this same auth + data layer as its own module/route.

## What's actually built and tested here

- **Backend**: Express + MongoDB (Mongoose) + JWT (httpOnly cookie) + bcrypt password hashing
- **OTP 2FA**: 6-digit codes, hashed at rest, TTL auto-expiry, rate-limited, resend cooldown,
  used for signup verification, login 2FA, and password reset — no email service required to
  test locally (OTPs print to the backend console if SMTP isn't configured)
- **Roles & authorization**: `student`, `company`, `admin` — every route is protected with
  `protect` (valid JWT required) and `authorize(...roles)` (role check). Admin accounts are
  never created via public signup, only via the seed script or promotion by another admin.
- **Courses**: full catalog with modules, categories (DSA, Web Development, Aptitude, System
  Design, Soft Skills, Core CS, AI/ML), enrollment, and per-module progress tracking
- **Tests**: aptitude, mock-interview, and coding/CS MCQ tests, server-side graded (the client
  never sees correct answers before submitting), with a timer and instant scoring
- **Certificates**: auto-issued the moment a student passes a test linked to a course, with a
  unique certificate ID and a public verification endpoint (so a recruiter could check one)
- **Seed data**: 8 real courses (with modules) and 5 real tests (with actual correct-answer
  questions, not placeholders) across DSA, Web Dev, Aptitude, Verbal, System Design, Core CS,
  AI/ML, and HR/Behavioral — see `backend/seed/seedData.js`
- **Frontend**: React 18 + Vite + Redux Toolkit + Tailwind + Framer Motion + Three.js
- Both `npm run build` (frontend) and `node --check` on every backend file were run and pass
  clean in this environment before delivery

## Design system ("mission console")

| Token | Value |
|---|---|
| Background | `#0B0F1A` |
| Panel | `#131A2B` |
| Accent (primary) | `#FFB447` amber |
| Accent (secondary) | `#4FD8E8` cyan |
| Text | `#E8ECF4` |
| Display type | Space Grotesk |
| Body type | Inter |
| Mono / data type | JetBrains Mono |

## Project structure

```
placement-platform/
├── backend/
│   ├── config/db.js
│   ├── models/{User,Otp,Course,Test,TestAttempt,Enrollment,Certificate}.js
│   ├── middleware/{auth,errorHandler}.js
│   ├── utils/{generateToken,otp,sendEmail,seedAdmin,certificateId}.js
│   ├── controllers/{authController,courseController,testController,certificateController}.js
│   ├── routes/{authRoutes,courseRoutes,testRoutes,certificateRoutes}.js
│   ├── seed/seedData.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/{Scene3D,RoleCard,OtpInput,ProtectedRoute}.jsx
    │   ├── pages/{Landing,Login,Register,VerifyOtp,ForgotPassword,ResetPassword}.jsx
    │   ├── pages/{Courses,CourseDetail,Tests,TakeTest,Certificates}.jsx
    │   ├── pages/dashboards/{Student,Company,Admin}Dashboard.jsx
    │   ├── store/{store,authSlice}.js
    │   ├── api/{axios,authApi,coursesApi,testsApi,certificatesApi}.js
    │   ├── App.jsx / main.jsx / index.css
    └── (Vite + Tailwind config)
```

## Run it locally

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI (free cluster at https://www.mongodb.com/atlas)
# Leave SMTP_USER / SMTP_PASS blank to see OTPs printed in the console instead of emailed
npm run dev
```

### 2. Seed real course & test data (do this once, after the backend is connected)
```bash
cd backend
node seed/seedData.js
```
This clears and re-inserts 8 courses and 5 tests. Safe to re-run any time.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

### 4. Create your first Admin account
```bash
cd backend
node utils/seedAdmin.js "Your Name" admin@example.com StrongPass123
```
Then log in with those credentials — admin can't be created through the public /register form.

## Full auth flow implemented

1. **Register** → account created (unverified) → signup OTP emailed
2. **Verify signup OTP** → email marked verified → JWT issued, logged in
3. **Login** → password checked → login OTP emailed (this is the 2FA step)
4. **Verify login OTP** → JWT issued, logged in, routed to the right dashboard by role
5. **Forgot password** → OTP emailed → **Reset password** with OTP → logged in
6. **Logout** → clears the httpOnly cookie
7. **Protected routes** → role-gated dashboards for student / company / admin, session restored
   on page refresh via `GET /api/auth/me`

## Courses, Tests & Certificates flow (as a student)

1. Log in → **Courses** → pick a category → open a course → **Enroll**
2. Mark modules done as you go → progress bar updates → course marks itself complete at 100%
3. **Tests** → pick a test → answer within the timer → **Submit** → see your score instantly
4. If the test is linked to a course and you pass, a **certificate is issued automatically**
5. **Certificates** page shows everything you've earned, each with a unique certificate ID

## Authorization matrix

| Action | Student | Company | Admin |
|---|:---:|:---:|:---:|
| Browse courses & tests | ✅ | ✅ | ✅ |
| Enroll / track progress | ✅ | ❌ | ❌ |
| Take a test | ✅ | ❌ | ❌ |
| Create/edit/delete courses & tests | ❌ | ❌ | ✅ |
| View own certificates | ✅ | ❌ | ❌ |
| View all certificates issued | ❌ | ❌ | ✅ |
| Verify a certificate by ID | Public endpoint — no login required |

## What's next (not built in this phase)

Resume Builder, ATS Resume Checker, Coding Platform (live code execution), AI Interview,
Progress Dashboard, Leaderboard, Discussion Forum, Notes Sharing, Job Alerts, Placement
Analytics, Admin UI for managing users/courses/tests (the APIs exist — the admin *screens*
to call them don't yet), Socket.io real-time chat, Redis caching, Cloudinary uploads,
Docker + CI/CD. Say which one to build next and I'll wire it into this same system.


## Phase 3: Navigation, lesson videos, professional certificates, account deletion

- **Persistent navigation** — every authenticated page now shares a top navbar with a
  **back button** (browser-history aware), quick links to Courses/Tests/Certificates, and a
  user menu (avatar, Dashboard, Log out, Delete account). No more dead ends.
- **Lesson video pages** — clicking a module inside a course now opens a dedicated lesson
  page with a real HTML5 video player, previous/next module navigation, and a "mark complete"
  action. Seed data ships with placeholder demo videos wired to every module so the player is
  never actually empty; swap `videoUrl` in `backend/seed/seedData.js` (or via the Course model)
  for your own hosted content later.
- **Professional certificate design** — certificates now render as an actual formal
  certificate (ornamented border, seal, recipient name, course, date, unique ID) in a modal
  you can open from the Certificates page or right after passing a test, with a **Print / Save
  as PDF** button. Print styling hides the app chrome so only the certificate itself prints.
- **Delete account** — available from the navbar user menu. Requires the current password
  plus typing "DELETE" to confirm, and cascades: it removes the user's enrollments, test
  attempts, and certificates along with the account itself. Backend: `DELETE /api/auth/me`.

### New/changed files
```
backend/
  controllers/authController.js   (+ deleteMe)
  routes/authRoutes.js            (+ DELETE /me)
  models/Course.js                (module field renamed resourceUrl → videoUrl)
  seed/seedData.js                (+ videoUrl on every module)
frontend/src/
  components/Navbar.jsx           (new)
  components/AppLayout.jsx        (new — shared shell with Navbar + Outlet)
  components/DeleteAccountModal.jsx (new)
  components/CertificateModal.jsx (new — the printable certificate design)
  pages/LessonView.jsx            (new — video player + module navigation)
  pages/Courses.jsx, CourseDetail.jsx, Tests.jsx, TakeTest.jsx, Certificates.jsx (updated)
  pages/dashboards/*.jsx          (simplified — logout now lives in the navbar)
  App.jsx                         (routes restructured under AppLayout)
```

Re-seed to pick up the new `videoUrl` field on existing modules:
```bash
cd backend
node seed/seedData.js
```

## Phase 4: Branding, navigation visibility, and contact footer

- **Renamed the platform to "Placement Prep"** with a proper SVG logo mark (see
  `frontend/src/components/Logo.jsx`) used in the navbar and on the landing page —
  replaces the old "Launch Deck" text-only wordmark.
- **Refreshed color palette** — same dark "mission console" theme, tuned to a slightly
  cooler, more premium navy with warmer gold accents (`frontend/tailwind.config.js`).
  Every page also now has a subtle ambient gradient background instead of flat color.
- **Contact footer** — a full footer with phone, email, 24/7 helpline, LinkedIn, and
  Instagram links now appears on the landing page (`components/Footer.jsx`), and a compact
  version appears at the bottom of every authenticated page (`components/MiniFooter.jsx`).
  **The contact details are placeholders** — open those two files and swap in your real
  phone number, email, and social links before sharing this with anyone.
- **lucide-react pinned to `0.383.0`** — the newest major version of the icon library
  dropped brand icons (LinkedIn, Instagram) for trademark reasons; pinned to the last
  version that has them.

### If the navbar/footer aren't showing up for you
This almost always means the browser tab or dev server is running an older cached build.
Fully stop and restart both dev servers, then hard-refresh the browser tab
(Ctrl+Shift+R / Cmd+Shift+R) to clear any cached JS bundle:
```bash
# in frontend/
npm install
npm run dev
```

## Phase 5: Deployment fixes (cross-domain cookies + configurable API URL)

Two things that work fine on `localhost` silently break once the frontend and backend live
on different domains (e.g. Vercel + Render). Fixed both before deployment:

- **Cookie `sameSite`/`secure`** — the JWT cookie now uses `sameSite: "none"` + `secure: true`
  in production (required for cross-site cookies to survive), and stays `sameSite: "lax"`
  locally (`backend/utils/generateToken.js`). `logout` and `deleteMe` now clear the cookie
  with the exact same attributes it was set with — browsers won't clear a cookie otherwise
  (`backend/controllers/authController.js`).
- **Configurable API base URL** — the frontend's axios instance now reads
  `VITE_API_URL` if it's set, falling back to the local dev proxy (`/api`) otherwise
  (`frontend/src/api/axios.js`, `frontend/.env.example`). Without this, the deployed
  frontend would try to call itself instead of the deployed backend.

No other functionality changed in this phase — see the step-by-step deployment guide for
where these values get set (Render env vars, Vercel env vars).
