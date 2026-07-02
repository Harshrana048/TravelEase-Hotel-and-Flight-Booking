import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlices";
import { useEffect } from "react";

function Navbar() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // ✅ BUILD navItems dynamically based on user role
  const navItems = [
    { label: "Home", to: "/" },
    { label: "Hotels", to: "/hotels" },
    { label: "Flights", to: "/flights" },
    ...(token && user?.role === 'user' ? [{ label: "Dashboard", to: "/dashboard" }] : []),
    ...(token && user?.role === 'admin' ? [{ label: "Admin Panel", to: "/admin" }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-10 transition-all duration-300">
      <div
        className={`mx-auto max-w-7xl rounded-2xl px-6 py-3.5 transition-all duration-300 ${
          scrolled
            ? "bg-white/85 backdrop-blur-xl shadow-lg shadow-slate-200/60 border border-white/60"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <span className="text-2xl">✈</span>
            <span>TravelEase</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.to)
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                } ${
                  // ✅ Highlight admin link in yellow
                  item.label === "Admin Panel" && isActive(item.to)
                    ? "text-yellow-600 bg-yellow-50"
                    : item.label === "Admin Panel"
                    ? "text-yellow-600 hover:bg-yellow-50"
                    : ""
                }`}
              >
                {item.label}
                {/* Active dot indicator */}
                {isActive(item.to) && (
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      item.label === "Admin Panel" ? "bg-yellow-600" : "bg-blue-600"
                    }`}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {token && user && (
              <span className="text-sm text-slate-600 mr-2">
                {user.name}
              </span>
            )}
            {token ? (
              <button
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-700 active:scale-95"
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-200 active:scale-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="h-5 w-5 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-3 border-t border-slate-100 pt-4 pb-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive(item.to)
                    ? item.label === "Admin Panel"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {isActive(item.to) && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                      item.label === "Admin Panel" ? "bg-yellow-600" : "bg-blue-600"
                    }`}
                  />
                )}
                {item.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-100 space-y-2">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-700 active:scale-[0.98]"
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;