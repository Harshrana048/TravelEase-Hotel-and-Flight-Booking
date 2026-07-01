import { useState } from "react";
import toast from "react-hot-toast";

function HotelFormModal({ hotel, onSubmit, onClose, loading }) {
  const [formData, setFormData] = useState(
    hotel || {
      name: "",
      city: "",
      address: "",
      description: "",
      pricePerNight: "",
      roomsAvailable: "",
      rating: 4,
      amenities: [],
      images: [],
    },
  );
  const [amenityInput, setAmenityInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAmenity = () => {
    const amenity = amentityInput.trim();

    if (!amenity) return;
    if (formData.amenities.include(amenity)) return;

    setFormData({
      ...formData,
      amenities: [...formData.amenities, amenity],
    });

    setAmenityInput("");
  };

  const handleRemoveAmenity = (index) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index),
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.city ||
      !formData.pricePerNight ||
      !formData.roomsAvailable
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    onSubmit(formData);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-8 rounded shadow-lg max-w-2xl w-full mx-4 my-8">
        <h2 className="text-2xl font-bold mb-6">
          {hotel ? "Edit Hotel" : "Add New Hotel"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Hotel Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Price & Rooms */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-2">Price/Night *</label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">
                Rooms Available *
              </label>
              <input
                type="number"
                name="roomsAvailable"
                value={formData.roomsAvailable}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
              >
                {[1, 2, 3, 4, 4.5, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} ⭐
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block font-medium mb-2">Amenities</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g., WiFi, Pool, Spa"
                className="flex-1 border rounded px-4 py-2 focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="bg-primary text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded text-sm flex items-center gap-2"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(idx)}
                    className="text-primary hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-bold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : hotel ? "Update Hotel" : "Add Hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HotelFormModal;
