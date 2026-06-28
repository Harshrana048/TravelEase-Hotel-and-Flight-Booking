import React from 'react'

function Footer() {
    return (
         <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">✈ TravelEase</h3>
            <p>Your trusted travel booking platform.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/hotels" className="hover:text-white">Hotels</a></li>
              <li><a href="/flights" className="hover:text-white">Flights</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <p>Email: Harsh@travelease.com</p>
            <p>Phone: +91-6354594431</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; 2026 TravelEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer
