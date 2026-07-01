import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlices'
import hotelReducer from './slices/hotelSlice'
import FlightReducer from './slices/flightSlice'
import bookingReducer from './slices/bookingSlice'
import DashboardReducer from './slices/dashboardSlice';
import adminReducer from './slices/adminSlice'

export const store = configureStore({
    reducer:{ 
        auth: authReducer,
        hotels: hotelReducer,
        flights: FlightReducer,
        booking: bookingReducer,
        dashboard: DashboardReducer,
        admin: adminReducer,

    },

});