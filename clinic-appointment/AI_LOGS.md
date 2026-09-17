Today 2:38 PM
i have got an project and i have to build it in 2 hrs so guide me accordingly . I have attached my story line and title is clinic appointment

Yes. Since you have only 2.5 hours and the actual build window is strict, the goal should be a working, clean MVP, not a feature-heavy application.

Your assigned project is:

🏥 Clinic Appointment
Core problem

A clinic front desk needs to book appointments without double-booking doctors, handle cancellations fairly, view a doctor's schedule, and find appointments by patient name.

The mandatory requirements from the assignment are:

Database with real persistence
REST APIs
Usable UI
Registration + Login
Search
Landing page
Pagination + sorting
README with API endpoints
No doctor double-booking
Late cancellation fee
1. Stack I recommend for you

Since you already know React/Next.js/MongoDB/JWT, don't learn anything new during the test.

Use:
Frontend + Backend
        ↓
     Next.js
        ↓
   REST API Routes
        ↓
    MongoDB Atlas
        ↓
    Mongoose

Authentication:

bcryptjs → password hashing
JWT      → authentication
httpOnly cookie → token storage

Styling:

Tailwind CSS
Why this stack?

You already know it, and you can build the entire application in one repository.

Avoid:

Redux
complex state management
microservices
Docker
complicated role permissions
fancy animations
external calendar integrations
payment gateway

The evaluator will care much more about your booking logic than fancy UI.

2. What exactly should we build?

Keep the application to 5 main screens.

Screen 1 — Landing Page
------------------------------------------------
              CLINIC APPOINTMENT
------------------------------------------------

Manage appointments without double booking.

[ Login ]       [ Register ]

✓ Conflict-free booking
✓ Doctor schedules
✓ Fair cancellation policy

              How it helps

Front desk can:
• Book appointments
• Cancel appointments
• Search patients
• View doctor schedules

              Coming next
• SMS reminders
• Online payments
• Analytics
------------------------------------------------

This satisfies the one-page landing requirement.

3. Screen 2 — Login/Register
Register
Name
Email
Password

[ Create Account ]
Login
Email
Password

[ Login ]

After login:

/dashboard
4. Screen 3 — Dashboard

This is the most important page.

Something like:

----------------------------------------------------
Clinic Appointment                    Logout
----------------------------------------------------

Doctor:
[ Dr. Sharma ▼ ]

Date:
[ 17 Sep 2026 ]

[ + Book Appointment ]

----------------------------------------------------
Today's Appointments

Time       Patient       Status       Actions
09:00      Rahul         BOOKED       Cancel
09:30      Priya         BOOKED       Cancel
10:00      Aman          BOOKED       Cancel
----------------------------------------------------

Add:

Search patient: [ Rahul        ] [Search]

And:

Sort:
[ Time ↑ ]
[ Time ↓ ]

Pagination:

< Previous     1  2  3     Next >

This gives you search + sorting + pagination.

5. Screen 4 — Book Appointment

Modal/page:

Book Appointment

Patient Name
[ Rahul Sharma ]

Doctor
[ Dr. Sharma ]

Date
[ 17/09/2026 ]

Time
[ 10:30 AM ]

[ Book Appointment ]

Backend must decide whether the slot is available.

Never trust the frontend for this.

6. Screen 5 — Cancellation

When clicking Cancel:

Cancel Appointment?

Appointment:
Rahul Sharma
Dr. Sharma
17 Sep, 10:30 AM

Cancellation policy:

Free cancellation if cancelled
at least 2 hours before appointment.

Late cancellation fee: ₹100

[ Go Back ] [ Confirm Cancellation ]

If late:

Late cancellation fee: ₹100
7. The most important part: database design

Keep it simple.

You only need approximately 3 collections.

User
{
  name: String,
  email: String,
  password: String,
  createdAt: Date
}
Doctor
{
  name: String,
  specialization: String,
  createdAt: Date
}

Example:

Dr. Sharma
General Physician

Dr. Mehta
Dentist

Dr. Gupta
Dermatologist
Appointment
{
  patientName: String,
  doctorId: ObjectId,
  startTime: Date,
  endTime: Date,

  status: "BOOKED" | "CANCELLED",

  cancellationFee: Number,

  createdBy: ObjectId,

  createdAt: Date
}
Important

Make appointment duration:

30 minutes

