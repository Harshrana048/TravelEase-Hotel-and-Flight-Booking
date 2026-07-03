import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import HotelCard from "./hotel/HotelCard";
import HotelFilters from "./hotel/HotelFilters";
import ReviewForm from "./ReviewForm/ReviewForm";
import FlightCard from "./Flight/FlightCard";
import ProfileSection from "./DashBoard/Profilesection";
import BookingCard from "./DashBoard/BookingCard";
import MyBookings from "./DashBoard/MyBookings";
import WishlistSection from "./DashBoard/WishSection";
import AdminStats from "./Admin/AdminStats";
import BookingManagement from "./Admin/BookingManagement";
import FlightManagement from "./Admin/FlightManagement";
import UserManagement from "./Admin/UserManagement";
import HotelManagement from "./Admin/HotelMangement";
import ReviewModal from "./Flight/ReviewModal";
import HotelReviewBookingModal from "./hotel/HotelReviewModal";

// New admin UI components
import AdminLayout from "./Admin/AdminLayout";
import AdminSidebar from "./Admin/AdminSidebar";
import AdminHeader from "./Admin/AdminHeader";
import StatCard from "./Admin/StatCard";
import EmptyState from "./Admin/EmptyState";
import LoadingSkeleton from "./Admin/LoadingSkeleton";
import ConfirmModal from "./Admin/ConfirmModal";
import NotFound from "../pages/NotFound";

export {
  Navbar, Footer, ProtectedRoute, HotelCard, HotelFilters, ReviewForm, FlightCard,
  ProfileSection, BookingCard, MyBookings, WishlistSection,
  AdminStats, BookingManagement, FlightManagement, UserManagement, HotelManagement,
  ReviewModal, HotelReviewBookingModal,NotFound,
  AdminLayout, AdminSidebar, AdminHeader, StatCard, EmptyState, LoadingSkeleton, ConfirmModal,
};
