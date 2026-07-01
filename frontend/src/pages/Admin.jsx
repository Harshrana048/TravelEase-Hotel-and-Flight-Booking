import { useState } from 'react';
import { AdminStats ,  HotelManagement ,FlightManagement ,UserManagement,BookingManagement} from '../components/index';



function Admin() {
    const [activeTab, setActiveTab] = useState('stats');

    const tabs = [
    { id: 'stats', label: '📊 Stats', icon: '📊' },
    { id: 'hotels', label: '🏨 Hotels', icon: '🏨' },
    { id: 'flights', label: '✈ Flights', icon: '✈' },
    { id: 'users', label: '👥 Users', icon: '👥' },
    { id: 'bookings', label: '📅 Bookings', icon: '📅' },
  ];
    return (
        <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

      {/* Tabs */}
      <div className="bg-white rounded shadow mb-8">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 font-bold text-center transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'stats' && <AdminStats />}
          {activeTab === 'hotels' && <HotelManagement />}
          {activeTab === 'flights' && <FlightManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'bookings' && <BookingManagement />}
        </div>
      </div>
    </div>
  );

}

export default Admin