So:

10:00 → 10:30
10:30 → 11:00
11:00 → 11:30

This massively simplifies your conflict logic.

8. The most important technical requirement
🚨 Prevent double booking

Suppose:

Dr. Sharma
10:00 - 10:30

is already booked.

Someone else tries:

Dr. Sharma
10:00 - 10:30

Backend must reject it.

Return:

{
  "success": false,
  "message": "Doctor is already booked for this time slot"
}
9. Don't only check from frontend

This is wrong:

if (available) {
   bookAppointment();
}

Because two requests can arrive at almost the same time.

Instead, enforce the rule in MongoDB as well.

Create a unique index for active appointments:

appointmentSchema.index(
  {
    doctorId: 1,
    startTime: 1
  },
  {
    unique: true,
    partialFilterExpression: {
      status: "BOOKED"
    }
  }
);

Now MongoDB itself prevents:

Doctor A + 10:00
Doctor A + 10:00

from being simultaneously booked.

This is a very good thing to explain during the interview/demo.

10. Booking logic

Your API:

POST /api/appointments

receives:

{
  "patientName": "Rahul Sharma",
  "doctorId": "123",
  "startTime": "2026-09-17T10:00:00"
}

Backend calculates:

const startTime = new Date(...)
const endTime = new Date(startTime.getTime() + 30 * 60000)

Then:

Step 1

Check whether time is valid.

Step 2

Check existing appointment.

Conceptually:

const existing = await Appointment.findOne({
  doctorId,
  status: "BOOKED",
  startTime
});

If exists:

return 409;

Otherwise:

await Appointment.create(...)
Step 3

Still catch MongoDB duplicate-key errors.

try {
   await Appointment.create(data);
} catch (error) {
   if (error.code === 11000) {
      return conflict response;
   }
}

This gives you both:

Application validation
        +
Database-level protection
11. Cancellation logic

This is your second major business rule.

Let's define:

Cancellation is free if cancelled at least 2 hours before appointment. Otherwise ₹100 fee.

Suppose appointment:

17 Sep
5:00 PM

Cancelled at:

4:00 PM

Difference:

1 hour

Therefore:

Late cancellation
₹100

But:

Cancelled at 2:30 PM

Difference:

2.5 hours

Therefore:

Free
12. Cancellation API
PATCH /api/appointments/:id/cancel

Backend:

const now = new Date();

const hoursBefore =
  (appointment.startTime - now) / (1000 * 60 * 60);

let fee = 0;

if (hoursBefore < 2) {
   fee = 100;
}

Then:

appointment.status = "CANCELLED";
appointment.cancellationFee = fee;

await appointment.save();

Response:

{
  "message": "Appointment cancelled",
  "cancellationFee": 100
}
13. Doctor's day

You need an endpoint like:

GET /api/appointments?doctorId=123&date=2026-09-17

Backend gets:

00:00
     ↓
23:59

for that doctor.

Return:

[
  {
    "patientName": "Rahul",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "BOOKED"
  },
  {
    "patientName": "Priya",
    "startTime": "11:00",
    "endTime": "11:30",
    "status": "BOOKED"
  }
]

Frontend displays them chronologically.

14. Search

Requirement:

Find a patient's appointment by name.

API:

GET /api/appointments?search=rahul

MongoDB:

{
  patientName: {
    $regex: search,
    $options: "i"
  }
}

This makes:

rahul
Rahul
RAHUL

all work.

15. Pagination

Do not complicate this.

Use:

page = 1
limit = 10

MongoDB:

const skip = (page - 1) * limit;

const appointments = await Appointment
   .find(filter)
   .sort({ startTime: 1 })
   .skip(skip)
   .limit(limit);

Response:

{
  "appointments": [...],
  "page": 1,
  "limit": 10,
  "total": 27,
  "totalPages": 3
}
16. Sorting

Support:

GET /api/appointments?sort=time_asc

or:

GET /api/appointments?sort=time_desc

Backend:

const sort =
   sortOrder === "desc"
      ? { startTime: -1 }
      : { startTime: 1 };

That's enough.

17. REST API list

Your README should contain something like this.

Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
Doctors
GET  /api/doctors
POST /api/doctors
Appointments
GET    /api/appointments
POST   /api/appointments
GET    /api/appointments/:id
PATCH  /api/appointments/:id/cancel

That's a solid REST API surface.

