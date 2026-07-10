# TravelEase - Hotel & Flight Booking Platform

A complete full-stack booking platform for hotels and flights with real-time availability updates, secure payments, and AI-powered search.

## 🌐 Live Demo

**Frontend:** https://travelease.vercel.app  
**Backend API:** https://travelease-backend.onrender.com

---

## ✨ Features

### User Features
- 🔐 **Authentication** - JWT-based login/register with bcrypt password hashing
- 🏨 **Hotel Search** - Browse, filter, and search hotels by city, price, amenities, rating
- ✈️ **Flight Search** - Search flights with filters for date, route, price, class
- 💳 **Secure Payments** - Razorpay integration for online payments
- 📱 **Real-time Updates** - Socket.io for instant availability updates
- 📅 **Booking Management** - View, cancel, and download booking tickets
- ❤️ **Wishlist** - Save favorite hotels and flights
- 📧 **Email Confirmations** - Automated booking confirmations with PDF attachments
- 🤖 **AI Search** - Natural language hotel search using OpenAI

### Admin Features
- 📊 **Dashboard** - Real-time revenue statistics and booking analytics
- 🏨 **Hotel Management** - Add, edit, delete hotels with inventory management
- ✈️ **Flight Management** - Manage flight inventory and pricing
- 👥 **User Management** - View all users and their activity
- 📈 **Revenue Reports** - Track earnings from hotels and flights

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io-client** - Real-time updates
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service
- **PDFKit** - PDF generation
- **OpenAI** - AI-powered search
- **CORS** - Cross-origin requests

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database

---

## 📋 Installation

### Prerequisites
- Node.js v16+
- MongoDB
- npm or yarn

### Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/travelease.git
cd travelease/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/travelease
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail
EMAIL_FROM=TravelEase <noreply@travelease.com>

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# OpenAI (for AI search)
OPENAI_API_KEY=your_openai_api_key

NODE_ENV=development
EOF

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start development server
npm run dev
```

---

## 🚀 Usage

### User Registration & Login
1. Visit https://travelease.vercel.app
2. Click "Sign up" or "Log in"
3. Create account or login with credentials
4. Optionally login with Google OAuth

### Search Hotels
1. Go to "Hotels" page
2. Browse all hotels or use filters (city, price, rating, amenities)
3. Click "View Details" to see full information
4. Click "Book Now" to proceed with booking

### Search Flights
1. Go to "Flights" page
2. Enter departure/arrival city and date
3. Select one-way or round-trip
4. Choose a flight and click "Book Now"

### Complete Booking

1. Fill in passenger/guest details
2. Review booking summary
3. Click "Proceed to Payment"
4. Complete payment via Razorpay
5. Receive booking confirmation email with PDF

### Manage Bookings
1. Go to "Dashboard"
2. View all your bookings (hotels & flights)
3. Click "Cancel Booking" to cancel (refund initiated)
4. Click "Download PDF" to get booking ticket

### AI Search (Natural Language)
1. On home page, use "🤖 AI Search" box
2. Type natural language like:
   - "Beaches in Goa for ₹50,000, Dec 15-20"
   - "Cheap flights from Mumbai to Delhi on Dec 20"
3. AI extracts filters and shows matching results

---

## 📁 Project Structure

```
TravelEase/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Hotel.model.js
│   │   ├── Flight.model.js
│   │   ├── HotelBooking.model.js
│   │   ├── FlightBooking.model.js
│   │   └── Payment.model.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── hotel.controller.js
│   │   ├── flight.controller.js
│   │   ├── booking.controller.js
│   │   ├── payment.controller.js
│   │   ├── ai.controller.js
│   │   └── wishlist.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── hotel.routes.js
│   │   ├── flight.routes.js
│   │   ├── booking.routes.js
│   │   ├── payment.routes.js
│   │   ├── ai.routes.js
│   │   └── wishlist.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── 404NotFound.js
│   ├── services/
│   │   ├── ai.service.js
│   │   ├── sendEmail.js
│   │   └── generatePDF.js
│   ├── utils/
│   │   ├── seedHotels.js
│   │   └── seedFlights.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── ErrorBoundary.jsx
    │   │   ├── HotelCard.jsx
    │   │   ├── FlightCard.jsx
    │   │   ├── AISearchBox.jsx
    │   │   └── ...
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Hotels.jsx
    │   │   ├── HotelDetail.jsx
    │   │   ├── BookHotel.jsx
    │   │   ├── Flights.jsx
    │   │   ├── FlightDetail.jsx
    │   │   ├── BookFlight.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Admin.jsx
    │   │   ├── PaymentSuccess.jsx
    │   │   └── PaymentFailure.jsx
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── hotelSlice.js
    │   │       ├── flightSlice.js
    │   │       ├── bookingSlice.js
    │   │       ├── dashboardSlice.js
    │   │       └── adminSlice.js
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── socket.js
    │   │   └── ai.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── vite.config.js
    └── package.json
