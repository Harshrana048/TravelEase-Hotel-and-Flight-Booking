
// External Module
const express = require('express');
require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

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
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});


app.use(express.json());
// ✅ Make io available to routes
app.set('io', io)

// Socket.io Connection

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);


    // join Hotel room

    socket.on('join-hotel', (hotelId) => {
        // join room using consistent name: hotel-<id>
        const roomName = `hotel-${hotelId}`;
        socket.join(roomName);
        console.log(`📍 User joined room: ${roomName} (socket: ${socket.id})`);
    })

    // Join flight room
    socket.on('join-flight', (flightId) => {
        socket.join(`flight-${flightId}`);
        console.log(`✈️ User joined flight room: ${flightId}`);
    });

    //   leave Hotel Room 
    socket.on('leave-hotel', (hotelId) => {
        const roomName = `hotel-${hotelId}`;
        socket.leave(roomName);
        console.log(`📍 User left room: ${roomName} (socket: ${socket.id})`);
    });
    //   leave Flight 
    socket.on('leave-flight', (flightId) => {
        socket.leave(`flight-${flightId}`);
        console.log(`✈️ User left flight room: ${flightId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);


// error
app.use(notFound);

// connect Db and Start Server
connectDB()
    .then(() => {
        server.listen(process.env.PORT || 3000, () => {
            console.log(
                `Server running at http://localhost:${process.env.PORT || 3000}`
            );
        });
    })
    .catch((error) => {
        console.error(`Failed to connect to MongoDB: ${error.message}`);
    });