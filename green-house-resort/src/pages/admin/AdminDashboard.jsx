import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { Bell, TrendingUp, Users, Calendar, Bed, Star } from "lucide-react";

export default function AdminDashboard() {
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    totalGuests: 0,
    totalRooms: 0,
    pendingReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    // Fetch bookings for stats
    const { data: bookings } = await supabase
      .from("bookings")
      .select("total_price, status");

    // Fetch profiles count
    const { count: guestsCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Fetch rooms count
    const { count: roomsCount } = await supabase
      .from("rooms")
      .select("*", { count: "exact", head: true });

    // Fetch pending reviews
    const { count: reviewsCount } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", false);

    // Calculate stats
    const confirmedBookings =
      bookings?.filter((b) => b.status === "confirmed") || [];
    const totalRevenue = confirmedBookings.reduce(
      (sum, b) => sum + Number(b.total_price),
      0,
    );
    const activeBookings = confirmedBookings.length;

    setStats({
      totalRevenue,
      activeBookings,
      totalGuests: guestsCount || 0,
      totalRooms: roomsCount || 0,
      pendingReviews: reviewsCount || 0,
    });

    // Fetch recent bookings
    const { data: recent } = await supabase
      .from("bookings")
      .select(
        "id, total_price, status, created_at, rooms(name), profiles(full_name)",
      )
      .order("created_at", { ascending: false })
      .limit(5);

    if (recent) setRecentBookings(recent);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-forest-primary mb-8">
        Dashboard Overview
      </h1>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-forest-secondary/20 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-forest-primary/10 rounded-lg text-forest-primary">
            <TrendingUp />
          </div>
          <div>
            <p className="text-sm text-forest-text/60">Total Revenue</p>
            <h3 className="text-2xl font-bold text-forest-text">
              ${stats.totalRevenue.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-forest-secondary/20 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-forest-primary/10 rounded-lg text-forest-primary">
            <Calendar />
          </div>
          <div>
            <p className="text-sm text-forest-text/60">Active Bookings</p>
            <h3 className="text-2xl font-bold text-forest-text">
              {stats.activeBookings}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-forest-secondary/20 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-forest-primary/10 rounded-lg text-forest-primary">
            <Users />
          </div>
          <div>
            <p className="text-sm text-forest-text/60">Total Guests</p>
            <h3 className="text-2xl font-bold text-forest-text">
              {stats.totalGuests}
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-forest-secondary/20 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-forest-primary/10 rounded-lg text-forest-primary">
            <Bed />
          </div>
          <div>
            <p className="text-sm text-forest-text/60">Total Rooms</p>
            <h3 className="text-2xl font-bold text-forest-text">
              {stats.totalRooms}
            </h3>
          </div>
        </div>
      </div>

      {/* --- NOTIFICATIONS PANEL --- */}
      <div className="bg-white rounded-xl shadow-sm border border-forest-secondary/20 overflow-hidden">
        <div className="bg-forest-primary/5 p-4 border-b border-forest-secondary/20 flex items-center gap-2">
          <Bell className="text-forest-primary" size={20} />
          <h2 className="text-lg font-semibold text-forest-primary">
            Recent Notifications
          </h2>
          {stats.pendingReviews > 0 && (
            <span className="ml-auto px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              {stats.pendingReviews} pending reviews
            </span>
          )}
        </div>
        <div className="divide-y divide-forest-secondary/10">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 hover:bg-forest-bg/50 transition flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-forest-text">
                  {booking.status === "confirmed"
                    ? "New booking by"
                    : booking.status === "cancelled"
                      ? "Booking cancelled by"
                      : "Completed booking by"}{" "}
                  <span className="font-bold">
                    {booking.profiles?.full_name || "Guest"}
                  </span>{" "}
                  for{" "}
                  <span className="text-forest-primary">
                    {booking.rooms?.name}
                  </span>
                </p>
                <p className="text-xs text-forest-text/60 mt-1">
                  {new Date(booking.created_at).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-forest-text">
                  ${Number(booking.total_price).toFixed(2)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
          {recentBookings.length === 0 && (
            <div className="p-6 text-center text-forest-text/60">
              No recent notifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
