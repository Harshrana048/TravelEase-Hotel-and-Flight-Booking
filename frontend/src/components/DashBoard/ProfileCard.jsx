import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updateProfile } from "../../redux/slices/authSlices";
import { formatDate, getInitials } from "./dashboardHelpers";

export default function ProfileCard({ compact = false }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-blue-600 text-2xl font-black text-white shadow-lg shadow-blue-100">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-600">
              Profile
            </p>
            <h2 className="mt-1 truncate text-2xl font-black text-slate-950">
              {user?.name || "Traveler"}
            </h2>
            <p className="mt-1 truncate text-sm text-slate-500">
              {user?.email || "Email not available"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing((value) => !value)}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {!isEditing ? (
        <div
          className={`mt-6 grid gap-4 ${
            compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
          }`}
        >
          {[
            ["Name", user?.name || "Not provided"],
            ["Email", user?.email || "Not provided"],
            ["Phone", user?.phone || "Not provided"],
            ["Member Since", formatDate(user?.createdAt)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {label}
              </p>
              <p className="mt-2 wrap-break-word text-sm font-bold text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-slate-700">Phone</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(event) =>
                  setFormData({ ...formData, phone: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </label>
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      )}
    </section>
  );
}
