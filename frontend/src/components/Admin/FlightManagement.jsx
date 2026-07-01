import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getFlights } from '../../redux/slices/flightSlice';
import { addFlight, updateFlight, deleteFlight } from '../../redux/slices/adminSlice';

function FlightManagement() {

     const dispatch = useDispatch();
  const { flights, loading } = useSelector((state) => state.flights);
  const adminLoading = useSelector((state) => state.admin.loading);
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    availableSeats: '',
    class: 'Economy',
  });

  useEffect(() => {
    dispatch(getFlights({ page: 1, limit: 100 }));
  }, [dispatch]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const initialFlightForm = {
  flightNumber: "",
  airline: "",
  source: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  price: "",
  availableSeats: "",
  class: "Economy",
};

const handleAdd = () => {
  setEditingFlight(null);
  setFormData(initialFlightForm);
  setShowModal(true);
};

 const handleEdit = (flight) => {
    setEditingFlight(flight);
    setFormData(flight);
    setShowModal(true);
  };

  const handleDelete = async (flightId) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await dispatch(deleteFlight(flightId)).unwrap();
        toast.success('Flight deleted successfully');
      } catch (err) {
        toast.error(err || 'Failed to delete flight');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.flightNumber || !formData.airline || !formData.source || !formData.destination) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingFlight) {
        await dispatch(updateFlight({ flightId: editingFlight._id, flightData: formData })).unwrap();
        toast.success('Flight updated successfully');
      } else {
        await dispatch(addFlight(formData)).unwrap();
        toast.success('Flight added successfully');
      }
      setShowModal(false);
      dispatch(getFlights({ page: 1, limit: 100 }));
    } catch (err) {
      toast.error(err || 'Failed to save flight');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
    return (
        <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">✈ Flight Management</h2>
        <button
          onClick={handleAdd}
          className="bg-success text-white px-4 py-2 rounded font-bold hover:bg-green-700"
        >
          + Add Flight
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-bold">Flight</th>
              <th className="px-6 py-3 text-left font-bold">Route</th>
              <th className="px-6 py-3 text-left font-bold">Departure</th>
              <th className="px-6 py-3 text-left font-bold">Price</th>
              <th className="px-6 py-3 text-left font-bold">Seats</th>
              <th className="px-6 py-3 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{flight.flightNumber} ({flight.airline})</td>
                <td className="px-6 py-4">{flight.source} → {flight.destination}</td>
                <td className="px-6 py-4">{new Date(flight.departureTime).toLocaleString()}</td>
                <td className="px-6 py-4">₹{flight.price}</td>
                <td className="px-6 py-4">{flight.availableSeats}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit(flight)}
                    className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(flight._id)}
                    className="bg-danger text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">{editingFlight ? 'Edit Flight' : 'Add New Flight'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Flight Number *</label>
                  <input
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Airline *</label>
                  <input
                    type="text"
                    name="airline"
                    value={formData.airline}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Source *</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Destination *</label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Departure Time *</label>
                  <input
                    type="datetime-local"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Arrival Time *</label>
                  <input
                    type="datetime-local"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-2">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Available Seats *</label>
                  <input
                    type="number"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Class</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className="w-full border rounded px-4 py-2 focus:outline-none focus:border-primary"
                  >
                    <option>Economy</option>
                    <option>Business</option>
                    <option>First</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-bold hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="flex-1 bg-primary text-white py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {adminLoading ? 'Saving...' : editingFlight ? 'Update Flight' : 'Add Flight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
        
    );
}

export default FlightManagement
