import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updateProfile } from "../../redux/slices/authSlices";

function ProfileSection() {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-primary font-medium hover:underline"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm">Name</label>
            <p className="text-lg font-semibold">{user?.name}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Email</label>
            <p className="text-lg font-semibold">{user?.email}</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Phone</label>
            <p className="text-lg font-semibold">
              {user?.phone || "Not provided"}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full border rounded px-4 py-2 bg-gray-100 cursor-not-allowed"
            />
            <p className="text-gray-600 text-sm mt-1">
              Email cannot be changed
            </p>
          </div>
          <div>
            <label className="block font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
}

export default ProfileSection;