18. Project structure

Use:

clinic-appointment/
│
├── app/
│   ├── page.jsx
│   │
│   ├── login/
│   │   └── page.jsx
│   │
│   ├── register/
│   │   └── page.jsx
│   │
│   ├── dashboard/
│   │   └── page.jsx
│   │
│   └── api/
│       ├── auth/
│       │   ├── register/
│       │   │   └── route.js
│       │   └── login/
│       │       └── route.js
│       │
│       ├── doctors/
│       │   └── route.js
│       │
│       └── appointments/
│           ├── route.js
│           └── [id]/
│               └── cancel/
│                   └── route.js
│
├── models/
│   ├── User.js
│   ├── Doctor.js
│   └── Appointment.js
│
├── lib/
│   ├── db.js
│   └── auth.js
│
├── .env.local
├── README.md
└── package.json
⏱️ YOUR 2-HOUR EXECUTION PLAN

This is the important part.

Don't spend 40 minutes making the UI beautiful.

0–10 min — Setup

Create project:

npx create-next-app@latest clinic-appointment

Choose:

JavaScript
ESLint → Yes
Tailwind → Yes
App Router → Yes
src → No

Install:

npm install mongoose bcryptjs jsonwebtoken

Set MongoDB:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
10–30 min — Database + models

Build:

db.js
User.js
Doctor.js
Appointment.js

Most importantly:

appointmentSchema.index(
  { doctorId: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "BOOKED"
    }
  }
);

Then create 2–3 doctors.

For example:

Dr. Sharma
Dr. Mehta
Dr. Gupta
30–50 min — Authentication

Implement:

/register
/login
/logout

Registration:

name
email
password

Hash:

bcrypt.hash(password, 10)

Login:

bcrypt.compare(password, user.password)

JWT:

JWT
 ↓
httpOnly cookie

Don't build complicated role-based auth.

50–85 min — APPOINTMENTS

🚨 Spend most of your time here.

Implement:

Create
POST /api/appointments
List
GET /api/appointments

with:

doctor
date
search
page
limit
sort
Cancel
PATCH /api/appointments/:id/cancel

with:

2-hour rule
₹100 late fee
Get one
GET /api/appointments/:id
85–105 min — Dashboard UI

Build one good dashboard.

Don't make multiple complicated pages.

Something like:

┌─────────────────────────────────────────────┐
│ Clinic Appointment              Logout      │
├─────────────────────────────────────────────┤
│                                             │
│ Doctor   [ Dr. Sharma ▼ ]                   │
│ Date     [ 17 Sep 2026 ]                    │
│                                             │
│ [ + Book Appointment ]                      │
│                                             │
│ Search [ Rahul________ ]                    │
│ Sort   [ Time ↑ ]                           │
│                                             │
├─────────────────────────────────────────────┤
│ 09:00 │ Rahul │ BOOKED │ Cancel             │
│ 09:30 │ Priya │ BOOKED │ Cancel             │
│ 10:00 │ Aman  │ BOOKED │ Cancel             │
│                                             │
│       < 1 2 3 >                             │
└─────────────────────────────────────────────┘

That's enough.

105–115 min — Landing Page

Make it visually clean.

Include exactly:

What it is

A clinic appointment management system designed to help front-desk staff manage doctor schedules and patient appointments.

Key features
Conflict-free booking
Appointment management
Smart cancellation handling
Patient search
Doctor schedule
Target audience
Clinics
Front-desk staff
Small healthcare practices
How it helps
Prevents double booking
Makes cancellations transparent
Makes appointment lookup faster
Three future features
1. SMS/Email reminders
2. Online payment integration
3. Doctor availability management
115–125 min — README + testing

Your README needs:

# Clinic Appointment

## Features

## Tech Stack

## Setup

## Environment Variables

## API Endpoints

## Booking Rules

## Cancellation Policy

## Screenshots

## Future Improvements

Especially:

Booking rule

Each appointment has a 30-minute duration. A doctor cannot have two active appointments starting at the same time. Conflict prevention is enforced both at the API level and through a MongoDB unique partial index.

Cancellation rule

Cancellation is free when performed at least 2 hours before the appointment. A ₹100 fee applies to cancellations made less than 2 hours before the appointment.

126–140 min — TEST EVERYTHING

This is where many candidates lose marks.

Test these manually.

