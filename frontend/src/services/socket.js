import io from 'socket.io-client';

let socket = null;

export const initSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
            console.log('✅ Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
        });

        socket.on('error', (error) => {
            console.error('❌ Socket error:', error);
        });
    }

    return socket;
};

export const getSocket = () => socket;

export const joinHotel = (hotelId) => {
    if (socket) {
        socket.emit('join-hotel', hotelId);
    }
};

export const leaveHotel = (hotelId) => {
    if (socket) {
        socket.emit('leave-hotel', hotelId);
    }
};

export const joinFlight = (flightId) => {
    if (socket) {
        socket.emit('join-flight', flightId);
    }
};

export const leaveFlight = (flightId) => {
    if (socket) {
        socket.emit('leave-flight', flightId);
    }
};

export const onRoomBooked = (callback) => {
    if (socket) {
        socket.on('room-booked', callback);
    }
};

export const onRoomCancelled = (callback) => {
    if (socket) {
        socket.on('room-cancelled', callback);
    }
};

export const onFlightBooked = (callback) => {
    if (socket) {
        socket.on('flight-booked', callback);
    }
};

export const onFlightCancelled = (callback) => {
    if (socket) {
        socket.on('flight-cancelled', callback);
    }
};

export const offRoomBooked = () => {
    if (socket) {
        socket.off('room-booked');
    }
};

export const offRoomCancelled = () => {
    if (socket) {
        socket.off('room-cancelled');
    }
};

export const offFlightBooked = () => {
    if (socket) {
        socket.off('flight-booked');
    }
};

export const offFlightCancelled = () => {
    if (socket) {
        socket.off('flight-cancelled');
    }
};