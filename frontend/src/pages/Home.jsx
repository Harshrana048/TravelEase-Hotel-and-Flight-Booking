import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to TravelEase</h1>
          <p className="text-xl mb-8">Book hotels and flights with ease</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/hotels"
              className="bg-secondary text-black px-6 py-3 rounded font-bold hover:bg-yellow-500 transition"
            >
              Browse Hotels
            </Link>
            <Link
              to="/flights"
              className="bg-white text-primary px-6 py-3 rounded font-bold hover:bg-gray-100 transition"
            >
              Search Flights
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why TravelEase?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-bold mb-4">✈ Easy Booking</h3>
              <p>Simple and quick booking process for hotels and flights.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-bold mb-4">💳 Secure Payment</h3>
              <p>Safe and secure payment gateway for all transactions.</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-bold mb-4">🎯 Best Deals</h3>
              <p>Find the best deals on hotels and flights worldwide.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}