"use client";

import { useEffect, useState } from "react";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getDoctors() {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error(error);
      }
    }

    getDoctors();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName,
          doctorId,
          startTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Booking failed");
        return;
      }

      setMessage("Appointment booked successfully!");

      setPatientName("");
      setDoctorId("");
      setStartTime("");
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* Decorative background */}
      <div className="pointer-events-none fixed left-0 top-0 h-72 w-72 rounded-full bg-blue-100 opacity-50 blur-3xl" />
      <div className="pointer-events-none fixed right-0 top-40 h-80 w-80 rounded-full bg-cyan-100 opacity-50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-10">

        {/* Back */}
        <a
          href="/dashboard"
          className="font-medium text-blue-600 transition hover:text-blue-800"
        >
          ← Back to Dashboard
        </a>

        {/* Heading */}
        <div className="mt-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Clinic Appointment
          </p>

          <h1 className="text-4xl font-bold text-slate-900">
            Book Appointment
          </h1>

          <p className="mt-2 text-lg text-slate-600">
            Schedule a patient appointment with a doctor.
          </p>
        </div>

        {/* Main layout */}
        <div className="mt-10 grid gap-10 lg:grid-cols-3">

          {/* Left information */}
          <div className="hidden lg:block lg:pt-12">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
              🏥
            </div>

            <h2 className="text-3xl font-bold leading-tight text-slate-900">
              Better Health
              <br />
              Brighter Tomorrow
            </h2>

            <div className="my-5 h-1 w-12 rounded bg-blue-600" />

            <p className="max-w-xs text-lg leading-8 text-slate-600">
              Your health is our priority. Book appointments easily and
              manage your visits.
            </p>

            <div className="mt-8 rounded-2xl bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="font-semibold text-slate-800">
                🕐 30 minute appointments
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Quick and convenient scheduling for every patient.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white bg-white p-6 shadow-xl shadow-blue-100/50 md:p-8"
            >

              {/* Patient */}
              <div className="mb-6">
                <label className="mb-2 block font-semibold text-slate-800">
                  Patient Name
                </label>

                <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <div className="flex w-14 items-center justify-center bg-blue-50 text-xl">
                    👤
                  </div>

                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    className="w-full border-0 p-4 text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Doctor */}
              <div className="mb-6">
                <label className="mb-2 block font-semibold text-slate-800">
                  Doctor
                </label>

                <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <div className="flex w-14 items-center justify-center bg-emerald-50 text-xl">
                    🩺
                  </div>

                  <select
                    required
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full bg-white p-4 text-slate-700 outline-none"
                  >
                    <option value="">Select doctor</option>

                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name} — {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointment time */}
              <div className="mb-4">
                <label className="mb-2 block font-semibold text-slate-800">
                  Appointment Time
                </label>

                <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <div className="flex w-14 items-center justify-center bg-purple-50 text-xl">
                    📅
                  </div>

                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-4 text-slate-700 outline-none"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="mb-7 flex items-center gap-2 text-slate-600">
                <span>◷</span>
                <span className="text-sm">
                  Appointment duration: 30 minutes
                </span>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Booking..." : "📅  Book Appointment"}
              </button>

              {/* Message */}
              {message && (
                <div
                  className={`mt-5 rounded-xl p-4 font-medium ${
                    message.toLowerCase().includes("success")
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

            </form>

            {/* Right-side small info */}
            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
              <span>🔒</span>
              <span>Your appointment information is securely stored.</span>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}