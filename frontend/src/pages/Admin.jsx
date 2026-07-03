import { useState } from 'react';
import AdminLayout from '../components/Admin/AdminLayout';
import { AdminStats, HotelManagement, FlightManagement, UserManagement, BookingManagement } from '../components/index';

function Admin() {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'stats' && <AdminStats />}
      {activeTab === 'hotels' && <HotelManagement />}
      {activeTab === 'flights' && <FlightManagement />}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'bookings' && <BookingManagement />}
    </AdminLayout>
  );
}

export default Admin;