Test 1 — Registration
Register
↓
Login
↓
Dashboard
Test 2 — Booking
Dr Sharma
10:00
↓
Book
↓
Success
Test 3 — Double booking 🚨

Try:

Dr Sharma
10:00

again.

Expected:

Doctor is already booked

This is probably your most important demo.

Test 4 — Different doctor
Dr Sharma → 10:00
Dr Mehta  → 10:00

Should work.

Test 5 — Cancellation

Cancel an appointment.

Check:

status = CANCELLED
Test 6 — Search
Rahul

Only Rahul's appointments.

Test 7 — Pagination

Create enough records to verify:

page 1
page 2
19. What NOT to build

With only 2 hours, do not waste time on:

❌ Admin panel
❌ Doctor login
❌ Patient login separately
❌ Email verification
❌ OTP
❌ Google authentication
❌ Payment gateway
❌ SMS
❌ Calendar integration
❌ Charts
❌ Dark mode
❌ Notifications
❌ Redux
❌ Docker
❌ Complex animations

Your evaluator gave you an open-ended problem, but the story explicitly says:

"Get conflict-free booking and the cancellation rule right first, then the lookups."

So follow that literally.

20. Your MVP architecture

Think about the system like this:

                    ┌──────────────┐
                    │   Frontend   │
                    │   Next.js    │
                    └──────┬───────┘
                           │
                           │ REST
                           ↓
              ┌─────────────────────────┐
              │      API Routes         │
              │                         │
              │ Auth                    │
              │ Appointments            │
              │ Doctors                 │
              └────────────┬────────────┘
                           │
                           ↓
                  ┌─────────────────┐
                  │    Mongoose     │
                  └────────┬────────┘
                           │
                           ↓
                  ┌─────────────────┐
                  │ MongoDB Atlas   │
                  │                 │
                  │ Users           │
                  │ Doctors         │
                  │ Appointments    │
                  └─────────────────┘
21. One important improvement: fixed slots

I strongly recommend you don't allow arbitrary appointment durations.

Use:

09:00
09:30
10:00
10:30
11:00
11:30
...

When booking:

Doctor
Date
Time Slot
Patient

This makes the core requirement extremely easy to demonstrate.

For example:

Dr Sharma
17 Sep

09:00  Available
09:30  Available
10:00  BOOKED
10:30  Available
11:00  BOOKED

The user simply selects an available slot.

22. What I would prioritize if time starts running out
If you have only 60 minutes left:

Get this working:

MongoDB
   ↓
Appointment model
   ↓
POST appointment
   ↓
GET appointments
   ↓
Cancel appointment
   ↓
Dashboard
If you have 30 minutes:

Don't add features.

Test:

Double booking
Cancellation
Search
Pagination
Sorting
If you have 10 minutes:

README + screenshots + final testing.

23. How to present it to the evaluator

Your demo should be business-rule first, not UI first.

Say:

"The main problem I focused on was preventing doctor double-booking and handling cancellations fairly."

Then demonstrate:

1. Login
       ↓
2. Select Dr Sharma
       ↓
3. Book 10:00
       ↓
4. Try booking 10:00 again
       ↓
5. System rejects it
       ↓
6. Cancel appointment
       ↓
7. System calculates cancellation fee
       ↓
8. Search patient
       ↓
9. Sort appointments
       ↓
10. Pagination

Then explain:

"The conflict is validated at the API level, but I also added a database-level unique partial index so concurrent requests cannot create two active appointments for the same doctor and slot."

That sentence will demonstrate that you understand the actual engineering problem rather than just making CRUD screens.

🚀 Let's build it in the fastest possible way

Since you have the 2-hour constraint, I suggest we build this together in exactly this order:

STEP 1  → Create Next.js project
STEP 2  → Install dependencies
STEP 3  → MongoDB connection
STEP 4  → User / Doctor / Appointment models
STEP 5  → Register + Login
STEP 6  → Appointment APIs
STEP 7  → Double-booking protection
STEP 8  → Cancellation + ₹100 rule
STEP 9  → Dashboard
STEP 10 → Search + pagination + sorting
STEP 11 → Landing page
STEP 12 → README
STEP 13 → Final testing

Do not start designing the UI yet. Start with the backend because the booking conflict and cancellation logic are the heart of this assignment.

