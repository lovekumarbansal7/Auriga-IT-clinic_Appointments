"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      // Save token for frontend use
      localStorage.setItem("token", data.token);

      // Save user information
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">

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
              Welcome Back
            </h1>

            <p className="mt-2 text-slate-500">
              Login to manage clinic appointments
            </p>

          </div>

          {/* Card */}
          <form
            onSubmit={handleLogin}
            className="rounded-3xl border border-white bg-white p-7 shadow-xl shadow-blue-100/50"
          >

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
                className="w-full rounded-xl border border-slate-200 p-3.5 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 p-3.5 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
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

          {/* Register */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create one
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