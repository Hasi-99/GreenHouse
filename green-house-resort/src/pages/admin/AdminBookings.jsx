import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import {
  Search,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Download,
} from "lucide-react";
import { format } from "date-fns";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [rooms, setRooms] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        rooms (name),
        profiles (full_name, email, phone)
      `,
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const fetchRooms = async () => {
    const { data } = await supabase.from("rooms").select("id, name");
    if (data) setRooms(data);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error.message);
      alert("Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const guestName = booking.profiles?.full_name?.toLowerCase() || "";
    const guestEmail = booking.profiles?.email?.toLowerCase() || "";
    const roomName = booking.rooms?.name?.toLowerCase() || "";

    if (
      searchTerm &&
      !guestName.includes(searchLower) &&
      !guestEmail.includes(searchLower) &&
      !roomName.includes(searchLower)
    ) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && booking.status !== statusFilter) {
      return false;
    }

    // Room filter
    if (roomFilter !== "all" && booking.room_id !== roomFilter) {
      return false;
    }

    // Date filter
    if (dateFilter !== "all") {
      const bookingDate = new Date(booking.created_at);
      const now = new Date();

      if (dateFilter === "today") {
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        if (bookingDate < today) return false;
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (bookingDate < weekAgo) return false;
      } else if (dateFilter === "month") {
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
        );
        if (bookingDate < monthAgo) return false;
      }
    }

    return true;
  });

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      completed: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + Number(b.total_price), 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-forest-primary">
            Bookings Management
          </h1>
          <p className="text-forest-text/60 mt-1">
            View and manage all guest reservations
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-forest-primary text-white rounded-lg hover:bg-forest-primary/90 transition">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-forest-secondary/20">
          <p className="text-sm text-forest-text/60">Total Bookings</p>
          <p className="text-2xl font-bold text-forest-text">
            {bookings.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-forest-secondary/20">
          <p className="text-sm text-forest-text/60">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">
            {bookings.filter((b) => b.status === "confirmed").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-forest-secondary/20">
          <p className="text-sm text-forest-text/60">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">
            {bookings.filter((b) => b.status === "cancelled").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-forest-secondary/20">
          <p className="text-sm text-forest-text/60">Total Revenue</p>
          <p className="text-2xl font-bold text-forest-primary">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-forest-secondary/20 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-text/40"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by guest name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-forest-secondary/20 rounded-lg focus:ring-2 focus:ring-forest-primary focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-forest-secondary/20 rounded-lg focus:ring-2 focus:ring-forest-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          {/* Room Filter */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-4 py-2 border border-forest-secondary/20 rounded-lg focus:ring-2 focus:ring-forest-primary focus:border-transparent"
          >
            <option value="all">All Rooms</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-forest-secondary/20 rounded-lg focus:ring-2 focus:ring-forest-primary focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-forest-secondary/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-forest-bg">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-text">
                  Guest
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-text">
                  Room
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-text">
                  Check-in / Check-out
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-text">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-text">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-text">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-forest-text">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-secondary/10">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-forest-text/60"
                  >
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-forest-bg/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-forest-text">
                          {booking.profiles?.full_name || "Unknown"}
                        </p>
                        <p className="text-sm text-forest-text/60">
                          {booking.profiles?.email || "No email"}
                        </p>
                        <p className="text-sm text-forest-text/60">
                          {booking.profiles?.phone || "No phone"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-forest-text">
                        {booking.rooms?.name || "Unknown Room"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-forest-text">
                          <Calendar size={14} className="inline mr-1" />
                          {format(new Date(booking.check_in), "MMM dd")} -{" "}
                          {format(new Date(booking.check_out), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-forest-primary">
                        ${Number(booking.total_price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-forest-text/60">
                        {format(new Date(booking.created_at), "MMM dd, yyyy")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === "confirmed" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking.id, "completed")
                              }
                              disabled={updatingId === booking.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Mark as Completed"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking.id, "cancelled")
                              }
                              disabled={updatingId === booking.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Cancel Booking"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {booking.status === "cancelled" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking.id, "confirmed")
                            }
                            disabled={updatingId === booking.id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Revert to Confirmed"
                          >
                            <Clock size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-forest-text/60"
                  >
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
