/**
 * responseFormatter.js
 * Constructs a human-readable explanation of the search intent.
 */

exports.formatExplanation = (intent) => {
  let parts = [];

  if (intent.hotelCategory) {
    parts.push(intent.hotelCategory.toLowerCase());
  }
  
  if (intent.hotelType) {
    parts.push(intent.hotelType.toLowerCase());
  }

  parts.push("hotels");

  if (intent.city) {
    // Capitalize city
    const capitalizedCity = intent.city.charAt(0).toUpperCase() + intent.city.slice(1);
    parts.push(`in ${capitalizedCity}`);
  }

  if (intent.locationPreference) {
    parts.push(`near ${intent.locationPreference.toLowerCase()}`);
  }

  if (intent.maxBudget) {
    parts.push(`under ₹${intent.maxBudget}`);
  }

  if (parts.length === 1 && parts[0] === "hotels") {
    return "Searching for hotels";
  }

  // E.g., "Searching for luxury business hotels in Mumbai near airport under ₹10000"
  return "Searching for " + parts.join(" ");
};

exports.formatFlightExplanation = (intent) => {
  let parts = [];

  if (intent.stops === 0) {
    parts.push("direct");
  }

  if (intent.departureTime) {
    parts.push(intent.departureTime.toLowerCase());
  }

  if (intent.travelStyle) {
    parts.push(intent.travelStyle.toLowerCase());
  }
  
  if (intent.travelClass) {
    parts.push(intent.travelClass.toLowerCase() + " class");
  }

  parts.push("flights");

  if (intent.source) {
    parts.push(`from ${intent.source.charAt(0).toUpperCase() + intent.source.slice(1)}`);
  }

  if (intent.destination) {
    parts.push(`to ${intent.destination.charAt(0).toUpperCase() + intent.destination.slice(1)}`);
  }

  if (intent.maxBudget) {
    parts.push(`under ₹${intent.maxBudget}`);
  }

  if (parts.length === 1 && parts[0] === "flights") {
    return "Searching for flights";
  }

  return "Searching for " + parts.join(" ");
};
