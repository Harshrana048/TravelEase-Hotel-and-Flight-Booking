/**
 * Safe Hotel Seeder for TravelEase
 * -----------------------------------
 * - Adds 30 realistic hotels across major Indian cities
 * - Uses real Unsplash photo URLs (no API key needed)
 * - SAFE TO RUN MULTIPLE TIMES — only inserts hotels that
 *   don't already exist (checked by name + city)
 * - NEVER deletes existing data, so admin-added hotels
 *   and bookings are never affected
 *
 * Run with: node utils/seedHotels.js
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Hotel = require('../models/hotel.model');

const seedHotels = [
  // ---------------- MUMBAI ----------------
  {
    name: 'Taj Mahal Palace Suites',
    city: 'Mumbai',
    address: 'Apollo Bunder, Colaba, Mumbai',
    description: 'Iconic luxury hotel overlooking the Gateway of India with world-class dining and spa facilities.',
    pricePerNight: 12000,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    ],
    amenities: ['wifi', 'pool', 'parking', 'breakfast', 'spa', 'gym'],
    roomsAvailable: 12,
  },
  {
    name: 'Sea Breeze Residency',
    city: 'Mumbai',
    address: 'Marine Drive, Mumbai',
    description: 'Modern business hotel with stunning sea views, walking distance from Marine Drive.',
    pricePerNight: 6500,
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    ],
    amenities: ['wifi', 'breakfast', 'parking', 'gym'],
    roomsAvailable: 18,
  },
  {
    name: 'Andheri Comfort Inn',
    city: 'Mumbai',
    address: 'Andheri East, Mumbai',
    description: 'Budget-friendly hotel close to the airport, ideal for business travelers.',
    pricePerNight: 2800,
    rating: 3.9,
    images: [
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    ],
    amenities: ['wifi', 'parking'],
    roomsAvailable: 25,
  },

  // ---------------- DELHI ----------------
  {
    name: 'Imperial Heritage Hotel',
    city: 'Delhi',
    address: 'Connaught Place, New Delhi',
    description: 'Elegant heritage property in the heart of New Delhi with classic colonial architecture.',
    pricePerNight: 9500,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800',
    ],
    amenities: ['wifi', 'pool', 'breakfast', 'spa', 'parking'],
    roomsAvailable: 15,
  },
  {
    name: 'Capital Business Suites',
    city: 'Delhi',
    address: 'Aerocity, New Delhi',
    description: 'Contemporary hotel near IGI Airport, perfect for quick business stopovers.',
    pricePerNight: 5800,
    rating: 4.2,
    images: [
      'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    ],
    amenities: ['wifi', 'gym', 'breakfast', 'parking'],
    roomsAvailable: 20,
  },
  {
    name: 'Paharganj Backpacker Lodge',
    city: 'Delhi',
    address: 'Paharganj, New Delhi',
    description: 'Affordable stay for backpackers and budget travelers near New Delhi Railway Station.',
    pricePerNight: 1500,
    rating: 3.6,
    images: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
    ],
    amenities: ['wifi'],
    roomsAvailable: 30,
  },

  // ---------------- GOA ----------------
  {
    name: 'Beachside Paradise Resort',
    city: 'Goa',
    address: 'Calangute Beach, North Goa',
    description: 'Beachfront resort with private access to Calangute Beach and vibrant nightlife nearby.',
    pricePerNight: 8500,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    ],
    amenities: ['wifi', 'pool', 'breakfast', 'bar', 'parking'],
    roomsAvailable: 14,
  },
  {
    name: 'Palm Grove Cottages',
    city: 'Goa',
    address: 'Anjuna, North Goa',
    description: 'Charming cottages surrounded by palm trees, close to Anjuna flea market.',
    pricePerNight: 4200,
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=800',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    ],
    amenities: ['wifi', 'pool', 'parking'],
    roomsAvailable: 16,
  },
  {
    name: 'South Goa Serenity Villas',
    city: 'Goa',
    address: 'Palolem Beach, South Goa',
    description: 'Peaceful villas away from the crowd, perfect for a relaxing beach getaway.',
    pricePerNight: 6000,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    ],
    amenities: ['wifi', 'breakfast', 'pool'],
    roomsAvailable: 10,
  },

  // ---------------- BANGALORE ----------------
  {
    name: 'Garden City Grand',
    city: 'Bangalore',
    address: 'MG Road, Bangalore',
    description: 'Upscale hotel in the heart of the city, close to shopping and tech parks.',
    pricePerNight: 7200,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1582719478141-cb2bc3a9d2a3?w=800',
      'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800',
    ],
    amenities: ['wifi', 'pool', 'gym', 'breakfast', 'spa'],
    roomsAvailable: 22,
  },
  {
    name: 'Whitefield Tech Stay',
    city: 'Bangalore',
    address: 'Whitefield, Bangalore',
    description: 'Modern hotel catering to IT professionals, near major tech campuses.',
    pricePerNight: 4500,
    rating: 4.1,
    images: [
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800',
      'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=800',
    ],
    amenities: ['wifi', 'gym', 'breakfast'],
    roomsAvailable: 28,
  },
  {
    name: 'Koramangala Budget Stay',
    city: 'Bangalore',
    address: 'Koramangala, Bangalore',
    description: 'Affordable accommodation in a trendy neighborhood full of cafes and pubs.',
    pricePerNight: 2200,
    rating: 3.8,
    images: [
      'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
    ],
    amenities: ['wifi', 'parking'],
    roomsAvailable: 20,
  },

  // ---------------- JAIPUR ----------------
  {
    name: 'Royal Rajwada Palace',
    city: 'Jaipur',
    address: 'Amer Road, Jaipur',
    description: 'Heritage palace hotel offering a royal Rajasthani experience with traditional architecture.',
    pricePerNight: 10500,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
    ],
    amenities: ['wifi', 'pool', 'spa', 'breakfast', 'parking'],
    roomsAvailable: 8,
  },
  {
    name: 'Pink City Heritage Inn',
    city: 'Jaipur',
    address: 'Johari Bazaar, Jaipur',
    description: 'Boutique hotel near Hawa Mahal with authentic Rajasthani decor and hospitality.',
    pricePerNight: 5200,
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800',
    ],
    amenities: ['wifi', 'breakfast', 'parking'],
    roomsAvailable: 16,
  },
  {
    name: 'Desert Rose Guesthouse',
    city: 'Jaipur',
    address: 'Bani Park, Jaipur',
    description: 'Cozy guesthouse with rooftop dining and warm, personalized service.',
    pricePerNight: 1800,
    rating: 4.0,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
    ],
    amenities: ['wifi', 'breakfast'],
    roomsAvailable: 12,
  },

  // ---------------- KOLKATA ----------------
  {
    name: 'Victoria Grand Hotel',
    city: 'Kolkata',
    address: 'Park Street, Kolkata',
    description: 'Classic colonial-era hotel near Victoria Memorial with old-world charm.',
    pricePerNight: 6800,
    rating: 4.4,
    images: [
      'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    ],
    amenities: ['wifi', 'breakfast', 'parking', 'bar'],
    roomsAvailable: 14,
  },
  {
    name: 'Salt Lake Business Hotel',
    city: 'Kolkata',
    address: 'Salt Lake City, Kolkata',
    description: 'Modern hotel in the IT hub of Kolkata, ideal for corporate travelers.',
    pricePerNight: 4000,
    rating: 4.0,
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800',
    ],
    amenities: ['wifi', 'gym', 'breakfast'],
    roomsAvailable: 18,
  },

  // ---------------- CHENNAI ----------------
  {
    name: 'Marina Bay View Hotel',
    city: 'Chennai',
    address: 'Marina Beach Road, Chennai',
    description: 'Coastal hotel with panoramic views of Marina Beach and South Indian hospitality.',
    pricePerNight: 5600,
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    ],
    amenities: ['wifi', 'pool', 'breakfast', 'parking'],
    roomsAvailable: 20,
  },
  {
    name: 'T Nagar Comfort Suites',
    city: 'Chennai',
    address: 'T Nagar, Chennai',
    description: 'Convenient stay near Chennai\'s biggest shopping district.',
    pricePerNight: 3200,
    rating: 3.9,
    images: [
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800',
    ],
    amenities: ['wifi', 'parking'],
    roomsAvailable: 24,
  },

  // ---------------- HYDERABAD ----------------
  {
    name: 'Nizam Heritage Palace',
    city: 'Hyderabad',
    address: 'Banjara Hills, Hyderabad',
    description: 'Luxurious hotel inspired by Nizam-era architecture with modern amenities.',
    pricePerNight: 8200,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800',
    ],
    amenities: ['wifi', 'pool', 'spa', 'breakfast', 'gym'],
    roomsAvailable: 16,
  },
  {
    name: 'HITEC City Business Inn',
    city: 'Hyderabad',
    address: 'HITEC City, Hyderabad',
    description: 'Tech-hub hotel close to major IT companies, popular with business travelers.',
    pricePerNight: 4800,
    rating: 4.2,
    images: [
      'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
      'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=800',
    ],
    amenities: ['wifi', 'gym', 'breakfast', 'parking'],
    roomsAvailable: 22,
  },

  // ---------------- PUNE ----------------
  {
    name: 'Deccan Heritage Hotel',
    city: 'Pune',
    address: 'Koregaon Park, Pune',
    description: 'Stylish hotel in Pune\'s trendiest neighborhood, full of cafes and greenery.',
    pricePerNight: 5400,
    rating: 4.3,
    images: [
      'https://images.unsplash.com/photo-1582719478141-cb2bc3a9d2a3?w=800',
      'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800',
    ],
    amenities: ['wifi', 'breakfast', 'gym', 'parking'],
    roomsAvailable: 18,
  },
  {
    name: 'Hinjewadi IT Park Hotel',
    city: 'Pune',
    address: 'Hinjewadi, Pune',
    description: 'Convenient hotel for professionals working in Pune\'s IT corridor.',
    pricePerNight: 3600,
    rating: 4.0,
    images: [
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    ],
    amenities: ['wifi', 'parking', 'breakfast'],
    roomsAvailable: 26,
  },

  // ---------------- UDAIPUR ----------------
  {
    name: 'Lake Palace Retreat',
    city: 'Udaipur',
    address: 'Lake Pichola, Udaipur',
    description: 'Romantic lakeside hotel with breathtaking views of Lake Pichola.',
    pricePerNight: 11000,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
    ],
    amenities: ['wifi', 'pool', 'spa', 'breakfast'],
    roomsAvailable: 10,
  },
  {
    name: 'City Palace View Hotel',
    city: 'Udaipur',
    address: 'City Palace Road, Udaipur',
    description: 'Charming hotel with direct views of the historic City Palace.',
    pricePerNight: 6200,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800',
    ],
    amenities: ['wifi', 'breakfast', 'parking'],
    roomsAvailable: 14,
  },

  // ---------------- RISHIKESH ----------------
  {
    name: 'Ganga Riverside Resort',
    city: 'Rishikesh',
    address: 'Laxman Jhula, Rishikesh',
    description: 'Tranquil resort on the banks of the Ganges, ideal for yoga and meditation retreats.',
    pricePerNight: 3800,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    ],
    amenities: ['wifi', 'breakfast'],
    roomsAvailable: 20,
  },
  {
    name: 'Himalayan Foothills Lodge',
    city: 'Rishikesh',
    address: 'Tapovan, Rishikesh',
    description: 'Peaceful lodge surrounded by mountains, popular among trekkers and backpackers.',
    pricePerNight: 1900,
    rating: 4.1,
    images: [
      'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=800',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    ],
    amenities: ['wifi'],
    roomsAvailable: 24,
  },

  // ---------------- KOCHI ----------------
  {
    name: 'Backwater Bliss Resort',
    city: 'Kochi',
    address: 'Fort Kochi, Kochi',
    description: 'Serene resort near the backwaters with traditional Kerala-style architecture.',
    pricePerNight: 7000,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    ],
    amenities: ['wifi', 'pool', 'breakfast', 'spa'],
    roomsAvailable: 12,
  },
  {
    name: 'Spice Coast Inn',
    city: 'Kochi',
    address: 'Mattancherry, Kochi',
    description: 'Cozy inn in the historic spice trading district, full of character and charm.',
    pricePerNight: 2900,
    rating: 4.0,
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    ],
    amenities: ['wifi', 'breakfast'],
    roomsAvailable: 18,
  },
];

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    let added = 0;
    let skipped = 0;

    for (const hotelData of seedHotels) {
      const exists = await Hotel.findOne({
        name: hotelData.name,
        city: hotelData.city,
      });

      if (exists) {
        skipped++;
        continue;
      }

      await Hotel.create(hotelData);
      added++;
    }

    console.log(`\n🏨 Seeding complete!`);
    console.log(`   ✅ Added:   ${added} new hotels`);
    console.log(`   ⏭️  Skipped: ${skipped} hotels (already existed)`);
    console.log(`\nSafe to run this script again anytime — it will never delete or duplicate data.\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

runSeed();