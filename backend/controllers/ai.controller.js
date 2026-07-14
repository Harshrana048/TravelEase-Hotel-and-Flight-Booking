const aiService = require('../services/ai.service');
const Hotel = require('../models/hotel.model');
const Flight = require('../models/Flight.model');

// ✅ Search hotels using AI
exports.searchHotelsWithAI = async (req, res) => {
  try {
    const { query } = req.body;

    // Validate input
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a search query. Example: "beaches in Goa for ₹50,000"',
      });
    }

    console.log('🔍 [AI Controller] Hotel search query:', query);

    // ✅ Step 1: Extract filters using Gemini AI
    const filters = await aiService.extractHotelFilters(query);
    console.log('📊 [AI Controller] Extracted filters:', filters);

    // ✅ Step 2: Build MongoDB query
    const mongoQuery = {};

    if (filters.city) {
      mongoQuery.city = { $regex: filters.city, $options: 'i' };
      console.log('🏙️ Filter: city =', filters.city);
    }

    if (filters.maxBudget) {
      mongoQuery.pricePerNight = { $lte: filters.maxBudget };
      console.log('💰 Filter: maxBudget =', filters.maxBudget);
    }

    if (filters.minRating) {
      mongoQuery.rating = { $gte: filters.minRating };
      console.log('⭐ Filter: minRating =', filters.minRating);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      mongoQuery.amenities = {
        $in: filters.amenities.map((amenity) => new RegExp(amenity, 'i')),
      };
      console.log('🏖️ Filter: amenities =', filters.amenities);
    }

    if (filters.roomsNeeded) {
      mongoQuery.roomsAvailable = { $gte: filters.roomsNeeded };
      console.log('🛏️ Filter: roomsNeeded =', filters.roomsNeeded);
    }

    console.log('🔎 [AI Controller] MongoDB query:', JSON.stringify(mongoQuery, null, 2));

    // ✅ Step 3: Search database
    const hotels = await Hotel.find(mongoQuery)
      .limit(20)
      .sort({ rating: -1, pricePerNight: 1 });

    console.log(`✅ [AI Controller] Found ${hotels.length} hotels`);

    // ✅ Step 4: Return results
    res.status(200).json({
      success: true,
      message: `Found ${hotels.length} hotels matching your search`,
      extractedFilters: filters,
      count: hotels.length,
      hotels,
    });
  } catch (error) {
    console.error('❌ [AI Controller] Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Search flights using AI
exports.searchFlightsWithAI = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a search query. Example: "flights from Mumbai to Goa on Dec 20"',
      });
    }

    console.log('🔍 [AI Controller] Flight search query:', query);

    // ✅ Step 1: Extract filters using Gemini AI
    const filters = await aiService.extractFlightFilters(query);
    console.log('📊 [AI Controller] Extracted filters:', filters);

    // ✅ Step 2: Build MongoDB query
    const mongoQuery = {};

    if (filters.source) {
      mongoQuery.source = { $regex: filters.source, $options: 'i' };
      console.log('🛫 Filter: source =', filters.source);
    }

    if (filters.destination) {
      mongoQuery.destination = { $regex: filters.destination, $options: 'i' };
      console.log('🛬 Filter: destination =', filters.destination);
    }

    if (filters.departureDate) {
      const startOfDay = new Date(filters.departureDate);
      const endOfDay = new Date(filters.departureDate);
      endOfDay.setHours(23, 59, 59, 999);

      mongoQuery.departureTime = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
      console.log('📅 Filter: departureDate =', filters.departureDate);
    }

    if (filters.maxBudget) {
      mongoQuery.price = { $lte: filters.maxBudget };
      console.log('💰 Filter: maxBudget =', filters.maxBudget);
    }

    if (filters.class) {
      mongoQuery.class = filters.class;
      console.log('🎫 Filter: class =', filters.class);
    }

    console.log('🔎 [AI Controller] MongoDB query:', JSON.stringify(mongoQuery, null, 2));

    // ✅ Step 3: Search database
    const flights = await Flight.find(mongoQuery)
      .limit(20)
      .sort({ price: 1, availableSeats: -1 });

    console.log(`✅ [AI Controller] Found ${flights.length} flights`);

    // ✅ Step 4: Return results
    res.status(200).json({
      success: true,
      message: `Found ${flights.length} flights matching your search`,
      extractedFilters: filters,
      count: flights.length,
      flights,
    });
  } catch (error) {
    console.error('❌ [AI Controller] Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};