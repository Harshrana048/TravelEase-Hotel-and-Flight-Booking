const aiService = require('../services/ai.service');
const Hotel = require('../models/hotel.model');
const Flight = require('../models/Flight.model');
const aiSearchMapper = require('../utils/aiSearchMapper');
const rankingEngine = require('../utils/rankingEngine');
const responseFormatter = require('../utils/responseFormatter');

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

    let filters;
    // ✅ Step 1: Extract filters using Gemini AI or Fallback
    try {
      filters = await aiService.extractHotelFilters(query);
    } catch (aiError) {
      console.warn('⚠️ [AI Controller] Gemini failed, falling back to keyword extraction:', aiError.message);
      filters = aiSearchMapper.fallbackKeywordExtraction(query);
    }
    
    console.log('📊 [AI Controller] Extracted intent:', filters);

    // ✅ Step 2: Build MongoDB query using Mapper
    const mongoQuery = aiSearchMapper.buildMongoQuery(filters);
    console.log('🔎 [AI Controller] MongoDB query:', JSON.stringify(mongoQuery, null, 2));

    // ✅ Step 3: Get Sort Criteria using Ranking Engine
    const sortCriteria = rankingEngine.getSortCriteria(filters);
    console.log('📈 [AI Controller] Sort criteria:', sortCriteria);

    // ✅ Step 4: Search database
    const hotels = await Hotel.find(mongoQuery)
      .limit(20)
      .sort(sortCriteria);

    console.log(`✅ [AI Controller] Found ${hotels.length} hotels`);

    // ✅ Step 5: Format human-readable explanation
    const explanation = responseFormatter.formatExplanation({ ...filters, city: filters.city });

    // ✅ Step 6: Return results
    res.status(200).json({
      success: true,
      message: `Found ${hotels.length} hotels matching your search`,
      explanation: explanation,
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

    let filters;
    // ✅ Step 1: Extract filters using Gemini AI or Fallback
    try {
      filters = await aiService.extractFlightFilters(query);
    } catch (aiError) {
      console.warn('⚠️ [AI Controller] Gemini failed for flights, falling back to keyword extraction:', aiError.message);
      filters = aiSearchMapper.fallbackFlightKeywordExtraction(query);
    }
    
    console.log('📊 [AI Controller] Extracted flight intent:', filters);

    // ✅ Step 2: Build MongoDB query using Mapper
    const mongoQuery = aiSearchMapper.buildFlightMongoQuery(filters);
    console.log('🔎 [AI Controller] MongoDB query:', JSON.stringify(mongoQuery, null, 2));

    // ✅ Step 3: Get Sort Criteria using Ranking Engine
    const sortCriteria = rankingEngine.getFlightSortCriteria(filters);
    console.log('📈 [AI Controller] Sort criteria:', sortCriteria);

    // ✅ Step 4: Search database
    const flights = await Flight.find(mongoQuery)
      .limit(20)
      .sort(sortCriteria);

    console.log(`✅ [AI Controller] Found ${flights.length} flights`);

    // ✅ Step 5: Format human-readable explanation
    const explanation = responseFormatter.formatFlightExplanation(filters);

    // ✅ Step 6: Return results
    res.status(200).json({
      success: true,
      message: `Found ${flights.length} flights matching your search`,
      explanation: explanation,
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