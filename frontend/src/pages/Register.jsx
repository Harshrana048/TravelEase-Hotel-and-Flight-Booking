import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../redux/slices/authSlices";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await dispatch(register(formData)).unwrap();
      toast.success("Registered successfully");
      navigate("/");
    } catch (err) {
      toast.error(err || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <Link
        to="/"
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white/20 sm:left-6 sm:top-6"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-emerald-300">
          <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
            <path
              d="M16 20c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v6h4c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4h-4v4c0 2.2-1.8 4-4 4H20c-2.2 0-4-1.8-4-4v-4h-2c-2.2 0-4-1.8-4-4v-8c0-2.2 1.8-4 4-4h2v-6Z"
              fill="currentColor"
            />
            <path
              d="M22 28h20"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M24 20h16"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
        TravelEase
      </Link>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.12),transparent_35%),linear-gradient(115deg,rgba(2,6,23,0.96),rgba(15,23,42,0.9),rgba(15,23,42,0.88))]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full max-w-[540px] rounded-[2rem] border border-white/20 bg-white/95 p-8 shadow-[0_35px_90px_-24px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-10 lg:p-12">
          <div className="mb-8 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-emerald-300">
                <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M16 20c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v6h4c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4h-4v4c0 2.2-1.8 4-4 4H20c-2.2 0-4-1.8-4-4v-4h-2c-2.2 0-4-1.8-4-4v-8c0-2.2 1.8-4 4-4h2v-6Z"
                    fill="currentColor"
                  />
                  <path
                    d="M22 28h20"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M24 20h16"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              TravelEase
            </div>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-[2.2rem]">
              Create your account
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-[0.95rem]">
              Join TravelEase and start planning your next premium getaway with
              ease.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-[50px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/15"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="h-[50px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/15"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-[50px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/15"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-[50px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/15"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="h-[50px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/15"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(37,99,235,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_-12px_rgba(37,99,235,0.6)] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="ml-1 font-semibold text-[#2563EB] transition hover:text-[#1E40AF]"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
