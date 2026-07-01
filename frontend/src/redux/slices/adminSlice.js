import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getAdminStats = createAsyncThunk(
    'admin/getStats',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/stats');
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

export const getAllUsers = createAsyncThunk(
    'admin/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/all-users');
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const getAllBookings = createAsyncThunk(
    'admin/getAllBookings',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/all-bookings');
          return [
        ...data.hotelBookings,
        ...data.flightBookings,
      ];
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookings');
        }
    }
);

export const addHotel = createAsyncThunk(
    'admin/addHotel',
    async (hotelData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/hotels', hotelData);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add hotel');
        }
    }
);

export const updateHotel = createAsyncThunk(
    'admin/updateHotel',
    async ({ hotelId, hotelData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/hotels/${hotelId}`, hotelData);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update hotel');
        }
    }
);

export const deleteHotel = createAsyncThunk(
    'admin/deleteHotel',
    async (hotelId, { rejectWithValue }) => {
        try {
            await api.delete(`/hotels/${hotelId}`);
            return hotelId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete hotel');
        }
    }
);

export const addFlight = createAsyncThunk(
    'admin/addFlight',
    async (flightData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/flights', flightData);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add flight');
        }
    }
);

export const updateFlight = createAsyncThunk(
    'admin/updateFlight',
    async ({ flightId, flightData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/flights/${flightId}`, flightData);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update flight');
        }
    }
);

export const deleteFlight = createAsyncThunk(
    'admin/deleteFlight',
    async (flightId, { rejectWithValue }) => {
        try {
            await api.delete(`/flights/${flightId}`);
            return flightId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete flight');
        }
    }
);

const initialState = {
    stats: {
        users: 0,
        hotels: 0,
        flights: 0,
        totalBookings: 0,
        hotelBookings: 0,
        flightBookings: 0,
        totalRevenue: 0,
        hotelRevenue: 0,
        flightRevenue: 0,
        averageBookingValue: 0,
    },
    allUsers: [],
    allBookings: [],
    loading: false,
    error: null,
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdminStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdminStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(getAdminStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getAllBookings.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.allBookings = action.payload;
            })
            .addCase(getAllBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addHotel.fulfilled, (state) => {
                state.loading = false;
                state.stats.hotels += 1;
            })
            .addCase(deleteHotel.fulfilled, (state) => {
                state.loading = false;
                state.stats.hotels -= 1;
            })
            .addCase(addFlight.fulfilled, (state) => {
                state.loading = false;
                state.stats.flights += 1;
            })
            .addCase(deleteFlight.fulfilled, (state) => {
                state.loading = false;
                state.stats.flights -= 1;
            });
    },

});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;