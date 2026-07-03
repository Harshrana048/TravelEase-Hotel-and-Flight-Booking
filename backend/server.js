
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



// Socket.io Connection — Step 1 logging
io.on('connection', (socket) => {
    
    // ─── Step 2: Room Join — Hotel ───────────────────────────────────────────
    socket.on('join-hotel', (hotelId) => {
        const roomName = `hotel-${hotelId}`;
        socket.join(roomName);
    });

    // ─── Step 2: Room Join — Flight ──────────────────────────────────────────
    socket.on('join-flight', (flightId) => {
        const roomName = `flight-${flightId}`;
        socket.join(roomName);
    });

    // ─── Step 8: Cleanup — leave events ─────────────────────────────────────
    socket.on('leave-hotel', (hotelId) => {
        const roomName = `hotel-${hotelId}`;
        socket.leave(roomName);
        
    });

    socket.on('leave-flight', (flightId) => {
        const roomName = `flight-${flightId}`;
        socket.leave(roomName);
        
    });

    socket.on('disconnect', (reason) => {
        console.log(`\n[SOCKET] ❌ STEP 1 — Disconnected`);
        console.log(`   socket.id: ${socket.id}`);
        console.log(`   reason   : ${reason}`);
        console.log(`   Total    : ${io.engine.clientsCount} client(s) remaining\n`);
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