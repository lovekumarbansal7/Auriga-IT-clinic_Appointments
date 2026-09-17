"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [order, setOrder] = useState("asc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch appointments and doctors
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const appointmentRes = await fetch(
        `/api/appointments?search=${encodeURIComponent(
          search
        )}&page=${page}&limit=5&sort=startTime&order=${order}`
      );

      if (!appointmentRes.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const appointmentData = await appointmentRes.json();

      setAppointments(appointmentData.appointments || []);
      setTotalPages(appointmentData.pagination?.totalPages || 1);

      const doctorRes = await fetch("/api/doctors");

      if (!doctorRes.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const doctorData = await doctorRes.json();
      setDoctors(doctorData || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, page, order]);

  // Reset page when searching
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Cancel appointment
  const cancelAppointment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/appointments/${id}/cancel`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to cancel appointment");
        return;
      }

      alert(
        `Appointment cancelled successfully.\nCancellation fee: ₹${data.cancellationFee}`
      );

      loadData();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while cancelling the appointment.");
    }
  };

  // Format date and time
  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Dashboard statistics
  const totalAppointments = appointments.length;

  const bookedAppointments = appointments.filter(
    (appointment) => appointment.status === "BOOKED"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  ).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navbar */}
      <nav className="border-b bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
              🏥
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                ClinicCare
              </h1>
              <p className="text-xs text-gray-500">
                Healthcare Appointment System
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/book"
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            + Book Appointment
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 font-semibold text-blue-600">
            PATIENT DASHBOARD
          </p>

          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to ClinicCare 👋
          </h2>

          <p className="mt-2 text-gray-600">
            Manage your appointments and find available doctors easily.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Appointments */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📅
              </div>

              <span className="text-sm font-medium text-gray-500">
                Total
              </span>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {totalAppointments}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Appointments
            </p>
          </div>

          {/* Booked */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                ✓
              </div>

              <span className="text-sm font-medium text-gray-500">
                Active
              </span>
            </div>

            <p className="text-3xl font-bold text-green-600">
              {bookedAppointments}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Booked
            </p>
          </div>

          {/* Cancelled */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                ✕
              </div>

              <span className="text-sm font-medium text-gray-500">
                Cancelled
              </span>
            </div>

            <p className="text-3xl font-bold text-red-600">
              {cancelledAppointments}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Cancelled
            </p>
          </div>

          {/* Doctors */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-2xl">
                👨‍⚕️
              </div>

              <span className="text-sm font-medium text-gray-500">
                Available
              </span>
            </div>

            <p className="text-3xl font-bold text-cyan-600">
              {doctors.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Doctors
            </p>
          </div>
        </div>

        {/* Appointment Section */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          {/* Section Header */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Your Appointments
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Search, sort and manage your appointments.
              </p>
            </div>

            <Link
              href="/dashboard/book"
              className="w-fit rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Book New Appointment
            </Link>
          </div>

          {/* Search + Sort */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by patient name..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Sorting */}
            <select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="asc">Date: Oldest First</option>
              <option value="desc">Date: Newest First</option>
            </select>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

              <p className="text-gray-500">
                Loading appointments...
              </p>
            </div>
          ) : appointments.length === 0 ? (
            /* Empty State */
            <div className="rounded-xl bg-gray-50 py-16 text-center">
              <div className="mb-4 text-5xl">📅</div>

              <h4 className="text-xl font-semibold text-gray-800">
                No appointments found
              </h4>

              <p className="mt-2 text-gray-500">
                {search
                  ? "Try a different search term."
                  : "You don't have any appointments yet."}
              </p>

              {!search && (
                <Link
                  href="/dashboard/book"
                  className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Book Your First Appointment
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Appointment Cards */}
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-5 transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* Patient + Doctor */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl">
                          👤
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {appointment.patientName}
                          </h4>

                          <p className="mt-1 font-medium text-blue-600">
                            {appointment.doctorId?.name ||
                              "Doctor unavailable"}
                          </p>

                          <p className="text-sm text-gray-500">
                            {appointment.doctorId?.specialization ||
                              "Specialization unavailable"}
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Appointment Time
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                          {formatDateTime(appointment.startTime)}
                        </p>

                        <p className="text-xs text-gray-500">
                          30 minute appointment
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <p
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                            appointment.status === "BOOKED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {appointment.status}
                        </p>
                      </div>

                      {/* Cancel Button */}
                      {appointment.status === "BOOKED" && (
                        <button
                          onClick={() =>
                            cancelAppointment(appointment._id)
                          }
                          className="rounded-xl border border-red-200 bg-white px-4 py-2.5 font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    {/* Cancellation Fee */}
                    {appointment.status === "CANCELLED" &&
                      appointment.cancellationFee !== undefined && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                          Cancellation Fee:{" "}
                          <strong>
                            ₹{appointment.cancellationFee}
                          </strong>
                        </div>
                      )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  <span className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">
                    {page}
                  </span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Doctors Section */}
        <div className="mt-8">
          <div className="mb-5">
            <h3 className="text-2xl font-bold text-gray-900">
              Our Doctors
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Choose from our available healthcare specialists.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                  👨‍⚕️
                </div>

                <h4 className="text-lg font-bold text-gray-900">
                  {doctor.name}
                </h4>

                <p className="mt-1 text-blue-600">
                  {doctor.specialization}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-green-600">
                    ● Available
                  </span>

                  <Link
                    href="/dashboard/book"
                    className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pb-6 text-center text-sm text-gray-500">
          <p>© 2026 ClinicCare. Healthcare Appointment Management System.</p>
        </div>
      </div>
    </main>
  );
}