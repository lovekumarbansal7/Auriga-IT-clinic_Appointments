"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Registration successful! Redirecting...");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">

        <div className="w-full">

          {/* Logo */}
          <div className="mb-8 text-center">

            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-200">
                🏥
              </div>

              <span className="text-2xl font-bold text-slate-900">
                ClinicCare
              </span>
            </Link>

            <h1 className="mt-8 text-3xl font-bold text-slate-900">
              Create Account
            </h1>

            <p className="mt-2 text-slate-500">
              Register to manage clinic appointments
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="rounded-3xl border border-white bg-white p-7 shadow-xl shadow-blue-100/50"
          >

            {/* Name */}
            <div className="mb-5">

              <label className="mb-2 block font-semibold text-slate-800">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-200 p-3.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Email */}
            <div className="mb-5">

              <label className="mb-2 block font-semibold text-slate-800">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 p-3.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Password */}
            <div className="mb-6">

              <label className="mb-2 block font-semibold text-slate-800">
                Password
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-200 p-3.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            {/* Message */}
            {message && (
              <div
                className={`mt-4 rounded-xl p-3 text-center text-sm font-medium ${
                  message.toLowerCase().includes("successful")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message}
              </div>
            )}

          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-blue-600"
            >
              ← Back to home
            </Link>
          </div>

        </div>

      </div>

    </main>
  );
}