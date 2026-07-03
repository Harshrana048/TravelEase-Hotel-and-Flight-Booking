
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

// ─── DEBUG HELPER — Step 3: Room Validation ─────────────────────────────────
const logRoom = (io, roomName, label = '') => {
    const room = io.sockets.adapter.rooms.get(roomName);
    console.log(`\n[SOCKET] 🔍 STEP 3 — Room Validation ${label}`);
    console.log(`   Room name     : ${roomName}`);
    if (room) {
        const sockets = [...room];
        console.log(`   Clients count : ${room.size}`);
        console.log(`   Socket IDs    :`, sockets);
    } else {
        console.log(`   ⚠️  Room does NOT exist yet (empty or no one joined)`);
        console.log(`   → This means no browser is currently watching this page.`);
        console.log(`   → Socket events will NOT be received by anyone in real-time.`);
    }
    console.log('');
};

// Export logRoom so controllers can use it
app.set('logRoom', logRoom);

// Socket.io Connection — Step 1 logging
io.on('connection', (socket) => {
    console.log('\n[SOCKET] ✅ STEP 1 — New connection');
    console.log(`   Socket ID  : ${socket.id}`);
    console.log(`   Transport  : ${socket.conn.transport.name}`);
    console.log(`   Total      : ${io.engine.clientsCount} client(s) connected\n`);

    // ─── Step 2: Room Join — Hotel ───────────────────────────────────────────
    socket.on('join-hotel', (hotelId) => {
        const roomName = `hotel-${hotelId}`;
        socket.join(roomName);

        // Log the room state after joining — Step 3
        const room = io.sockets.adapter.rooms.get(roomName);
        const socketList = room ? [...room] : [];

        console.log(`\n[SOCKET] 🏨 STEP 2 — join-hotel received`);
        console.log(`   hotelId    : ${hotelId}`);
        console.log(`   socket.id  : ${socket.id}`);
        console.log(`   roomName   : ${roomName}`);
        console.log(`\n[SOCKET] 🔍 STEP 3 — Room Validation (after join)`);
        console.log(`   Room name     : ${roomName}`);
        console.log(`   Clients count : ${room ? room.size : 0}`);
        console.log(`   Socket IDs    :`, socketList);
        // Also list ALL rooms this socket belongs to
        const allRooms = [...socket.rooms];
        console.log(`   All rooms this socket is in:`, allRooms);
        console.log('');
    });

    // ─── Step 2: Room Join — Flight ──────────────────────────────────────────
    socket.on('join-flight', (flightId) => {
        const roomName = `flight-${flightId}`;
        socket.join(roomName);

        // Log the room state after joining — Step 3
        const room = io.sockets.adapter.rooms.get(roomName);
        const socketList = room ? [...room] : [];

        console.log(`\n[SOCKET] ✈️  STEP 2 — join-flight received`);
        console.log(`   flightId   : ${flightId}`);
        console.log(`   socket.id  : ${socket.id}`);
        console.log(`   roomName   : ${roomName}`);
        console.log(`\n[SOCKET] 🔍 STEP 3 — Room Validation (after join)`);
        console.log(`   Room name     : ${roomName}`);
        console.log(`   Clients count : ${room ? room.size : 0}`);
        console.log(`   Socket IDs    :`, socketList);
        const allRooms = [...socket.rooms];
        console.log(`   All rooms this socket is in:`, allRooms);
        console.log('');
    });

    // ─── Step 8: Cleanup — leave events ─────────────────────────────────────
    socket.on('leave-hotel', (hotelId) => {
        const roomName = `hotel-${hotelId}`;
        socket.leave(roomName);
        console.log(`\n[SOCKET] 🏨 STEP 8 — leave-hotel`);
        console.log(`   hotelId  : ${hotelId}`);
        console.log(`   socket.id: ${socket.id}`);
        console.log(`   room "${roomName}" clients remaining:`, io.sockets.adapter.rooms.get(roomName)?.size ?? 0);
        console.log('');
    });

    socket.on('leave-flight', (flightId) => {
        const roomName = `flight-${flightId}`;
        socket.leave(roomName);
        console.log(`\n[SOCKET] ✈️  STEP 8 — leave-flight`);
        console.log(`   flightId : ${flightId}`);
        console.log(`   socket.id: ${socket.id}`);
        console.log(`   room "${roomName}" clients remaining:`, io.sockets.adapter.rooms.get(roomName)?.size ?? 0);
        console.log('');
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