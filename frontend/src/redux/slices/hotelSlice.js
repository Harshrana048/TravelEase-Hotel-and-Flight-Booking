import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';



export const getHotels = createAsyncThunk(
  "/hotels/getHotels",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (filters.city) params.append("city", filters.city);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.rating) params.append("rating", filters.rating);
      if (filters.amenities?.length)
        params.append("amenities", filters.amenities.join(","));

      params.append("page", filters.page || 1);
      params.append("limit", filters.limit || 6);

      const { data } = await api.get(`/hotels?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch hotels"
      );
    }
  }
);

export const getHotelById = createAsyncThunk(
    '/hotels/getHotelById',
    async (hotelId,{rejectWithValue}) => {
        try{
            const {data} = await api.get(`/hotels/${hotelId}`);
            return data;
        }
        catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch hotel');
    }
    }
);
export const addReview = createAsyncThunk(
  'hotels/addReview',
  async ({ hotelId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/hotels/${hotelId}/reviews`, reviewData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add review');
    }
  }
);


const initialState = {
    hotels: [],
    currentHotel: null,
    total: 0,
    pages: 0,
    currentPage: 1,
    loading: false,
    error: null,
    filters: {
      city: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      amenities: [],
    }
}

const hotelSlice = createSlice({
    name:'hotel',
    initialState,
    reducers: {
        setFilters: (state,action) => {
            state.filters = {...state.filters , ...action.payload};
            state.currentPage = 1;
        },
    clearFilters: (state) => {
      state.filters = {
        city: '',
        minPrice: '',
        maxPrice: '',
        rating: '',
        amenities: [],
      };
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getHotels.pending,(state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getHotels.fulfilled,(state,action) => {
            state.loading = false;
            state.hotels = action.payload.hotels;
            state.total = action.payload.total;
            state.pages = action.payload.pages;
            state.currentPage = action.payload.currentPage;
        })
        .addCase(getHotels.rejected,(state) => {
            state.loading = false;
            state.error = action.payload;
        })
       .addCase(getHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHotelById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHotel = action.payload;
      })
      .addCase(getHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.currentHotel = action.payload;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },

    

});

export const {setFilters,clearFilters,setPage} = hotelSlice.actions;
export default hotelSlice.reducer;