import io from 'socket.io-client';

let socket = null;

export const initSocket = () => {
    if (!socket) {
        const serverURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        console.log('%c[SOCKET] 🔌 Initializing socket connection...', 'color: #6366f1; font-weight: bold');
        console.log('[SOCKET] Connecting to:', serverURL);

        socket = io(serverURL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        // ─── Step 1: Connection ───────────────────────────────────────
        socket.on('connect', () => {
            console.group('%c[SOCKET] ✅ STEP 1 — Connected', 'color: #10b981; font-weight: bold');
            console.log('Socket ID     :', socket.id);
            console.log('Transport     :', socket.io.engine.transport.name); // polling or websocket
            console.log('Connected     :', socket.connected);
            console.groupEnd();
        });

        socket.on('disconnect', (reason) => {
            console.group('%c[SOCKET] ❌ STEP 1 — Disconnected', 'color: #ef4444; font-weight: bold');
            console.log('Socket ID     :', socket.id);
            console.log('Reason        :', reason);
            console.log('  io server disconnect → server called socket.disconnect()');
            console.log('  transport close      → network lost / server crashed');
            console.log('  transport error      → transport-level error');
            console.log('  ping timeout         → server not responding to ping');
            console.groupEnd();
        });

        socket.io.on('reconnect_attempt', (attempt) => {
            console.warn(`[SOCKET] 🔄 Reconnect attempt #${attempt}`);
        });

        socket.io.on('reconnect', (attempt) => {
            console.log(`%c[SOCKET] ✅ Reconnected after ${attempt} attempt(s). New ID: ${socket.id}`, 'color: #10b981');
        });

        socket.io.on('reconnect_failed', () => {
            console.error('[SOCKET] ❌ Reconnection FAILED after max attempts. Manual refresh required.');
        });

        socket.on('connect_error', (err) => {
            console.error('[SOCKET] ❌ Connection Error:', err.message);
            console.error('[SOCKET]    Check that backend is running at', serverURL);
        });

        socket.on('error', (error) => {
            console.error('[SOCKET] ❌ Socket error:', error);
        });
    } else {
        console.log('[SOCKET] ♻️  Reusing existing socket. ID:', socket.id, '| Connected:', socket.connected);
    }

    return socket;
};

export const getSocket = () => socket;

// ─── Step 2: Room Join ────────────────────────────────────────────────────────

export const joinHotel = (hotelId) => {
    if (socket) {
        console.group('%c[SOCKET] 🏨 STEP 2 — joinHotel()', 'color: #3b82f6; font-weight: bold');
        console.log('Hotel ID      :', hotelId);
        console.log('Socket ID     :', socket.id);
        console.log('Connected     :', socket.connected);
        console.log('Emitting event: join-hotel');
        console.groupEnd();
        socket.emit('join-hotel', hotelId);
    } else {
        console.error('[SOCKET] ❌ joinHotel() called but socket is null — initSocket() was not called first');
    }
};

export const leaveHotel = (hotelId) => {
    if (socket) {
        console.group('%c[SOCKET] 🏨 STEP 8 — leaveHotel() CLEANUP', 'color: #f59e0b; font-weight: bold');
        console.log('Hotel ID      :', hotelId);
        console.log('Socket ID     :', socket.id);
        console.log('Emitting event: leave-hotel');
        console.groupEnd();
        socket.emit('leave-hotel', hotelId);
    }
};

export const joinFlight = (flightId) => {
    if (socket) {
        console.group('%c[SOCKET] ✈️  STEP 2 — joinFlight()', 'color: #8b5cf6; font-weight: bold');
        console.log('Flight ID     :', flightId);
        console.log('Socket ID     :', socket.id);
        console.log('Connected     :', socket.connected);
        console.log('Emitting event: join-flight');
        console.groupEnd();
        socket.emit('join-flight', flightId);
    } else {
        console.error('[SOCKET] ❌ joinFlight() called but socket is null — initSocket() was not called first');
    }
};

export const leaveFlight = (flightId) => {
    if (socket) {
        console.group('%c[SOCKET] ✈️  STEP 8 — leaveFlight() CLEANUP', 'color: #f59e0b; font-weight: bold');
        console.log('Flight ID     :', flightId);
        console.log('Socket ID     :', socket.id);
        console.log('Emitting event: leave-flight');
        console.groupEnd();
        socket.emit('leave-flight', flightId);
    }
};

// ─── Step 5: Frontend Listeners ───────────────────────────────────────────────

export const onRoomBooked = (callback) => {
    if (socket) {
        console.log('[SOCKET] 👂 Registering listener: room-booked  (socket:', socket.id, ')');
        socket.on('room-booked', (data) => {
            console.group('%c[SOCKET] 🏨 STEP 5 — room-booked RECEIVED', 'color: #10b981; font-weight: bold');
            console.log('Full payload  :', data);
            console.log('hotelId       :', data.hotelId);
            console.log('roomsAvailable:', data.roomsAvailable);
            console.log('message       :', data.message);
            console.groupEnd();
            callback(data);
        });
    } else {
        console.error('[SOCKET] ❌ onRoomBooked() — socket not initialized');
    }
};

export const onRoomCancelled = (callback) => {
    if (socket) {
        console.log('[SOCKET] 👂 Registering listener: room-cancelled  (socket:', socket.id, ')');
        socket.on('room-cancelled', (data) => {
            console.group('%c[SOCKET] 🏨 STEP 5 — room-cancelled RECEIVED', 'color: #f59e0b; font-weight: bold');
            console.log('Full payload  :', data);
            console.log('hotelId       :', data.hotelId);
            console.log('roomsAvailable:', data.roomsAvailable);
            console.log('message       :', data.message);
            console.groupEnd();
            callback(data);
        });
    } else {
        console.error('[SOCKET] ❌ onRoomCancelled() — socket not initialized');
    }
};

export const onFlightBooked = (callback) => {
    if (socket) {
        console.log('[SOCKET] 👂 Registering listener: flight-booked  (socket:', socket.id, ')');
        socket.on('flight-booked', (data) => {
            console.group('%c[SOCKET] ✈️  STEP 5 — flight-booked RECEIVED', 'color: #10b981; font-weight: bold');
            console.log('Full payload   :', data);
            console.log('flightId       :', data.flightId);
            console.log('availableSeats :', data.availableSeats);
            console.log('message        :', data.message);
            console.groupEnd();
            callback(data);
        });
    } else {
        console.error('[SOCKET] ❌ onFlightBooked() — socket not initialized');
    }
};

export const onFlightCancelled = (callback) => {
    if (socket) {
        console.log('[SOCKET] 👂 Registering listener: flight-cancelled  (socket:', socket.id, ')');
        socket.on('flight-cancelled', (data) => {
            console.group('%c[SOCKET] ✈️  STEP 5 — flight-cancelled RECEIVED', 'color: #f59e0b; font-weight: bold');
            console.log('Full payload   :', data);
            console.log('flightId       :', data.flightId);
            console.log('availableSeats :', data.availableSeats);
            console.log('message        :', data.message);
            console.groupEnd();
            callback(data);
        });
    } else {
        console.error('[SOCKET] ❌ onFlightCancelled() — socket not initialized');
    }
};

// ─── Step 8: Cleanup ──────────────────────────────────────────────────────────

export const offRoomBooked = () => {
    if (socket) {
        console.log('[SOCKET] 🧹 STEP 8 — Removing listener: room-booked');
        socket.off('room-booked');
    }
};

export const offRoomCancelled = () => {
    if (socket) {
        console.log('[SOCKET] 🧹 STEP 8 — Removing listener: room-cancelled');
        socket.off('room-cancelled');
    }
};

export const offFlightBooked = () => {
    if (socket) {
        console.log('[SOCKET] 🧹 STEP 8 — Removing listener: flight-booked');
        socket.off('flight-booked');
    }
};

export const offFlightCancelled = () => {
    if (socket) {
        console.log('[SOCKET] 🧹 STEP 8 — Removing listener: flight-cancelled');
        socket.off('flight-cancelled');
    }
};