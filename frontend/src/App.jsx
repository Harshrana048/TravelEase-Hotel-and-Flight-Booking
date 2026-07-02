import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navbar, Footer, ProtectedRoute } from "./components/index";
import {
  Home,
  Login,
  Register,
  AboutUs,
  Careers,
  HelpCenter,
  Contact,
  PrivacyPolicy,
  TermsOfService,
  CookiesPolicy,
  LegalDisclaimer,
  Flights,
  Dashboard,
  Hotels,
  HotelDetail,
  FlightDetail,
  BookFlight,
  BookHotel,
  PaymentFailure,
  PaymentSuccess,
  Admin,
} from "./pages/index";

function AppContent() {
  const location = useLocation();
  const showShell =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <div className="min-h-screen flex flex-col">
      {showShell && <Navbar />}

      <Toaster position="top-right" />

      <main className="flex-1">
        <Routes>
          {/* Core */}
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
          <Route path="/flights/:id" element={<FlightDetail />} />
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
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Company */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<HelpCenter />} />

          {/* Legal */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route path="/legal-disclaimer" element={<LegalDisclaimer />} />
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
