/**
 * rankingEngine.js
 * Deterministically ranks hotel results based on the search intent.
 */

exports.getSortCriteria = (intent) => {
  // Default sorting
  let sort = { rating: -1, pricePerNight: 1 };

  if (intent.hotelCategory) {
    const category = intent.hotelCategory.toLowerCase();
    if (category === 'luxury' || category === 'premium') {
      sort = { rating: -1, pricePerNight: -1 }; // Highest rated first
    } else if (category === 'budget' || category === 'economy') {
      sort = { pricePerNight: 1, rating: -1 }; // Lowest price first
    }
  }

  // Override if type is specific
  if (intent.hotelType) {
    const type = intent.hotelType.toLowerCase();
    if (type === 'couple' || type === 'romantic') {
      sort = { rating: -1 }; // Prioritize rating highly for romantic/couple
    }
  }

  return sort;
};

exports.getFlightSortCriteria = (intent) => {
  // Default sorting
  let sort = { price: 1, availableSeats: -1 };

  if (intent.travelStyle) {
    const style = intent.travelStyle.toLowerCase();
    if (style === 'luxury' || style === 'business') {
      sort = { price: -1 }; // Or by some other quality metric if available
    } else if (style === 'budget' || style === 'economy') {
      sort = { price: 1 }; // Lowest price first
    } else if (style === 'vacation') {
      sort = { price: 1 };
    }
  }

  // Could further customize sort based on departureTime preferences if we had a computed duration field

  return sort;
};
