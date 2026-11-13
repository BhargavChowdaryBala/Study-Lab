# Study Lab — Online Course Management System

A full-stack, enterprise-grade Online Course Management System built with **Spring Boot 3 (Java 21)**, **Spring Security 6**, **MySQL / TiDB Cloud**, and a modern **React 18 + Tailwind CSS** frontend.

---

## 🚀 Key Features

- **Full-Stack Architecture**: Clean separation between Spring Boot REST APIs and React 18 SPA.
- **Role-Based Access Control (RBAC)**:
  - **Student**: Course exploration, one-click enrollment, resume learning player, interactive notes & code scratchpad, certificate generation.
  - **Instructor**: Course authoring, polymorphic lesson management (Video, PDF, Quiz), student enrollees roster, verification state gating.
  - **Admin**: Review & approve instructor applications, governance over system courses & users, audit logs, and transactional email broadcasting.
- **Polymorphic Learning Player**: Video streams, downloadable PDF course materials, and modular concept-check quizzes.
- **Dark Mode / Pure Black Theme**: Switchable between clean light mode and pure OLED black (`#000000`).
- **Automated Email Notifications**: Real-time email dispatch via Spring Mail / Gmail SMTP on user registration, course enrollment, and instructor approval.

---

## 🛠️ Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.4.0** (Spring Web, Spring Data JPA, Spring Security 6, Spring Mail)
- **MySQL 8.0 / TiDB Cloud Serverless**
- **BCrypt Password Hashing (Strength 12)**
- **Docker** multi-stage containerization

### Frontend
- **React 18** + **Vite 6**
- **Tailwind CSS 3** with dark mode support
- **Axios** with HTTP Basic interceptors
- **Lucide React Icons** & **Canvas Confetti**
- **Vercel Edge Proxy** for zero-CORS communication

---

## 🏃 Running Locally

### 1. Backend
Ensure MySQL is running locally on port 3306 with database `stddb`:
```bash
./mvnw spring-boot:run
```
Backend runs at `http://localhost:8080`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## ☁️ Deployment

- **Database**: [TiDB Cloud](https://tidbcloud.com) (Free 25GB Serverless MySQL)
- **Backend**: [Render](https://render.com) (Free Docker Web Service)
- **Frontend**: [Vercel](https://vercel.com) (Free Vite React SPA Hosting)

See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete free deployment guide.

