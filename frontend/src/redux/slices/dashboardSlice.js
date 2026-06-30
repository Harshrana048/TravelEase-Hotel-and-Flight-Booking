import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getMyBookings = createAsyncThunk(
  'dashboard/getMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const getWishlist = createAsyncThunk(
  'dashboard/getWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/wishlist');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// ✅ FIXED: Use the correct endpoint that does refund + cancel
export const cancelAndRefundBooking = createAsyncThunk(
  'dashboard/cancelAndRefundBooking',
  async (paymentId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/payments/refunds/${paymentId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel and refund booking');
    }
  }
);



export const removeFromWishlist = createAsyncThunk(
  'dashboard/removeFromWishlist',
  async ({ itemId, type }, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/wishlist/remove/${itemId}?type=${type}`);
      return { itemId, type };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    hotelBookings: [],
    flightBookings: [],
    wishlist: { hotels: [], flights: [] },
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.hotelBookings = action.payload.hotelBookings || [];
        state.flightBookings = action.payload.flightBookings || [];
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelAndRefundBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAndRefundBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Remove booking from appropriate list
        const bookingId = action.payload.booking._id;
        state.hotelBookings = state.hotelBookings.filter((b) => b._id !== bookingId);
        state.flightBookings = state.flightBookings.filter((b) => b._id !== bookingId);
      })
      .addCase(cancelAndRefundBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const { itemId, type } = action.payload;
        if (type === 'hotel') {
          state.wishlist.hotels = state.wishlist.hotels.filter((h) => h._id !== itemId);
        } else {
          state.wishlist.flights = state.wishlist.flights.filter((f) => f._id !== itemId);
        }
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;