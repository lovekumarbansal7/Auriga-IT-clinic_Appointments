# 🏥 ClinicCare – Clinic Appointment Management System

ClinicCare is a full-stack clinic appointment management system that allows patients to register, log in, view doctors, book appointments, search appointments, sort and paginate appointment records, and cancel appointments.

The system also prevents double-booking of doctors and applies a cancellation fee when an appointment is cancelled less than 2 hours before the scheduled time.

---

## 🚀 Features

- 👤 User Registration
- 🔐 User Login with JWT Authentication
- 👨‍⚕️ Doctor Management
- 📅 Book Clinic Appointments
- 🚫 Prevent Double-Booking
- 🔍 Search Appointments by Patient Name
- ↕️ Sort Appointments by Date
- 📄 Appointment Pagination
- ❌ Cancel Appointments
- 💰 Automatic Cancellation Fee Calculation
- 📊 Dashboard with Appointment Statistics
- 📱 Responsive Healthcare-Themed UI
- 🗄️ MongoDB Database Integration

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React.js
- Tailwind CSS
- JavaScript

### Backend
- Next.js App Router API Routes
- Node.js
- JWT Authentication

### Database
- MongoDB Atlas
- Mongoose

### Development Tools
- Git & GitHub
- GitHub Codespaces
- Postman
- VS Code

---

## 📂 Project Structure

```text
clinic-appointment/
│
├── app/
│   ├── api/
│   │   ├── appointments/
│   │   │   ├── route.js
│   │   │   └── [id]/
│   │   │       └── cancel/
│   │   │           └── route.js
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.js
│   │   │   └── register/
│   │   │       └── route.js
│   │   │
│   │   ├── doctors/
│   │   │   └── route.js
│   │   │
│   │   └── test-db/
│   │       └── route.js
│   │
│   ├── dashboard/
│   │   ├── page.js
│   │   └── book/
│   │       └── page.js
│   │
│   ├── login/
│   │   └── page.js
│   │
│   ├── register/
│   │   └── page.js
│   │
│   ├── page.js
│   └── layout.js
│
├── lib/
│   └── db.js
│
├── models/
│   ├── User.js
│   ├── Doctor.js
│   └── Appointment.js
│
├── public/
│
├── .env.local
├── package.json
└── README.md