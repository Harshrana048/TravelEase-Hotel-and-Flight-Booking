import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getHotels } from '../../redux/slices/hotelSlice';
import { addHotel,updateHotel,deleteHotel } from '../../redux/slices/adminSlice';
import HotelFormModal from './HotelFormModal';


function HotelMangement() {
    const dispatch =  useDispatch();
    const {hotels , loading} = useSelector((state) => state.hotels);
   const adminLoading = useSelector((state) => state.admin.loading);
   const [showModal , setShowModal] = useState(false);
   const [editingHotel, setEditingHotel] = useState(null);


   useEffect(() => {
    dispatch(getHotels({ page: 1, limit: 100 }));
   },[dispatch]);

   const handleAdd = () => {
    setEditingHotel(null);
    setShowModal(true);
  };
    const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setShowModal(true);
  };

  const handleDelete = async(hotelId) => {
    if(window.confirm('Are you sure you want to delete this hotel?')){
    try {
        await dispatch(deleteHotel(hotelId)).unwrap();
          toast.success('Hotel deleted successfully');
        
    } catch (error) {
        toast.error(error || 'Failed to delete hotel');
        
    }
  }
}

const handleSubmit = async (formData) => {
    try{
    if(editingHotel){
        await dispatch(updateHotel({hotelId:editingHotel._id , hotelData:formData})).unwrap();
        toast.success('Hotel updated successfully');
    }else{
        await dispatch(addHotel( formData)).unwrap();
        toast.success('Hotel added successfully');
    }
    setShowModal(false);
    dispatch(getHotels(({ page: 1, limit: 100 })));
}
catch (err) {
      toast.error(err || 'Failed to save hotel');
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
        <h2 className="text-2xl font-bold">🏨 Hotel Management</h2>
        <button
          onClick={handleAdd}
          className="bg-success text-white px-4 py-2 rounded font-bold hover:bg-green-700"
        >
          + Add Hotel
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-bold">Name</th>
              <th className="px-6 py-3 text-left font-bold">City</th>
              <th className="px-6 py-3 text-left font-bold">Price</th>
              <th className="px-6 py-3 text-left font-bold">Rooms</th>
              <th className="px-6 py-3 text-left font-bold">Rating</th>
              <th className="px-6 py-3 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{hotel.name}</td>
                <td className="px-6 py-4">{hotel.city}</td>
                <td className="px-6 py-4">₹{hotel.pricePerNight}</td>
                <td className="px-6 py-4">{hotel.roomsAvailable}</td>
                <td className="px-6 py-4">⭐ {hotel.rating}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit(hotel)}
                    className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
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
        <HotelFormModal
          hotel={editingHotel}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          loading={adminLoading}
        />
      )}
    </div>

    );
}

export default HotelMangement
