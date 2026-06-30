import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../services/api'

export const bookHotel = createAsyncThunk(
    '/booking/bookHotel',
    async (bookingData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/bookings/hotel', bookingData);
            return data;

        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to book hotel');
        }
    }
);

export const bookFlight = createAsyncThunk(
    'booking/bookFlight',
    async (bookingData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/bookings/flight', bookingData);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to book flight');
        }
    }
);

export const createPaymentOrder = createAsyncThunk(
    'booking/createPaymentOrder',
    async ({ bookingId, bookingType }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/payments/create-order', {
                bookingId,
                bookingType,
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create payment order');
        }
    }
);

export const verifyPayment = createAsyncThunk( 
  'booking/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/payments/verify', paymentData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Payment verification failed');
    }
  }
);

const initialState = {
    currentBooking: null,
    loading: false,
    error: null,
    paymentOrder: null,
    paymentVerified: false,
}

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        clearBooking: (state) => {
            state.currentBooking = null;
            state.paymentOrder = null;
            state.paymentVerified = false;
            state.error = null;
        },
        extraReducers: (builder) => {
            builder
                .addCase(bookHotel.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(bookHotel.fulfilled, (state, action) => {
                    state.loading = false;
                    state.currentBooking = action.payload;

                })
                .addCase(bookHotel.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(bookFlight.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(bookFlight.fulfilled, (state, action) => {
                    state.loading = false;
                    state.currentBooking = action.payload;
                })
                .addCase(bookFlight.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(createPaymentOrder.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(createPaymentOrder.fulfilled, (state, action) => {
                    state.loading = false;
                    state.paymentOrder = action.payload;
                })
                .addCase(createPaymentOrder.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                  .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentVerified = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
}
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;


      