```

---

## 🔑 Key Features Explained

### Real-Time Updates (Socket.io)
When a user books a hotel/flight, all other users viewing that property get instant updates showing reduced availability.

### Secure Payments (Razorpay)
- Booking created as PENDING
- Payment processed via Razorpay
- Only confirmed after successful payment verification
- Automatic refund on booking cancellation

### AI-Powered Search
Uses OpenAI to extract filters from natural language queries, then searches MongoDB for actual results. Faster and cheaper than full AI recommendations.

### Admin Dashboard
- Real-time revenue analytics
- Complete CRUD for hotels and flights
- View all users and bookings
- Search and filter capabilities

---

## 🔐 Security

- ✅ JWT authentication with 7-day expiry
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes
- ✅ CORS enabled
- ✅ Secure payment verification with signatures
- ✅ Email-based booking confirmations

---

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Hotels
- `GET /api/hotels` - Get all hotels with filters
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels` - Create hotel (admin)
- `PUT /api/hotels/:id` - Update hotel (admin)
- `DELETE /api/hotels/:id` - Delete hotel (admin)

### Flights
- `GET /api/flights` - Get all flights with filters
- `GET /api/flights/:id` - Get flight details
- `POST /api/flights` - Create flight (admin)
- `PUT /api/flights/:id` - Update flight (admin)
- `DELETE /api/flights/:id` - Delete flight (admin)

### Bookings
- `POST /api/bookings/hotel` - Book hotel
- `POST /api/bookings/flight` - Book flight
- `GET /api/bookings/my-bookings` - Get user bookings
- `PATCH /api/bookings/cancel/:id` - Cancel booking

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/refund/:paymentId` - Refund booking

### AI Search
- `POST /api/ai/search-hotels` - Natural language hotel search
- `POST /api/ai/search-flights` - Natural language flight search

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove/:id` - Remove from wishlist

---

## 🧪 Testing

### Test Hotel Booking
1. Register/Login
2. Go to Hotels
3. Select a hotel and click "Book Now"
4. Fill details and click "Proceed to Payment"
5. Use Razorpay test mode: Use UPI/Wallet option
6. Payment completes, booking confirmed

### Test Flight Booking
1. Go to Flights
2. Select a flight and click "Book Now"
3. Fill passenger details
4. Complete payment via Razorpay
5. Get confirmation email

### Test Admin Features
1. Login with admin account
2. Go to Admin Panel (only visible to admins)
3. View stats, manage hotels/flights/users

### Test Real-Time Updates
1. Open hotel detail in 2 browser tabs
2. In Tab 1, complete a booking
3. In Tab 2, watch availability update instantly

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
mongodb://localhost:27017/travelease

# Check all environment variables are set
cat .env

# Install missing dependencies
npm install
```

### Payment fails
- Ensure Razorpay keys are correct
- Check NODE_ENV=development for test mode
- Verify webhook URL in Razorpay dashboard

### Emails not sending
- Enable "Less secure apps" for Gmail
- Use app-specific password instead of account password
- Check Nodemailer configuration

### Socket.io not connecting
- Ensure backend URL is correct in frontend
- Check CORS settings in server.js
- Verify Socket.io port (same as Express port)

---

## 📝 Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/travelease
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_password
RAZORPAY_KEY_ID=key_xxx
RAZORPAY_KEY_SECRET=secret_xxx
OPENAI_API_KEY=sk-xxx
NODE_ENV=development
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Set VITE_API_URL to production API URL
```

### Backend (Render)
```bash
# Connect GitHub repo to Render
# Set environment variables in Render dashboard
# Deploy automatically on push
```

### Database (MongoDB Atlas)
```bash
# Create free cluster at mongodb.com
# Get connection string
# Add to MONGO_URI in backend .env
```

---

## 📞 Support

For issues or questions:
1. Check GitHub Issues
2. Review README and documentation
3. Check backend logs: `npm run dev`
4. Check frontend console: Browser DevTools

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Your Name**

- GitHub: https://github.com/yourusername
- LinkedIn: https://linkedin.com/in/yourprofile
- Email: your.email@example.com

---

## 🎯 Future Enhancements

- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multiple payment methods
- [ ] Loyalty rewards program
- [ ] Hotel reviews and ratings system
- [ ] Group booking discounts
- [ ] Travel insurance integration
- [ ] Multi-language support
- [ ] Dark mode UI

---

## 📊 Stats

- ✅ 15+ API endpoints
- ✅ 6+ database models
- ✅ 20+ React components
- ✅ 6+ Redux slices
- ✅ Real-time Socket.io updates
- ✅ Secure Razorpay payments
- ✅ AI-powered search
- ✅ Live in production

---

**Happy Booking! 🎉**
