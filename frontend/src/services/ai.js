import api from './api';

// ✅ Search hotels using AI
export const searchHotelsWithAI = async (query) => {
  try {
    console.log('🤖 [Frontend AI] Searching hotels:', query);
    const { data } = await api.post('/ai/search-hotels', { query });
    console.log('✅ [Frontend AI] Results:', data);
    return data;
  } catch (err) {
    console.error('❌ [Frontend AI] Error:', err.message);
    throw new Error(err.response?.data?.message || 'AI search failed');
  }
};

// ✅ Search flights using AI
export const searchFlightsWithAI = async (query) => {
  try {
    console.log('🤖 [Frontend AI] Searching flights:', query);
    const { data } = await api.post('/ai/search-flights', { query });
    console.log('✅ [Frontend AI] Results:', data);
    return data;
  } catch (err) {
    console.error('❌ [Frontend AI] Error:', err.message);
    throw new Error(err.response?.data?.message || 'AI search failed');
  }
};