# ClinicCare --- Reasoning & Design Decisions

## 1. Problem Understanding

ClinicCare is designed for a clinic front desk that needs reliable
appointment management for multiple doctors and patients.

The main problems are:

-   Preventing double-booking and overlapping appointments
-   Finding patient appointments quickly
-   Handling cancellations and late-cancellation fees
-   Rescheduling appointments without creating conflicts
-   Sending reminders for today's appointments
-   Automatically marking missed appointments as `NO_SHOW`

The key design principle is that important business rules are enforced
by the backend, not only by the frontend.

------------------------------------------------------------------------

## 2. Appointment Design

Each appointment has a fixed duration of **30 minutes**.

If:

``` text
startTime = 10:00
```

the backend calculates:

``` text
endTime = 10:30
```

This keeps appointment duration consistent during both booking and
rescheduling.

------------------------------------------------------------------------

## 3. Double-Booking Prevention

The system checks appointment intervals rather than only comparing start
times.

For example:

``` text
Existing:
10:00 ───────── 10:30

Requested:
10:15 ───────── 10:45
```

These appointments overlap and must be rejected.

The backend uses:

``` js
const existing = await Appointment.findOne({
  doctorId,
  status: "BOOKED",
  startTime: { $lt: end },
  endTime: { $gt: start },
});
```

The logic means:

``` text
existing.startTime < requested.endTime
AND
existing.endTime > requested.startTime
```

This protects the scheduling rule even when requests are sent directly
to the API.

------------------------------------------------------------------------

## 4. Rescheduling --- Level 1 (T6)

Endpoint:

``` http
PATCH /api/appointments/:id/reschedule
```

The rescheduling process:

1.  Finds the appointment.
2.  Verifies that it exists.
3.  Verifies that its status is `BOOKED`.
4.  Calculates the new 30-minute end time.
5.  Re-checks doctor availability.
6.  Rejects overlapping slots.
7.  Updates the appointment only when the new slot is available.

The same patient and doctor remain associated with the appointment.

Example:

``` text
Existing appointment:
16:00 ───────── 16:30

Requested reschedule:
16:15 ───────── 16:45

Result:
409 Conflict
```

This prevents rescheduling from introducing a double-booking.

------------------------------------------------------------------------

## 5. Cancellation Rule

Cancellation is based on the time remaining before the appointment.

``` text
Cancellation >= 2 hours before appointment
        -> ₹0 fee

Cancellation < 2 hours before appointment
        -> ₹100 fee
```

The calculation is performed by the backend.

A cancelled appointment cannot be cancelled again or rescheduled.

------------------------------------------------------------------------

## 6. Appointment States

The system uses four explicit states:

``` text
BOOKED
CANCELLED
COMPLETED
NO_SHOW
```

Main state transitions:

``` text
                  BOOKED
                 /   |                   /    |                   /     |             CANCELLED COMPLETED NO_SHOW
```

Rescheduling does not change the state:

``` text
BOOKED -> Reschedule -> BOOKED
```

Only appointments that are still `BOOKED` can become `NO_SHOW`.

------------------------------------------------------------------------

## 7. Search, Sorting and Pagination

The appointment API supports:

``` text
search
page
limit
sort
order
```

Example:

``` http
GET /api/appointments?search=Rahul&page=1&limit=5&sort=startTime&order=asc
```

Search is case-insensitive and uses the patient name.

Pagination prevents the dashboard from loading unnecessary records.

Sorting allows appointments to be displayed in ascending or descending
time order.

------------------------------------------------------------------------

# Level 2 --- T1: Morning Reminders

## 8. Reminder Design

The requirement is to remind patients about today's appointments.

The workflow is triggered through:

``` http
POST /api/clock
```

and inspected through:

``` http
GET /api/outbox
```

The clock endpoint accepts an optional simulated time:

``` json
{
  "now": "2026-09-20T08:00:00"
}
```

Using a simulated time makes the feature deterministic and easy to test
without waiting for a real morning.

------------------------------------------------------------------------

## 9. Reminder Processing

The flow is:

``` text
POST /api/clock
        |
        v
Determine current day
        |
        v
Find today's BOOKED appointments
        |
        v
Check whether reminder already exists
        |
        v
Create notification
        |
        v
Store notification in outbox
```

Notifications contain:

``` text
appointmentId
patientName
message
type
timestamps
```

------------------------------------------------------------------------

## 10. Duplicate Reminder Prevention

Calling `/api/clock` multiple times should not create duplicate
reminders.

The backend first checks whether an `APPOINTMENT_REMINDER` already
exists for the appointment.

``` text
First clock call
      |
      v
No reminder
      |
      v
Create reminder

Second clock call
      |
      v
Reminder exists
      |
      v
Do not create another
```

This makes reminder processing safely repeatable.

------------------------------------------------------------------------

# Level 3 --- T2: Automatic No-Show

## 11. No-Show Design

The same `/api/clock` endpoint processes automatic no-shows.

A `BOOKED` appointment becomes `NO_SHOW` when its start time is at least
30 minutes in the past.

Example:

``` text
Appointment:
11:00

Clock:
11:31

Result:
BOOKED -> NO_SHOW
```

The backend only targets appointments with:

``` text
status = BOOKED
```

