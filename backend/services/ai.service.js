const { GoogleGenAI } = require('@google/genai');

// Initialize the client using the new SDK constructor pattern
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.extractHotelFilters = async (userInput) => {
    try {
        console.log('🤖 [AI Service] Processing hotel search:', userInput);

        const prompt = `You are a travel booking assistant. Extract hotel search intent from user input.

Return ONLY valid JSON, nothing else. Do not use markdown wrapping like \`\`\`.

Fields to extract (use null if not mentioned):
{
  "city": "destination city or null",
  "hotelCategory": "Luxury, Premium, Budget, Economy, or null",
  "hotelType": "Family, Business, Romantic, Couple, Backpacker, Resort, Hostel, Villa, Apartment, or null",
  "locationPreference": "Beach, Mountain, Adventure, Airport, City Center, Train Station, Waterfront, Near Metro, or null",
  "maxBudget": number or null,
  "roomsNeeded": number or null,
  "guests": number or null,
  "checkInDate": "YYYY-MM-DD or null",
  "checkOutDate": "YYYY-MM-DD or null"
}

Examples:
1. Input: "Luxury hotel in Mumbai"
   Output: {"city":"Mumbai","hotelCategory":"Luxury","hotelType":null,"locationPreference":null,"maxBudget":null,"roomsNeeded":null,"guests":null,"checkInDate":null,"checkOutDate":null}

2. Input: "Cheap beach resorts in Goa under 5000"
   Output: {"city":"Goa","hotelCategory":"Budget","hotelType":"Resort","locationPreference":"Beach","maxBudget":5000,"roomsNeeded":null,"guests":null,"checkInDate":null,"checkOutDate":null}

3. Input: "Family hotel near airport"
   Output: {"city":null,"hotelCategory":null,"hotelType":"Family","locationPreference":"Airport","maxBudget":null,"roomsNeeded":null,"guests":null,"checkInDate":null,"checkOutDate":null}

User input: "${userInput}"

IMPORTANT: Return only the JSON object, no explanations! No markdown code blocks!`;

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

    const prompt = `You are a flight booking assistant. Extract flight search intent from user input.

Return ONLY valid JSON, nothing else. Do not use markdown wrapping like \`\`\`.

Fields to extract (use null if not mentioned):
{
  "source": "departure city or null",
  "destination": "arrival city or null",
  "travelStyle": "Luxury, Business, Budget, Vacation, Family, Student, Backpacker or null",
  "travelClass": "Economy, Business, First or null",
  "departureTime": "Morning, Afternoon, Evening, Night, Red Eye or null",
  "stops": 0 or 1 or null (0 for direct/non-stop),
  "tripType": "Round Trip, One Way or null",
  "flexibleDates": boolean or null,
  "maxBudget": number or null,
  "departureDate": "YYYY-MM-DD or 'tomorrow' or null",
  "returnDate": "YYYY-MM-DD or null"
}

Examples:
1. Input: "Cheap flight from Mumbai to Goa"
   Output: {"source":"Mumbai","destination":"Goa","travelStyle":"Budget","travelClass":"Economy","departureTime":null,"stops":null,"tripType":null,"flexibleDates":null,"maxBudget":null,"departureDate":null,"returnDate":null}

2. Input: "Business class Delhi to London"
   Output: {"source":"Delhi","destination":"London","travelStyle":"Business","travelClass":"Business","departureTime":null,"stops":null,"tripType":null,"flexibleDates":null,"maxBudget":null,"departureDate":null,"returnDate":null}

3. Input: "Direct morning flight to Dubai"
   Output: {"source":null,"destination":"Dubai","travelStyle":null,"travelClass":null,"departureTime":"Morning","stops":0,"tripType":null,"flexibleDates":null,"maxBudget":null,"departureDate":null,"returnDate":null}

User input: "${userInput}"

IMPORTANT: Return only the JSON object, no explanations! No markdown code blocks!`;

    // Updated invocation to new SDK format
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
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