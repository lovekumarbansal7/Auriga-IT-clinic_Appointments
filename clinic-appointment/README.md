# ClinicCare — Clinic Appointment Management System

A full-stack clinic appointment management system built with **Next.js, React, MongoDB, and Mongoose**.

ClinicCare is designed to help a clinic front desk manage doctors and patient appointments while enforcing conflict-free scheduling, cancellation policies, appointment rescheduling, reminders, and automatic no-show handling.

---

## Overview

A clinic may have multiple doctors and a large number of patient appointments. Manual appointment management can lead to problems such as:

- Double-booking the same doctor
- Overlapping appointment slots
- Difficulty finding a patient's appointment
- Improper cancellation handling
- Missed appointment reminders
- Appointments remaining marked as booked after a patient does not show up

ClinicCare addresses these problems through server-side business rules and a responsive dashboard.

The system ensures that appointment conflicts are checked before both **booking and rescheduling**, while cancellation fees and automatic no-show processing are handled by the backend.

---

## Core Features

### Authentication

- User registration
- User login
- Password hashing
- JWT-based authentication
- Duplicate email validation
- Invalid credential handling

### Doctor Management

- Create doctors
- Retrieve doctors
- Store doctor specialization
- Display available doctors on the dashboard

### Appointment Management

- Book 30-minute appointments
- View appointments
- Search appointments by patient name
- Sort appointments by appointment time
- Paginate appointment records
- Cancel appointments
- Reschedule appointments
- Complete appointments

### Scheduling & Business Rules

- Prevent double-booking
- Detect overlapping appointment intervals
- Re-check conflicts during rescheduling
- Preserve the same patient and doctor during rescheduling
- Automatically calculate appointment end time

### Cancellation

- Cancellation 2+ hours before appointment → ₹0 fee
- Cancellation less than 2 hours before appointment → ₹100 fee
- Cancelled appointments cannot be cancelled again
- Cancelled appointments cannot be rescheduled

### Notifications

- Generate reminders for today's appointments
- Store reminders in a notification outbox
- Prevent duplicate reminders
- Inspect generated notifications through `/api/outbox`

### Automatic No-Show

- `/api/clock` processes appointment state
- BOOKED appointments become `NO_SHOW` 30 minutes after their start time
- COMPLETED appointments are not marked as no-show
- CANCELLED appointments are ignored

---

# Technology Stack

## Frontend

- Next.js 16
- React
- JavaScript
- Tailwind CSS

## Backend

- Next.js App Router
- Next.js API Routes
- Node.js
- REST APIs
- JWT

## Database

- MongoDB Atlas
- Mongoose

## Development & Testing

- Git
- GitHub
- GitHub Codespaces
- Postman
- VS Code

---

# System Architecture

```text
                       ┌──────────────────────┐
                       │      Next.js UI      │
                       │    React + Tailwind  │
                       └──────────┬───────────┘
                                  │
                                  │ HTTP
                                  ▼
                       ┌──────────────────────┐
                       │    Next.js API       │
                       │      Routes          │
                       └──────────┬───────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
       Authentication       Appointments         Notifications
        Register/Login      Booking/Cancel        /clock /outbox
             │               Reschedule               │
             │               Complete                 │
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │      Mongoose        │
                       │    Data Models       │
                       └──────────┬───────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │     MongoDB Atlas    │
                       └──────────────────────┘

clinic-appointment/
│
├── app/
│   ├── api/
│   │   │
│   │   ├── appointments/
│   │   │   ├── route.js
│   │   │   │
│   │   │   └── [id]/
│   │   │       ├── cancel/
│   │   │       │   └── route.js
│   │   │       │
│   │   │       ├── complete/
│   │   │       │   └── route.js
│   │   │       │
│   │   │       └── reschedule/
│   │   │           └── route.js
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.js
│   │   │   │
│   │   │   └── register/
│   │   │       └── route.js
│   │   │
│   │   ├── doctors/
│   │   │   └── route.js
│   │   │
│   │   ├── clock/
│   │   │   └── route.js
│   │   │
│   │   └── outbox/
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
│   ├── Appointment.js
│   └── Notification.js
│
├── public/
│
├── .env.local
├── .gitignore
├── package.json
└── README.md