import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../redux/slices/authSlices";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <Link
        to="/"
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition hover:bg-white/20 sm:left-6 sm:top-6"
      >
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
        TravelEase
      </Link>

      <div className="absolute inset-0">
        <img
          src="/images/login-bg.jpg"
         alt="Travel Background" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.22),transparent_35%),linear-gradient(115deg,rgba(2,6,23,0.95),rgba(2,6,23,0.72),rgba(15,23,42,0.78))]" />
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-[1600px] items-center justify-center px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:grid-cols-[1.1fr_0.9fr]">
            <section className="hidden rounded-4xl border border-white/15 bg-slate-950/45 text-white shadow-[0_25px_80px_-20px_rgba(2,6,23,0.75)] backdrop-blur-xl md:flex md:flex-col md:justify-between md:overflow-hidden">
              <div className="relative h-full p-10">
                <div className="absolute inset-0 bg-slate-950/70" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold tracking-wide text-slate-100 backdrop-blur">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                      TravelEase Premium
                    </div>
                    <h1 className="mt-10 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                      Your next journey begins with effortless luxury.
                    </h1>
                    <p className="mt-6 max-w-xl text-sm text-slate-200/90 sm:text-base">
                      Discover premium hotel and flight booking with a modern
                      travel experience designed for the most discerning
                      explorer.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-slate-100 transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                        Fast Booking
                      </p>
                      <p className="mt-3 text-lg font-semibold">
                        Instant reservations
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-slate-100 transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                        Curated Travel
                      </p>
                      <p className="mt-3 text-lg font-semibold">
                        Tailored getaways
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-slate-100 transition duration-300 hover:-translate-y-1 hover:bg-white/15">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                        Secure checkout
                      </p>
                      <p className="mt-3 text-lg font-semibold">
                        Safe payments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex items-center justify-center">
              <div className="w-full max-w-120 rounded-4xl bg-white/95 p-8 shadow-[0_35px_90px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/80 backdrop-blur-sm sm:p-10">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    TravelEase
                  </div>
                  <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
                    Welcome back
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Sign in to continue your booking journey with premium flight
                    and hotel experiences.
                  </p>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(37,99,235,0.45)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-12px_rgba(37,99,235,0.55)] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-[#2563EB] transition hover:text-[#1E40AF]"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
