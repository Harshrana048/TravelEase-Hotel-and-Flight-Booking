import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ProfileSection,MyBookings,WishlistSection } from '../components/index';
import { getMyBookings } from '../redux/slices/dashboardSlice';
import { logout } from '../redux/slices/authSlices';


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const { error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };
 

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
        <p className="text-gray-600">Manage your profile, bookings, and wishlist</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded shadow mb-8">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-4 font-bold text-center transition ${
              activeTab === 'bookings'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📅 My Bookings
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex-1 py-4 font-bold text-center transition ${
              activeTab === 'wishlist'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ❤️ Wishlist
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 font-bold text-center transition ${
              activeTab === 'profile'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-4 font-bold text-center text-danger hover:text-red-700 transition"
          >
            🚪 Logout
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'bookings' && <MyBookings />}
          {activeTab === 'wishlist' && <WishlistSection />}
          {activeTab === 'profile' && <ProfileSection />}
        </div>
      </div>
    </div>
  );
    
  
}