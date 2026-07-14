const { GoogleGenAI } = require('@google/genai');

// Initialize the client using the new SDK constructor pattern
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.extractHotelFilters = async (userInput) => {
    try {
        console.log('🤖 [AI Service] Processing hotel search:', userInput);

        const prompt = `You are a travel booking assistant. Extract hotel search filters from user input.

Return ONLY valid JSON, nothing else.

Fields to extract (use null if not mentioned):
{
  "city": "destination city or null",
  "checkInDate": "YYYY-MM-DD or null",
  "checkOutDate": "YYYY-MM-DD or null",
  "maxBudget": number or null,
  "amenities": ["array", "of", "amenities"] or null,
  "minRating": 1-5 or null,
  "roomsNeeded": number or null,
  "guests": number or null
}

Examples:
1. Input: "I want beaches in Goa for Dec 15-20, budget 50000"
   Output: {"city":"Goa","checkInDate":"2024-12-15","checkOutDate":"2024-12-20","maxBudget":50000,"amenities":["beaches"],"minRating":null,"roomsNeeded":null,"guests":null}

2. Input: "5-star hotel in Mumbai with WiFi and pool, max 10000"
   Output: {"city":"Mumbai","checkInDate":null,"checkOutDate":null,"maxBudget":10000,"amenities":["WiFi","pool"],"minRating":5,"roomsNeeded":null,"guests":null}

User input: "${userInput}"

IMPORTANT: Return only the JSON object, no explanations!`;

        // Updated invocation to new SDK format
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash', // Switched to active model lineup
            contents: prompt,
        });

        // Properties are read directly as a string property, not a function call
        const responseText = response.text.trim();

        console.log('📝 [AI Service] Gemini response:', responseText);
        const filters = JSON.parse(responseText);
        console.log('✅ [AI Service] Extracted filters:', JSON.stringify(filters, null, 2));

        return filters;

    } catch (error) {
        console.error('❌ [AI Service] Error:', error.message);
        throw error;
    }
};

exports.extractFlightFilters = async (userInput) => {
  try {
    console.log('🤖 [AI Service] Processing flight search:', userInput);

    const prompt = `You are a flight booking assistant. Extract flight search filters from user input.

Return ONLY valid JSON, nothing else.

Fields to extract (use null if not mentioned):
{
  "source": "departure city or null",
  "destination": "arrival city or null",
  "departureDate": "YYYY-MM-DD or null",
  "returnDate": "YYYY-MM-DD or null (for round trip)",
  "maxBudget": number or null,
  "class": "Economy/Business/First or null",
  "passengers": number or null
}

Examples:
1. Input: "Flights from Mumbai to Goa on Dec 20, budget 3000"
   Output: {"source":"Mumbai","destination":"Goa","departureDate":"2024-12-20","returnDate":null,"maxBudget":3000,"class":"Economy","passengers":null}

2. Input: "Business class Delhi to London, round trip Dec 15-25"
   Output: {"source":"Delhi","destination":"London","departureDate":"2024-12-15","returnDate":"2024-12-25","maxBudget":null,"class":"Business","passengers":null}

User input: "${userInput}"

IMPORTANT: Return only the JSON object, no explanations!`;

    // Updated invocation to new SDK format
    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
    });

    // Read directly as a string property
    const responseText = response.text.trim();

    console.log('📝 [AI Service] Gemini response:', responseText);

    const filters = JSON.parse(responseText);
    
    console.log('✅ [AI Service] Extracted filters:', JSON.stringify(filters, null, 2));

    return filters;
  } catch (error) {
    console.error('❌ [AI Service] Error:', error.message);
    throw new Error('Failed to understand your search. Try: "flights from Mumbai to Goa on Dec 20"');
  }
};