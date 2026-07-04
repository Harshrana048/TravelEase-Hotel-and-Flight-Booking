import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updateProfile, changePassword } from "../../redux/slices/authSlices";
import { formatDate, getInitials } from "./dashboardHelpers";

export default function ProfileCard({ compact = false }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Check if the current user authenticated via Google
  // Adjust 'user?.authProvider === "google"' based on how your backend flag is named (e.g., user?.isGoogleUser)
  

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

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    try {
      await dispatch(changePassword({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword })).unwrap();
      toast.success("Password changed successfully");
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err || "Failed to change password");
    }
  };

  return (
    <section className="w-full max-w-md mx-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Top Header Block */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
        
        {/* User Info Container */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-100">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
              Profile
            </p>
            <h2 className="mt-0.5 wrap-break-word text-xl font-black text-slate-950 leading-tight">
              {user?.name || "Traveler"}
            </h2>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {user?.email || "Email not available"}
            </p>
          </div>
        </div>
        
        {/* Action Buttons Container */}
        <div className="flex gap-2 w-full">
          {/* Conditionally hide the Change Password button entirely for Google OAuth accounts */}
            
            <button
              type="button"
              onClick={() => {
                setIsChangingPassword((value) => !value);
                setIsEditing(false);
              }}
              className="flex-1 text-center rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:border-blue-200 hover:bg-slate-50 hover:text-blue-600"
            >
              {isChangingPassword ? "Cancel" : "Change Password"}
            </button>
         
          
          <button
            type="button"
            onClick={() => {
              setIsEditing((value) => !value);
              setIsChangingPassword(false);
            }}
            className="flex-1 text-center rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 transition hover:border-blue-200 hover:bg-slate-50 hover:text-blue-600"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* BLOCK 1: Profile View Mode Grid */}
      {!isEditing && !isChangingPassword && (
        <div className="mt-4 flex flex-col gap-3">
          {[
            ["Name", user?.name || "Not provided"],
            ["Email", user?.email || "Not provided"],
            ["Phone", user?.phone || "Not provided"],
            ["Member Since", formatDate(user?.createdAt)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-4 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                {label}
              </p>
              <p className="mt-1 wrap-break-word text-sm font-bold text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* BLOCK 2: Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-700">Name</span>
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
              <span className="text-xs font-bold text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-700">Phone</span>
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
            className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* BLOCK 3: Change Password Form */}
      {isChangingPassword  && (
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-700">Current Password</span>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={(event) =>
                  setPasswordData({ ...passwordData, currentPassword: event.target.value })
                }
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-700">New Password</span>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(event) =>
                  setPasswordData({ ...passwordData, newPassword: event.target.value })
                }
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-slate-700">Confirm New Password</span>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(event) =>
                  setPasswordData({ ...passwordData, confirmPassword: event.target.value })
                }
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      )}
    </section>
  );
}