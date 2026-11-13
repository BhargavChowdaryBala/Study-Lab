# Study Lab — Modern React Frontend for Online Course Management System

A production-ready, resume-grade frontend designed for the Spring Boot **Online Course Management System (OCMS)**. Built with React 18, Vite, Tailwind CSS, Axios, and Lucide React.

---

## 🚀 Key Highlights & Resume Summary

- **Architecture**: Single Page Application (SPA) with declarative client-side routing (`react-router-dom` v6).
- **Backend Integration**: Communicates with Spring Boot 3 REST APIs using Axios HTTP interceptors.
- **Stateless Spring Security Integration**: Implements HTTP Basic authentication with Base64 credentials stored securely in `localStorage` and automatically injected into the `Authorization` header for all protected requests.
- **Zero-CORS Vite Reverse Proxy**: Seamlessly proxies all `/api/*` network calls to `http://localhost:8080/*`, eliminating cross-origin security restrictions in local development without touching backend code.
- **Polymorphic Learning Player**: Supports Video lectures (YouTube embed parser / direct MP4), downloadable PDF materials, and interactive concept check quizzes.
- **Granular Progress Ledger**: Tracks student completion percentages per course with real-time UI synchronization, auto-completion triggers, and animated celebratory confetti with verifiable course completion certificates.
- **Role-Based Access Control (RBAC)**:
  - **Student Portal**: Course exploration, one-click enrollment, resume learning classroom, notification alerts, certificate generation.
  - **Instructor Studio**: Course authoring, polymorphic lesson management (video/PDF/quiz), sequence ordering, student enrollees roster, verification state gating.
  - **Admin Command Center**: Instructor verification review with 1-click Approval/Rejection, system-wide course governance, user directory management, full enrollment ledger, and custom transactional email broadcasting.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | High-performance component-driven user interface |
| **Vite 6** | Ultra-fast build tool and development server with reverse proxy |
| **Tailwind CSS 3** | Modern utility-first styling with custom gradients and micro-interactions |
| **Axios** | Promise-based HTTP client with global request/response interceptors |
| **Lucide React** | Clean, accessible SVG iconography |
| **Canvas Confetti** | Celebratory completion animations |

---

## 🏃 Running the Application

### 1. Ensure Backend is Running
Start the Spring Boot backend server:
```bash
mvn spring-boot:run
```
The backend runs at `http://localhost:8080`.

### 2. Start the Frontend
In the root project directory:
```bash
cd frontend
npm run dev
```
Open your browser and navigate to: **`http://localhost:5173`**

### 3. Production Build
```bash
npm run build
```
Creates an optimized production bundle in `frontend/dist/`.

---

## 🔐 Authentication & Role-Based Access Control

The application interacts with Spring Security 6 configured in the backend:

1. **Student Workflow**:
   - Register via the `/register` page (instant activation, role `STUDENT`).
   - Receives a welcome email from `NotificationService`.
   - Free access to explore the catalog, enroll in courses, view lectures, and complete courses.

2. **Instructor Workflow**:
   - Register via `/register` with role `INSTRUCTOR`.
   - Account starts in `PENDING` verification status.
   - Requires Administrator approval before publishing courses or adding lessons.
   - Once approved, receives an automated approval email and unlocks the full Instructor Studio.

3. **Administrator Workflow**:
   - Pre-seeded administrative account in the database (e.g. `admin@example.com` / `password123`).
   - Access to the **Admin Command Center** (`/admin/dashboard`) to approve/reject instructors, oversee courses, manage users, and dispatch custom emails.

---

## 📁 Frontend Directory Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.js           # Base Axios client & interceptors
│   │   ├── authApi.js         # User registration, profiles & instructor verification
│   │   ├── courseApi.js       # Course CRUD endpoints
│   │   ├── contentApi.js      # Video, PDF, and Quiz lessons
│   │   ├── enrollmentApi.js   # Course enrollment lifecycle
│   │   ├── progressApi.js     # Progress calculations & lesson completion
│   │   └── notificationApi.js # Email notifications & broadcasting
│   ├── components/
│   │   ├── common/            # Navbar, Footer, Badges, Modals, Spinners
│   │   └── course/            # CourseCard, ContentViewer player
│   ├── context/
│   │   ├── AuthContext.jsx    # Authentication & user state management
│   │   └── ToastContext.jsx   # Dynamic floating alert system
│   ├── pages/
│   │   ├── LandingPage.jsx    # Hero section, catalog showcase & system architecture
│   │   ├── LoginPage.jsx      # Login form with one-click demo credentials
│   │   ├── RegisterPage.jsx   # Student & Instructor sign-up
│   │   ├── CoursesCatalogPage.jsx # Searchable & filterable course catalog
│   │   ├── CourseDetailPage.jsx   # Syllabus preview & enrollment
│   │   ├── CourseLearnPage.jsx    # Interactive classroom with video player & progress
│   │   ├── student/           # Student learning dashboard
│   │   ├── instructor/        # Instructor studio & curriculum editor
│   │   └── admin/             # Admin command center & governance
│   ├── App.jsx                # Router & layout setup
│   ├── index.css              # Tailwind imports & custom scrollbar
│   └── main.jsx               # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.js             # Vite proxy configuration to localhost:8080
```