Therefore, `COMPLETED` and `CANCELLED` appointments are protected from
being incorrectly marked as no-show.

------------------------------------------------------------------------

## 12. Why Use `/clock`

Time-dependent functionality is difficult to test using the real system
clock.

Instead, the API accepts:

``` json
{
  "now": "2026-09-20T11:31:00"
}
```

This allows deterministic testing of:

-   Before appointment
-   During appointment
-   Exactly 30 minutes after start
-   More than 30 minutes after start

It also matches the assignment's grading workflow.

------------------------------------------------------------------------

## 13. Frontend vs Backend Responsibilities

### Frontend

The UI is responsible for:

-   Displaying doctors
-   Displaying appointments
-   Booking appointments
-   Searching
-   Sorting
-   Pagination
-   Displaying appointment status
-   Cancelling appointments
-   Showing success and error messages

### Backend

The API is responsible for:

-   Database operations
-   Authentication
-   Validation
-   Double-booking prevention
-   Overlap detection
-   Cancellation fee calculation
-   Rescheduling conflict checks
-   Notification creation
-   Duplicate reminder prevention
-   Automatic no-show processing

This separation keeps business rules centralized and reliable.

------------------------------------------------------------------------

## 14. Database Design

MongoDB Atlas is used with Mongoose.

Main collections:

``` text
users
doctors
appointments
notifications
```

The `Notification` model references an appointment using
`appointmentId`.

This allows notifications to be linked back to the appointment that
generated them.

------------------------------------------------------------------------

## 15. Error Handling

The APIs use meaningful HTTP status codes:

``` text
200 OK
201 Created
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
```

Examples:

``` text
Invalid input
    -> 400

Appointment not found
    -> 404

Doctor scheduling conflict
    -> 409

Unexpected database/server error
    -> 500
```

------------------------------------------------------------------------

## 16. Testing Strategy

The system was tested using Postman.

### Booking

``` text
Create appointment
       |
       v
BOOKED
```

### Double Booking

``` text
Doctor:
10:00 - 10:30

Second request:
10:15 - 10:45

Expected:
409 Conflict
```

### Rescheduling

``` text
BOOKED
  |
  v
PATCH /reschedule
  |
  v
New free slot
  |
  v
BOOKED
```

### Rescheduling Conflict

``` text
Existing:
16:00 - 16:30

Reschedule request:
16:15 - 16:45

Expected:
409 Conflict
```

### Reminder

``` text
POST /api/clock
       |
       v
GET /api/outbox
       |
       v
Reminder exists
```

### No-Show

``` text
Appointment:
11:00

Clock:
11:31

Expected:
BOOKED -> NO_SHOW
```

------------------------------------------------------------------------

## 17. Important Technical Decisions

### Fixed 30-minute duration

Makes scheduling and conflict detection deterministic.

### Server-side validation

Prevents clients from bypassing important business rules.

### Interval overlap checking

Handles partial overlaps rather than only exact matching times.

### Conflict re-check during rescheduling

A new slot may conflict even when the original slot was valid, so
rescheduling must perform a fresh availability check.

### Notification outbox

Provides a simple, inspectable representation of generated reminders.

### Idempotent reminder generation

Repeated clock calls do not generate duplicate reminders.

### Simulated clock

Makes time-based functionality easy to test and suitable for automated
grading.

### Explicit appointment states

Makes appointment lifecycle transitions clear and prevents invalid state
changes.

------------------------------------------------------------------------

## 18. Known Scope Limitations

This is a focused clinic appointment MVP.

Possible production improvements include:

-   Real email/SMS notification providers
-   Background job scheduling
-   Role-based access control
-   HTTP-only authentication cookies
-   Database transactions for high-concurrency booking
-   Time-zone-aware scheduling
-   Automated unit and integration tests
-   Audit logging
-   Rate limiting
-   Production monitoring
-   Doctor availability calendars

------------------------------------------------------------------------

## 19. Requirement Mapping

  Requirement                 Implementation
  --------------------------- ---------------------------------------------
  Doctor management           `/api/doctors`
  Appointment booking         `POST /api/appointments`
  Double-booking prevention   Server-side interval overlap check
  Search                      `?search=`
  Pagination                  `?page=&limit=`
  Sorting                     `?sort=&order=`
  Cancellation                `PATCH /cancel`
  Cancellation fee            ₹0 / ₹100 rule
  T6 Reschedule               `PATCH /reschedule`
  T6 Conflict re-check        Overlap validation during reschedule
  T1 Morning reminders        `POST /api/clock`
  T1 Notification outbox      `GET /api/outbox`
  Duplicate reminders         Existing notification check
  T2 Automatic no-show        `/api/clock`
  30-minute rule              Time-based state transition
  Completed protection        Only `BOOKED` appointments become `NO_SHOW`

------------------------------------------------------------------------

## 20. Final Architecture

``` text
                 Next.js / React UI
                         |
                         v
                 Next.js REST APIs
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
    Authentication   Appointments   Automation
                                    /clock /outbox
          |              |              |
          +--------------+--------------+
                         |
                         v
                    Mongoose
                         |
                         v
                   MongoDB Atlas
```

The central principle is:

> **The frontend makes the system easy to use, while the backend
> guarantees that the clinic's business rules are enforced
> consistently.**
