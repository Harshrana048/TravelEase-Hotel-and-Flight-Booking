
// External Module
const express = require('express');
require('dotenv').config();

// Local Module
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const hotelRoutes = require('./routes/hotel.routes');
const flightRoutes = require('./routes/flight.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const { notFound } = require('./middleware/404Notfound');
const wishlistRoutes = require('./routes/wishlist.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels',hotelRoutes);
app.use('/api/flights',flightRoutes);
app.use('/api/bookings',bookingRoutes);
app.use('/api/payments',paymentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin',adminRoutes);


// error
app.use(notFound);

// connect Db and Start Server
connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
    });
}).catch((error) => {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
});