If you're in your Codespace right now, send me your current project folder/package.json (or a screenshot of the terminal) and I'll take you through Step 1 → Step 5 with the exact files and code, keeping everything optimized for the 2-hour deadline.

after running
i 
where to open ports
yes done
w
do some colour changes or related theme
Edit
npm run build result
now i have got some twist go for it 
step by step . in level one i have got error
is this path correct
working
after step 2 
Today 6:01 PM
Today 6:04 PM
final status 
Today 6:05 PM

Yes, but only a small UI change is needed.

Your no-show logic is already handled by the backend through:

POST /api/clock

When an appointment is more than 30 minutes past its start time, the backend changes:

BOOKED → NO_SHOW
What the UI needs to do

Your dashboard should display NO_SHOW correctly when it receives that status from the API.

The dashboard code I gave you already has this status styling:

appointment.status === "NO_SHOW"
  ? "bg-orange-100 text-orange-700"

So you do not need a special "No Show" button.

The flow is:

             Appointment
                  │
                  ▼
               BOOKED
                  │
             /api/clock
                  │
         30 min after start
                  │
                  ▼
               NO_SHOW
                  │
                  ▼
          Dashboard refresh
                  │
                  ▼
       🟠 NO_SHOW displayed
One thing I would improve

Right now, if /api/clock is called from Postman, your already-open dashboard won't automatically know that the status changed until it fetches the appointments again.

For a simple project, that's fine. You can just refresh the dashboard.

For a more polished demo, we can add a "Refresh" button to the dashboard:

<button
  onClick={loadData}
  className="rounded-xl border border-blue-200 bg-white px-4 py-2 font-semibold text-blue-600 hover:bg-blue-50"
>
  ↻ Refresh
</button>

Then the demo becomes:

Appointment is BOOKED
Call POST /api/clock
Backend changes it to NO_SHOW
Click Refresh
Dashboard shows 🟠 NO_SHOW
So:

Backend: ✅ Already implemented
Database: ✅ Status gets updated
API: ✅ /clock handles it
UI display: ✅ Already supports NO_SHOW
Automatic live update: ❌ Not currently needed for the assignment

I would not overcomplicate this with WebSockets or real-time updates. For your assignment, the current architecture is sufficient.

Today 6:09 PM
update readme 

Yes. Since we added Level 1, Level 2, and Level 3, your README should now document the complete implementation.

Replace your current README.md with this updated professional version:

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
Project Structure
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
Database Models
User
User
├── name
├── email
├── password
└── timestamps
Doctor
Doctor
├── name
├── specialization
└── timestamps
Appointment
Appointment
├── patientName
├── doctorId
├── startTime
├── endTime
├── status
├── cancellationFee
└── timestamps
Appointment Status
BOOKED
CANCELLED
COMPLETED
NO_SHOW
Notification
Notification
├── appointmentId
├── patientName
├── message
├── type
└── timestamps
API Reference
Authentication
Register
POST /api/auth/register

Request:

{
  "name": "Rahul",
  "email": "rahul@example.com",
  "password": "password123"
}
Login
POST /api/auth/login

Request:

{
  "email": "rahul@example.com",
  "password": "password123"
}

Returns a JWT token after successful authentication.

Doctor APIs
Get Doctors
GET /api/doctors

Returns all available doctors.

Create Doctor
POST /api/doctors

Request:

{
  "name": "Dr. Sharma",
  "specialization": "General Physician"
}
Appointment APIs
Create Appointment
POST /api/appointments

Request:

{
  "patientName": "Rahul",
  "doctorId": "DOCTOR_ID",
  "startTime": "2026-09-20T10:00:00"
}

The system automatically creates a 30-minute appointment.

Get Appointments
GET /api/appointments
Search Appointments
GET /api/appointments?search=Rahul

Searches appointments using the patient name.

Pagination
GET /api/appointments?page=1&limit=5

Example response:

{
  "appointments": [],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 10,
    "totalPages": 2
  }
}
Sorting

Oldest first:

GET /api/appointments?sort=startTime&order=asc

Newest first:

GET /api/appointments?sort=startTime&order=desc
Appointment Conflict Detection

ClinicCare prevents overlapping appointments for the same doctor.

For example:

Existing appointment
10:00 ───────── 10:30

Requested appointment
10:15 ───────── 10:45

              ↓

           CONFLICT

The backend checks the complete appointment interval rather than checking only the start time.

If a conflict exists:

