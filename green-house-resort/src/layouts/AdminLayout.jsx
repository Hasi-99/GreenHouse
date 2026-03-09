import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bed,
  CalendarCheck,
  Settings,
  Star,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-forest-bg">
      {/* Left Navigation Bar */}
      <aside className="w-64 bg-forest-primary text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">Forest Admin</h2>
        <nav className="flex-1 space-y-2">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            to="/admin/rooms"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <Bed size={20} /> Manage Rooms
          </Link>
          <Link
            to="/admin/bookings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <CalendarCheck size={20} /> Bookings
          </Link>
          <Link
            to="/admin/reviews"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <Star size={20} /> Reviews
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <Settings size={20} /> Settings
          </Link>
        </nav>

        {/* User Info & Logout */}
        <div className="pt-6 border-t border-white/20 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="font-bold">
                {profile?.full_name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {profile?.full_name || "Admin"}
              </p>
              <p className="text-xs text-white/60 truncate">
                {profile?.email || "admin@greenhouse.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-100 transition"
          >
            <LogOut size={18} /> Sign Out
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-4 py-2 mt-2 rounded-lg hover:bg-white/10 transition"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
