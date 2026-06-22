/**
 * Safe Flight Seeder for TravelEase
 * -----------------------------------
 * - Adds 25 realistic flights across major Indian routes
 * - SAFE TO RUN MULTIPLE TIMES — only inserts flights that
 *   don't already exist (checked by flightNumber)
 * - NEVER deletes existing data
 *
 * Run with: node utils/seedFlight.js
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Flight = require('../models/Flight.model');

// Helper: build a departure Date object N days from now at given hour
const futureDate = (daysFromNow, hour, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

const seedFlights = [
  // ---------------- DELHI <-> MUMBAI ----------------
  {
    flightNumber: 'AI-101', airline: 'Air India', source: 'Delhi', destination: 'Mumbai',
    departureTime: futureDate(1, 6, 0), arrivalTime: addMinutes(futureDate(1, 6, 0), 130),
    availableSeats: 45, totalSeats: 180, price: 4500, class: 'Economy',
  },
  {
    flightNumber: '6E-203', airline: 'IndiGo', source: 'Delhi', destination: 'Mumbai',
    departureTime: futureDate(1, 9, 30), arrivalTime: addMinutes(futureDate(1, 9, 30), 125),
    availableSeats: 60, totalSeats: 180, price: 3800, class: 'Economy',
  },
  {
    flightNumber: 'UK-955', airline: 'Vistara', source: 'Mumbai', destination: 'Delhi',
    departureTime: futureDate(1, 14, 0), arrivalTime: addMinutes(futureDate(1, 14, 0), 130),
    availableSeats: 12, totalSeats: 150, price: 6200, class: 'Business',
  },
  {
    flightNumber: 'SG-411', airline: 'SpiceJet', source: 'Mumbai', destination: 'Delhi',
    departureTime: futureDate(2, 18, 45), arrivalTime: addMinutes(futureDate(2, 18, 45), 135),
    availableSeats: 50, totalSeats: 180, price: 4100, class: 'Economy',
  },

  // ---------------- DELHI <-> BANGALORE ----------------
  {
    flightNumber: 'AI-505', airline: 'Air India', source: 'Delhi', destination: 'Bangalore',
    departureTime: futureDate(1, 7, 15), arrivalTime: addMinutes(futureDate(1, 7, 15), 165),
    availableSeats: 38, totalSeats: 180, price: 5200, class: 'Economy',
  },
  {
    flightNumber: '6E-678', airline: 'IndiGo', source: 'Bangalore', destination: 'Delhi',
    departureTime: futureDate(2, 11, 0), arrivalTime: addMinutes(futureDate(2, 11, 0), 170),
    availableSeats: 55, totalSeats: 180, price: 4900, class: 'Economy',
  },
  {
    flightNumber: 'UK-810', airline: 'Vistara', source: 'Delhi', destination: 'Bangalore',
    departureTime: futureDate(3, 20, 0), arrivalTime: addMinutes(futureDate(3, 20, 0), 160),
    availableSeats: 8, totalSeats: 150, price: 7800, class: 'Business',
  },

  // ---------------- MUMBAI <-> GOA ----------------
  {
    flightNumber: '6E-302', airline: 'IndiGo', source: 'Mumbai', destination: 'Goa',
    departureTime: futureDate(1, 8, 0), arrivalTime: addMinutes(futureDate(1, 8, 0), 75),
    availableSeats: 65, totalSeats: 180, price: 2900, class: 'Economy',
  },
  {
    flightNumber: 'SG-220', airline: 'SpiceJet', source: 'Goa', destination: 'Mumbai',
    departureTime: futureDate(1, 16, 30), arrivalTime: addMinutes(futureDate(1, 16, 30), 75),
    availableSeats: 42, totalSeats: 180, price: 2700, class: 'Economy',
  },
  {
    flightNumber: 'AI-660', airline: 'Air India', source: 'Mumbai', destination: 'Goa',
    departureTime: futureDate(4, 10, 0), arrivalTime: addMinutes(futureDate(4, 10, 0), 80),
    availableSeats: 30, totalSeats: 180, price: 3100, class: 'Economy',
  },

  // ---------------- DELHI <-> JAIPUR ----------------
  {
    flightNumber: '6E-115', airline: 'IndiGo', source: 'Delhi', destination: 'Jaipur',
    departureTime: futureDate(1, 12, 0), arrivalTime: addMinutes(futureDate(1, 12, 0), 60),
    availableSeats: 48, totalSeats: 180, price: 2400, class: 'Economy',
  },
  {
    flightNumber: 'AI-770', airline: 'Air India', source: 'Jaipur', destination: 'Delhi',
    departureTime: futureDate(2, 17, 0), arrivalTime: addMinutes(futureDate(2, 17, 0), 60),
    availableSeats: 35, totalSeats: 180, price: 2600, class: 'Economy',
  },

  // ---------------- MUMBAI <-> BANGALORE ----------------
  {
    flightNumber: '6E-890', airline: 'IndiGo', source: 'Mumbai', destination: 'Bangalore',
    departureTime: futureDate(1, 6, 45), arrivalTime: addMinutes(futureDate(1, 6, 45), 95),
    availableSeats: 58, totalSeats: 180, price: 3500, class: 'Economy',
  },
  {
    flightNumber: 'UK-303', airline: 'Vistara', source: 'Bangalore', destination: 'Mumbai',
    departureTime: futureDate(2, 19, 30), arrivalTime: addMinutes(futureDate(2, 19, 30), 95),
    availableSeats: 15, totalSeats: 150, price: 5900, class: 'Business',
  },
  {
    flightNumber: 'SG-540', airline: 'SpiceJet', source: 'Mumbai', destination: 'Bangalore',
    departureTime: futureDate(3, 13, 0), arrivalTime: addMinutes(futureDate(3, 13, 0), 100),
    availableSeats: 40, totalSeats: 180, price: 3300, class: 'Economy',
  },

  // ---------------- DELHI <-> KOLKATA ----------------
  {
    flightNumber: 'AI-220', airline: 'Air India', source: 'Delhi', destination: 'Kolkata',
    departureTime: futureDate(1, 9, 0), arrivalTime: addMinutes(futureDate(1, 9, 0), 140),
    availableSeats: 44, totalSeats: 180, price: 4700, class: 'Economy',
  },
  {
    flightNumber: '6E-451', airline: 'IndiGo', source: 'Kolkata', destination: 'Delhi',
    departureTime: futureDate(2, 15, 30), arrivalTime: addMinutes(futureDate(2, 15, 30), 145),
    availableSeats: 52, totalSeats: 180, price: 4300, class: 'Economy',
  },

  // ---------------- CHENNAI <-> HYDERABAD ----------------
  {
    flightNumber: '6E-512', airline: 'IndiGo', source: 'Chennai', destination: 'Hyderabad',
    departureTime: futureDate(1, 7, 0), arrivalTime: addMinutes(futureDate(1, 7, 0), 70),
    availableSeats: 50, totalSeats: 180, price: 2800, class: 'Economy',
  },
  {
    flightNumber: 'SG-633', airline: 'SpiceJet', source: 'Hyderabad', destination: 'Chennai',
    departureTime: futureDate(2, 18, 0), arrivalTime: addMinutes(futureDate(2, 18, 0), 70),
    availableSeats: 33, totalSeats: 180, price: 2600, class: 'Economy',
  },

  // ---------------- DELHI <-> UDAIPUR ----------------
  {
    flightNumber: 'AI-340', airline: 'Air India', source: 'Delhi', destination: 'Udaipur',
    departureTime: futureDate(3, 11, 30), arrivalTime: addMinutes(futureDate(3, 11, 30), 75),
    availableSeats: 28, totalSeats: 150, price: 3900, class: 'Economy',
  },

  // ---------------- MUMBAI <-> KOCHI ----------------
  {
    flightNumber: '6E-720', airline: 'IndiGo', source: 'Mumbai', destination: 'Kochi',
    departureTime: futureDate(2, 8, 30), arrivalTime: addMinutes(futureDate(2, 8, 30), 105),
    availableSeats: 47, totalSeats: 180, price: 4200, class: 'Economy',
  },
  {
    flightNumber: 'UK-415', airline: 'Vistara', source: 'Kochi', destination: 'Mumbai',
    departureTime: futureDate(3, 20, 15), arrivalTime: addMinutes(futureDate(3, 20, 15), 105),
    availableSeats: 10, totalSeats: 150, price: 6800, class: 'Business',
  },

  // ---------------- DELHI <-> PUNE ----------------
  {
    flightNumber: '6E-588', airline: 'IndiGo', source: 'Delhi', destination: 'Pune',
    departureTime: futureDate(1, 16, 0), arrivalTime: addMinutes(futureDate(1, 16, 0), 130),
    availableSeats: 0, totalSeats: 180, price: 4400, class: 'Economy', // sold out — tests filter
  },
  {
    flightNumber: 'SG-712', airline: 'SpiceJet', source: 'Pune', destination: 'Delhi',
    departureTime: futureDate(4, 6, 30), arrivalTime: addMinutes(futureDate(4, 6, 30), 130),
    availableSeats: 36, totalSeats: 180, price: 4600, class: 'Economy',
  },

  // ---------------- BANGALORE <-> KOLKATA ----------------
  {
    flightNumber: 'AI-880', airline: 'Air India', source: 'Bangalore', destination: 'Kolkata',
    departureTime: futureDate(2, 10, 45), arrivalTime: addMinutes(futureDate(2, 10, 45), 155),
    availableSeats: 41, totalSeats: 180, price: 5400, class: 'Economy',
  },
];

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    let added = 0;
    let skipped = 0;

    for (const flightData of seedFlights) {
      const exists = await Flight.findOne({ flightNumber: flightData.flightNumber });

      if (exists) {
        skipped++;
        continue;
      }

      await Flight.create(flightData);
      added++;
    }

    console.log(`\n✈️  Seeding complete!`);
    console.log(`   ✅ Added:   ${added} new flights`);
    console.log(`   ⏭️  Skipped: ${skipped} flights (already existed)`);
    console.log(`\nSafe to run this script again anytime.\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

runSeed();