/**
 * aiSearchMapper.js
 * Maps AI extracted intent and raw keywords to MongoDB query filters.
 */

// Dictionary for synonyms and mapping rules
const categoryMapper = {
  luxury: { rating: { $gte: 4 } },
  premium: { rating: { $gte: 4.5 } },
  budget: { pricePerNight: { $lte: 3000 } }, // Arbitrary default budget, overridden if maxBudget exists
  economy: { pricePerNight: { $lte: 4000 } }
};

const typeMapper = {
  business: { amenities: { $all: [/wifi/i, /workspace/i, /breakfast/i] } },
  family: { amenities: { $all: [/family/i, /breakfast/i, /parking/i] } },
  romantic: { amenities: { $all: [/couple/i, /balcony/i, /spa/i] } },
  couple: { amenities: { $all: [/couple/i] } },
  resort: { name: { $regex: /resort/i } }
};

const locationMapper = {
  airport: { address: { $regex: /airport/i } },
  beach: { address: { $regex: /beach/i } },
  'city center': { address: { $regex: /center|central/i } }
};

exports.buildMongoQuery = (intent) => {
  const query = {};

  if (intent.city) {
    query.city = { $regex: intent.city, $options: 'i' };
  }

  if (intent.hotelCategory) {
    const category = intent.hotelCategory.toLowerCase();
    const mapped = categoryMapper[category];
    if (mapped) {
      if (mapped.rating) query.rating = mapped.rating;
      if (mapped.pricePerNight && !intent.maxBudget) {
        query.pricePerNight = mapped.pricePerNight;
      }
    }
  }

  if (intent.hotelType) {
    const type = intent.hotelType.toLowerCase();
    const mapped = typeMapper[type];
    if (mapped) {
      if (mapped.amenities) query.amenities = mapped.amenities;
      if (mapped.name) query.name = mapped.name;
    }
  }

  if (intent.locationPreference) {
    const loc = intent.locationPreference.toLowerCase();
    const mapped = locationMapper[loc];
    if (mapped) {
      if (mapped.address) query.address = mapped.address;
    }
  }

  if (intent.maxBudget) {
    query.pricePerNight = { ...(query.pricePerNight || {}), $lte: intent.maxBudget };
  }

  if (intent.roomsNeeded) {
    query.roomsAvailable = { $gte: intent.roomsNeeded };
  }

  return query;
};

// Fallback logic if AI fails
exports.fallbackKeywordExtraction = (userInput) => {
  const intent = {
    city: null,
    hotelCategory: null,
    hotelType: null,
    locationPreference: null,
    maxBudget: null
  };

  const text = userInput.toLowerCase();

  // Basic city extraction (could be improved with a real city list)
  const cities = ['mumbai', 'goa', 'delhi', 'bangalore', 'jaipur'];
  for (const city of cities) {
    if (text.includes(city)) intent.city = city;
  }

  if (text.match(/luxury|premium|upscale/)) intent.hotelCategory = 'Luxury';
  if (text.match(/budget|cheap|economy/)) intent.hotelCategory = 'Budget';

  if (text.match(/business|corporate/)) intent.hotelType = 'Business';
  if (text.match(/family|kids/)) intent.hotelType = 'Family';
  if (text.match(/romantic|couple/)) intent.hotelType = 'Romantic';
  if (text.match(/resort/)) intent.hotelType = 'Resort';

  if (text.match(/airport/)) intent.locationPreference = 'Airport';
  if (text.match(/beach/)) intent.locationPreference = 'Beach';

  const priceMatch = text.match(/(under|max|budget)[^\d]*(\d+)/i);
  if (priceMatch) intent.maxBudget = parseInt(priceMatch[2], 10);

  return intent;
};

// Flight intent mappings
const flightStyleMapper = {
  luxury: { class: 'Business' }, // Assume luxury usually means business or first
  business: { class: 'Business' },
  budget: { class: 'Economy' },
  vacation: {},
  family: {},
};

exports.buildFlightMongoQuery = (intent) => {
  const query = {};

  if (intent.source) {
    query.source = { $regex: intent.source, $options: 'i' };
  }

  if (intent.destination) {
    query.destination = { $regex: intent.destination, $options: 'i' };
  }

  if (intent.travelClass) {
    query.class = intent.travelClass;
  }

  if (intent.travelStyle) {
    const style = intent.travelStyle.toLowerCase();
    const mapped = flightStyleMapper[style];
    if (mapped) {
      if (mapped.class && !query.class) query.class = mapped.class;
    }
  }

  if (intent.maxBudget) {
    query.price = { $lte: intent.maxBudget };
  }

  // Handle departure time (Morning: 6-12, Afternoon: 12-17, Evening: 17-22, Night: 22-6)
  if (intent.departureTime) {
    const time = intent.departureTime.toLowerCase();
    // Assuming departureTime in Mongo is a Date object. This is complex for a simple regex if we don't know the exact date.
    // If the database has an actual Date, we can't easily filter purely by hour without aggregation or just relying on UI filters.
    // We will leave this for sorting or advanced aggregation if needed, or if departureTime was a string (e.g. "10:00 AM").
    // Let's assume we can at least rank by it later.
  }

  // Handle stops if the model had it. As discussed, if model is simple, 0 stops = all flights or direct.
  // Assuming our simple model has direct flights.

  return query;
};

// Fallback logic if AI fails for flights
exports.fallbackFlightKeywordExtraction = (userInput) => {
  const intent = {
    source: null,
    destination: null,
    travelStyle: null,
    travelClass: null,
    departureTime: null,
    stops: null,
    maxBudget: null
  };

  const text = userInput.toLowerCase();

  const cities = ['mumbai', 'goa', 'delhi', 'london', 'dubai', 'singapore'];
  let foundCities = [];
  for (const city of cities) {
    if (text.includes(city)) foundCities.push(city);
  }
  
  if (foundCities.length >= 2) {
    intent.source = foundCities[0];
    intent.destination = foundCities[1];
  } else if (foundCities.length === 1) {
    intent.destination = foundCities[0];
  }

  if (text.match(/luxury|business class/)) {
    intent.travelClass = 'Business';
    intent.travelStyle = 'Luxury';
  }
  if (text.match(/budget|cheap|economy/)) {
    intent.travelClass = 'Economy';
    intent.travelStyle = 'Budget';
  }

  if (text.match(/morning/)) intent.departureTime = 'Morning';
  if (text.match(/evening/)) intent.departureTime = 'Evening';
  
  if (text.match(/direct|non-stop/)) intent.stops = 0;

  const priceMatch = text.match(/(under|max|budget)[^\d]*(\d+)/i);
  if (priceMatch) intent.maxBudget = parseInt(priceMatch[2], 10);

  return intent;
};
