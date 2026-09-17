import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

      {/* Navbar */}
      <nav className="border-b border-blue-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
              🏥
            </div>

            <span className="text-xl font-bold text-slate-900">
              ClinicCare
            </span>
          </Link>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">

        <div>

          <div className="mb-5 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            🩺 Simple • Secure • Conflict-Free
          </div>

          <h1 className="text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
            Healthcare
            <span className="text-blue-600"> appointments </span>
            made simple.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            ClinicCare helps front-desk staff manage doctors,
            patients and appointments while preventing
            double-booking automatically.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/dashboard"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Open Dashboard →
            </Link>

            <Link
              href="/dashboard/book"
              className="rounded-xl border border-blue-200 bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Book Appointment
            </Link>

          </div>

        </div>

        {/* Hero card */}
        <div className="relative">

          <div className="absolute inset-0 rounded-3xl bg-blue-200 blur-3xl opacity-30" />

          <div className="relative rounded-3xl border border-white bg-white p-8 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Today
                </p>

                <h2 className="text-2xl font-bold text-slate-900">
                  Clinic Schedule
                </h2>
              </div>

              <div className="rounded-xl bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
                ● Active
              </div>
            </div>

            <div className="space-y-4">

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      04:00 PM
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Rahul Sharma
                    </p>
                  </div>

                  <span className="text-blue-600">
                    🩺
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      04:30 PM
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Appointment available
                    </p>
                  </div>

                  <span className="text-green-600">
                    ✓
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-slate-900">
                      05:00 PM
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Appointment available
                    </p>
                  </div>

                  <span className="text-green-600">
                    ✓
                  </span>
                </div>
              </div>

            </div>

            <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
              ✓ Double-booking protection is enabled
            </div>

          </div>
        </div>

      </section>

      {/* Features */}
      <section className="border-t border-blue-100 bg-white py-16">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">
            <p className="font-semibold text-blue-600">
              WHY CLINICCARE
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Everything the front desk needs
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <Feature
              icon="🔒"
              title="Conflict-Free Booking"
              text="A doctor cannot be booked for two patients at the same time."
            />

            <Feature
              icon="🔍"
              title="Quick Patient Search"
              text="Find patient appointments quickly from the dashboard."
            />

            <Feature
              icon="💳"
              title="Fair Cancellation"
              text="Late cancellations can automatically apply a small fee."
            />

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-6 text-center text-sm text-slate-500">
        ClinicCare • Front Desk Appointment Management System
      </footer>

    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}