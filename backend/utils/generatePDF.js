const PDFDocument = require('pdfkit');

const generateHotelTicketPDF = (booking, hotel) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc.fontSize(24).fillColor('#1d4ed8').text('TravelEase', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(18).fillColor('#000').text('🏨 Hotel Booking Confirmation', { align: 'center' });
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Booking Details
        doc.fontSize(12).fillColor('#333');
        doc.text('BOOKING REFERENCE', { underline: true });
        doc.fontSize(11).text(`Booking ID: ${booking._id}`);
        doc.fontSize(11).text(`Status: ${booking.bookingStatus.toUpperCase()}`);
        doc.fontSize(11).text(`Booked On: ${new Date(booking.createdAt).toLocaleDateString()}`);
        doc.moveDown();

        // Hotel Details
        doc.fontSize(12).fillColor('#333').text('HOTEL DETAILS', { underline: true });
        doc.fontSize(11).fillColor('#000');
        doc.text(`Hotel: ${hotel.name}`);
        doc.text(`Address: ${hotel.address}`);
        doc.text(`City: ${hotel.city}`);
        doc.text(`Rating: ${'⭐'.repeat(Math.floor(hotel.rating))} (${hotel.rating}/5)`);
        doc.moveDown();

        // Guest Details
        doc.fontSize(12).fillColor('#333').text('GUEST DETAILS', { underline: true });
        doc.fontSize(11).fillColor('#000');
        doc.text(`Number of Guests: ${booking.guests.length}`);
        booking.guests.forEach((guest, idx) => {
            doc.text(`  ${idx + 1}. ${guest.name} (Age: ${guest.age})`);
        });
        doc.text(`Contact: ${booking.contactPhone}`);
        doc.moveDown();

        // Stay Details
        doc.fontSize(12).fillColor('#333').text('STAY DETAILS', { underline: true });
        doc.fontSize(11).fillColor('#000');
        doc.text(`Check-in: ${new Date(booking.checkInDate).toDateString()}`);
        doc.text(`Check-out: ${new Date(booking.checkOutDate).toDateString()}`);
        doc.text(`Number of Nights: ${booking.nights}`);
        doc.text(`Rooms Booked: ${booking.roomsBooked}`);
        doc.moveDown();

        // Price Details
        doc.fontSize(12).fillColor('#333').text('PRICE DETAILS', { underline: true });
        doc.fontSize(11).fillColor('#000');
        doc.text(`Price per Night: ₹${hotel.pricePerNight}`);
        doc.text(`Number of Nights: ${booking.nights}`);
        doc.text(`Number of Rooms: ${booking.roomsBooked}`);
        doc.fontSize(12).fillColor('#d32f2f').text(
            `Total Amount: ₹${booking.totalPrice}`,
            { underline: true }
        );
        doc.moveDown();

        // Payment Status
        doc.fontSize(12).fillColor('#333').text('PAYMENT STATUS', { underline: true });
        doc.fontSize(11).fillColor(booking.paymentStatus === 'paid' ? '#388e3c' : '#f57c00');
        doc.text(`Payment: ${booking.paymentStatus.toUpperCase()}`);
        doc.moveDown();

        // Amenities
        if (hotel.amenities && hotel.amenities.length > 0) {
            doc.fontSize(12).fillColor('#333').text('AMENITIES', { underline: true });
            doc.fontSize(11).fillColor('#000');
            const amenities = hotel.amenities.join(', ');
            doc.text(amenities, { width: 450, align: 'left' });
            doc.moveDown();
        }

        // Footer
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();
        doc.fontSize(10).fillColor('#666');
        doc.text('Thank you for booking with TravelEase!', { align: 'center' });
        doc.text('For support, contact: support@travelease.com', { align: 'center' });

        doc.end();
    });
};

