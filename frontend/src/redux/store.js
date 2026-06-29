import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlices'
import hotelReducer from './slices/hotelSlice'
import FlightReducer from './slices/flightSlice'

export const store = configureStore({
    reducer:{ 
        auth: authReducer,
        hotels: hotelReducer,
        flights: FlightReducer,

    },

});