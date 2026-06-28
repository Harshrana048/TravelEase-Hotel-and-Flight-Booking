import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlices";

function Navbar() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <nav className="bg-primary text-black shadow-lg">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          ✈ TravelEase
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/hotels" className="hover:text-secondary transition">
            Hotels
          </Link>
          <Link to="/flights" className="hover:text-secondary transition">
            Flights
          </Link>

          {token ? (
            <>
              <Link to="/dashboard" className="hover:text-secondary transition">
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="hover:text-secondary transition">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white text-primary px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-secondary transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-primary px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
