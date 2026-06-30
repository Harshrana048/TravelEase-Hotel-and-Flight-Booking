import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navbar, Footer, ProtectedRoute } from "./components/index";
import {
  Home,
  Login,
  Register,
  Flights,
  Dashboard,
  Hotels,
  HotelDetail,
  FlightDetail,
  BookFlight,
  BookHotel,
  PaymentFailure,
  PaymentSuccess,
} from "./pages/index";

function AppContent() {
  const location = useLocation();
  const showShell = location.pathname !== "/login";

  return (
    <div className="min-h-screen flex flex-col">
      {showShell && <Navbar />}

      <Toaster position="top-right" />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Hotels */}
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route
            path="/book-hotel/:id"
            element={
              <ProtectedRoute>
                <BookHotel />
              </ProtectedRoute>
            }
          />
          {/* Flights */}
          <Route path="/flights" element={<Flights />} />
          <Route path="/flights/:id" element={<FlightDetail />} />{" "}
          {/* ✅ Fixed: lowercase */}
          <Route
            path="/book-flight/:id"
            element={
              <ProtectedRoute>
                <BookFlight />
              </ProtectedRoute>
            }
          />
          {/* Payment */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {showShell && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