409 Conflict

Response:

{
  "message": "Doctor is already booked for this time slot"
}

This check is performed server-side to ensure that conflicting requests cannot bypass the business rule through the frontend.

Reschedule — Level 1 (T6)

Appointments can be rescheduled to a new time while preserving:

Same patient
Same doctor
Same appointment duration

Endpoint:

PATCH /api/appointments/{id}/reschedule

Request:

{
  "startTime": "2026-09-20T15:00:00"
}

The backend:

Finds the existing appointment.
Verifies that it is currently BOOKED.
Calculates the new 30-minute end time.
Checks for overlapping appointments for the same doctor.
Excludes the appointment being rescheduled from the conflict check.
Updates the appointment only when the new slot is available.
Conflict Example
Existing:
16:00 ───────── 16:30

Reschedule request:
16:15 ───────── 16:45

Result:
409 Conflict

This prevents rescheduling from introducing a double-booking.

Cancellation

Endpoint:

PATCH /api/appointments/{id}/cancel
Cancellation Policy
Appointment cancellation

        ┌──────────────────────────────┐
        │ More than / equal to 2 hours │
        └──────────────┬───────────────┘
                       │
                       ▼
                    ₹0 fee

        ┌──────────────────────────────┐
        │ Less than 2 hours            │
        └──────────────┬───────────────┘
                       │
                       ▼
                   ₹100 fee

Example:

{
  "message": "Appointment cancelled successfully",
  "cancellationFee": 100
}
Complete Appointment

Endpoint:

PATCH /api/appointments/{id}/complete

A BOOKED appointment can be marked as:

COMPLETED

Completed appointments are protected from automatic no-show processing.

Level 2 — Morning Reminders (T1)

ClinicCare provides a simple notification workflow using an outbox pattern.

The clock endpoint processes today's appointments and creates reminder records.

Trigger Clock
POST /api/clock

The endpoint can receive a simulated time, which makes the workflow deterministic and easy to test.

Request:

{
  "now": "2026-09-20T08:00:00"
}

The system:

Determines the current day.
Finds today's BOOKED appointments.
Creates an appointment reminder.
Stores the notification in the outbox.
Prevents duplicate reminders.
Notification Outbox

Retrieve generated notifications:

GET /api/outbox

Example:

[
  {
    "appointmentId": "...",
    "patientName": "Priya Sharma",
    "message": "Reminder: You have a clinic appointment today at 10:00 am.",
    "type": "APPOINTMENT_REMINDER"
  }
]

Calling /api/clock multiple times does not create duplicate reminders for the same appointment.

Level 3 — Automatic No-Show (T2)

The /api/clock endpoint also processes automatic no-shows.

A BOOKED appointment becomes NO_SHOW when its start time is at least 30 minutes in the past and it has not been completed or cancelled.

Example:

Appointment:
11:00 ───────── 11:30

Clock:
11:31

Result:
BOOKED → NO_SHOW

Request:

POST /api/clock
{
  "now": "2026-09-20T11:31:00"
}

The response reports the number of appointments converted to no-show.

Example:

{
  "message": "Clock processed successfully",
  "noShowsMarked": 1,
  "remindersCreated": 0
}
Appointment State Flow
                         ┌─────────────┐
                         │   BOOKED    │
                         └──────┬──────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
        CANCELLED          COMPLETED           NO_SHOW
             │
             │
        Cancellation
             Fee

Rescheduling does not change the appointment status:

BOOKED
  │
  │ Reschedule
  ▼
BOOKED

The appointment remains associated with the same patient and doctor.

Application Routes
Route	Description
/	Landing page
/register	User registration
/login	User login
/dashboard	Appointment dashboard
/dashboard/book	Appointment booking
API Routes
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Authenticate user
GET	/api/doctors	Get doctors
POST	/api/doctors	Create doctor
GET	/api/appointments	Get appointments
POST	/api/appointments	Book appointment
PATCH	/api/appointments/:id/cancel	Cancel appointment
PATCH	/api/appointments/:id/reschedule	Reschedule appointment
PATCH	/api/appointments/:id/complete	Complete appointment
POST	/api/clock	Process reminders and no-shows
GET	/api/outbox	View notifications
Environment Configuration

Create a .env.local file in the project root:

