
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {Navbar,Footer,ProtectedRoute} from './components/index'
import {Home,Login,Register,Flights,Dashboard,Hotels,HotelDetail,FlightDetail} from './pages/index'
function App() {
    return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <Toaster position="top-right" />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/Flights/:id" element={<FlightDetail />} />

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

        <Footer />
      </div>
    </BrowserRouter>
  );
  }

export default App
