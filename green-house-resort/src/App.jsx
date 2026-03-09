import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "./store/useAppStore";
import AuthProvider from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import GuestLayout from "./layouts/GuestLayout";
import AdminLayout from "./layouts/AdminLayout";

// Guest Pages
import Home from "./pages/guest/Home";
import RoomsPage from "./pages/guest/RoomsPage";
import RoomDetail from "./pages/guest/RoomDetail";
import Login from "./pages/guest/Login";
import Signup from "./pages/guest/Signup";
import MyBookings from "./pages/guest/MyBookings";
import About from "./pages/guest/About";
import Contact from "./pages/guest/Contact";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import AdminBookings from "./pages/admin/AdminBookings";
import ManageReviews from "./pages/admin/ManageReviews";
import Settings from "./pages/admin/Settings";

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-bg">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-forest-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-forest-text/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Theme Provider Component
function ThemeProvider({ children }) {
  const { theme, isDarkMode } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    root.className = "";
    root.classList.add(theme);
    if (isDarkMode) root.classList.add("dark");
  }, [theme, isDarkMode]);

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Guest Routes */}
            <Route path="/" element={<GuestLayout />}>
              <Route index element={<Home />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="rooms/:id" element={<RoomDetail />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route
                path="my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="rooms" element={<ManageRooms />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="reviews" element={<ManageReviews />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