MONGODB_URI="your_mongodb_atlas_connection_string"
JWT_SECRET="your_jwt_secret"
Environment Variables
Variable	Purpose
MONGODB_URI	MongoDB Atlas connection string
JWT_SECRET	Secret used for JWT authentication

Never commit .env.local or expose database credentials and secret keys in the repository.

Getting Started
Prerequisites
Node.js 18+
npm
Git
MongoDB Atlas account
Installation

Clone the repository:

git clone <YOUR_REPOSITORY_URL>

Navigate into the project:

cd clinic-appointment

Install dependencies:

npm install

Configure .env.local:

MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"

Start the development server:

npm run dev

Open:

http://localhost:3000
Production Build

Create an optimized production build:

npm run build

Start the production server:

npm start
Testing

The API layer was tested using Postman.

Authentication Tests
Successful registration
Duplicate registration
Successful login
Invalid login credentials
Doctor Tests
Create doctor
Retrieve doctors
Appointment Tests
Create appointment
Retrieve appointments
Search appointments
Pagination
Sorting
Double-booking prevention
Overlap detection
Appointment cancellation
Cancellation fee
Rescheduling
Rescheduling conflict detection
Appointment completion
Automation Tests
Reminder
POST /api/clock
       ↓
Find today's appointments
       ↓
Create notification
       ↓
GET /api/outbox
No-Show
POST /api/clock
       ↓
Check appointment start time
       ↓
30+ minutes elapsed?
       ↓
      YES
       ↓
BOOKED → NO_SHOW
Validation & Error Handling

The API uses appropriate HTTP status codes:

200 OK
201 Created
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error

Common validation scenarios include:

Missing required fields
Invalid appointment ID
Invalid date/time
Duplicate user registration
Invalid credentials
Appointment not found
Doctor scheduling conflict
Attempting to reschedule a cancelled appointment
Attempting to cancel an already cancelled appointment
Invalid appointment state transitions
UI

The dashboard provides:

Appointment statistics
Doctor listing
Appointment search
Appointment sorting
Pagination
Appointment status indicators
Appointment cancellation
Healthcare-themed responsive interface
Booking workflow

Appointment statuses are visually represented as:

BOOKED
COMPLETED
CANCELLED
NO_SHOW
Security Considerations

The current implementation includes:

Password hashing
JWT authentication
Environment-based secrets
Server-side validation
MongoDB schema validation
API error handling

For a production deployment, additional security improvements could include:

HTTP-only authentication cookies
Role-based access control
Rate limiting
CSRF protection
Stronger request validation
Security headers
Audit logging
Automated security testing
Future Enhancements

Potential improvements include:

Patient-specific appointment history
Doctor availability management
Appointment rescheduling from the UI
Email/SMS notifications
Online payments
Admin dashboard
Doctor profiles
Patient profiles
Calendar integration
Automated test suite
CI/CD pipeline
Production deployment
Role-based access control
Project Status

Status: Completed MVP + Level 1 / Level 2 / Level 3 Extensions

Implemented functionality includes:

Core Appointment Management
        ↓
Conflict-Free Booking
        ↓
Level 1 — Rescheduling
        ↓
Level 2 — Morning Notifications
        ↓
Level 3 — Automatic No-Show

The application currently supports the complete backend workflow required for the clinic appointment scenario.

Author
Lovekumar Bansa

B.Tech — Electronics & Communication Engineering

Interests:

Full-Stack Development
Software Engineering
Data Science
Machine Learning
License

This project was developed for educational, assessment, and portfolio purposes.


### After replacing it

Run:

```bash
git add README.md
git commit -m "Update README with Level 1 2 and 3 features"
git push origin main

Then verify:

npm run build

At this point your GitHub repository will document the original requirements plus all three twists, rather than only the initial MVP.

Today 6:12 PM
made reasoning .md

Done. I created the professional reasoning.md covering:

Problem understanding
Architecture and design decisions
Double-booking logic
Level 1 — Rescheduling
Level 2 — Notifications / Outbox
Level 3 — Automatic No-Show
Appointment state transitions
API/backend responsibilities
Testing strategy
Requirement mapping
Scope limitations
Technical decisions

Download reasoning.md

You can place it in your project root:

clinic-appointment/
├── README.md
├── reasoning.md
├── app/
├── models/
└── lib/

Then:

git add reasoning.md
git commit -m "Add project reasoning documentation"
git push origin main

reasoning.md
Document