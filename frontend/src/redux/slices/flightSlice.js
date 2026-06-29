import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../services/api';


export const getFlights = createAsyncThunk(
    'flights/getFlights',
    async (filters, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (filters.source) params.append('source', filters.source);
            if (filters.destination) params.append('destination', filters.destination);
            if (filters.date) params.append('date', filters.date);
            params.append('page', filters.page || 1);
            params.append('limit', 9);

            const { data } = await api.get(`/flights?${params}`);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch flights');
        }
    }
);

export const getFlightById = createAsyncThunk(
    'flights/getFlightById',
    async (flightId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/flights/${flightId}`);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch flights');
        }
    }
);

const initialState = {
    flights: [],
    currentFlight: null,
    total: 0,
    pages: 0,
    currentPage: 1,
    loading: false,
    error: null,
    filters: {
        source: '',
        destination: '',
        date: '',
    }
}

const flightSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.currentPage = 1;
        },
        clearFilters: (state) => {
            state.filters = {
                source: '',
                destination: '',
                date: '',
            };
            state.currentPage = 1;
        },
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
         .addCase(getFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload.flights;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFlightById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlightById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFlight = action.payload;
      })
      .addCase(getFlightById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },

});

export const {setFilters,clearFilters,setPage} = flightSlice.actions;
export default flightSlice.reducer;