const generateFlightTicketPDF = (booking, flight, returnFlight = null) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(24).fillColor('#1d4ed8').text('TravelEase', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(18).fillColor('#000').text('✈ Flight Booking Confirmation', { align: 'center' });
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Booking Details
        doc.fontSize(12).fillColor('#333').text('BOOKING REFERENCE', { underline: true });
        doc.fontSize(11).fillColor('#000');
        doc.text(`Booking ID: ${booking._id}`);
        doc.text(`Status: ${booking.bookingStatus.toUpperCase()}`);
        doc.text(`Trip Type: ${booking.tripType.toUpperCase()}`);
        doc.fontSize(11).text(`Booked On: ${new Date(booking.createdAt).toLocaleDateString()}`);
        doc.moveDown();

        // Outbound Flight
        doc.fontSize(12).fillColor('#333').text('OUTBOUND FLIGHT', { underline: true });
        doc.fontSize(11).fillColor('#000');
        doc.text(`Flight Number: ${flight.flightNumber}`);
        doc.text(`Airline: ${flight.airline}`);
        doc.text(`Route: ${flight.source} → ${flight.destination}`);
        doc.text(`Departure: ${new Date(flight.departureTime).toLocaleString()}`);
        doc.text(`Arrival: ${new Date(flight.arrivalTime).toLocaleString()}`);
        doc.text(`Class: ${flight.class}`);
        doc.moveDown();

        // Return Flight (if round-trip)
        if (booking.tripType === 'round-trip' && returnFlight) {
            doc.fontSize(12).fillColor('#333').text('RETURN FLIGHT', { underline: true });
            doc.fontSize(11).fillColor('#000');
            doc.text(`Flight Number: ${returnFlight.flightNumber}`);
            doc.text(`Airline: ${returnFlight.airline}`);
            doc.text(`Route: ${returnFlight.source} → ${returnFlight.destination}`);
            doc.text(`Departure: ${new Date(returnFlight.departureTime).toLocaleString()}`);
            doc.text(`Arrival: ${new Date(returnFlight.arrivalTime).toLocaleString()}`);
            doc.text(`Class: ${returnFlight.class}`);
            doc.moveDown();
        }

        // Passenger Details
        doc.fontSize(12).fillColor('#333').text('PASSENGERS', { underline: true });
        doc.fontSize(11).fillColor('#000');
        booking.passengers.forEach((passenger, idx) => {
            doc.text(`${idx + 1}. ${passenger.name} (Age: ${passenger.age})`);
            if (booking.seatNumbers && booking.seatNumbers[idx]) {
                doc.text(`   Seat: ${booking.seatNumbers[idx]}`);
            }
        });
        doc.moveDown();

        // Price Details
        doc.fontSize(12).fillColor('#333').text('PRICE DETAILS', { underline: true });
        doc.fontSize(11).fillColor('#000');
        doc.text(`Price per Passenger: ₹${flight.price}`);
        doc.text(`Number of Passengers: ${booking.passengers.length}`);
        if (booking.tripType === 'round-trip' && returnFlight) {
            doc.text(`Return Flight Cost: ₹${returnFlight.price} per passenger`);
        }
        doc.fontSize(12).fillColor('#d32f2f').text(
            `Total Amount: ₹${booking.totalPrice}`,
            { underline: true }
        );
        doc.moveDown();

        // Payment Status
        doc.fontSize(12).fillColor('#333').text('PAYMENT STATUS', { underline: true });
        doc.fontSize(11).fillColor(booking.paymentStatus === 'paid' ? '#388e3c' : '#f57c00');
        doc.text(`Payment: ${booking.paymentStatus.toUpperCase()}`);
        doc.moveDown();

        // Footer
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();
        doc.fontSize(10).fillColor('#666');
        doc.text('Thank you for booking with TravelEase!', { align: 'center' });
        doc.text('For support, contact: support@travelease.com', { align: 'center' });

        doc.end();
    });
};

module.exports = { generateHotelTicketPDF, generateFlightTicketPDF };