import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../services/supabase";
import {
  Calendar,
  Clock,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: { pathname: "/my-bookings" } } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        rooms (name, price, images)
      `,
      )
      .eq("guest_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      if (error) throw error;

      // Send cancellation email
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking && user) {
        await supabase.functions.invoke("send-email", {
          body: {
            action: "cancellation",
            guestEmail: user.email,
            guestName: profile?.full_name || "Valued Guest",
            roomName: booking.rooms?.name,
            price: booking.total_price.toFixed(2),
            checkIn: booking.check_in,
            checkOut: booking.check_out,
          },
        });
      }

      alert(
        "Booking cancelled successfully. A confirmation email has been sent.",
      );
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error.message);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      completed: "bg-gray-100 text-gray-700",
    };
    const icons = {
      confirmed: <CheckCircle size={14} />,
      cancelled: <XCircle size={14} />,
      completed: <CheckCircle size={14} />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-forest-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-forest-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-forest-text/60">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-bg py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-forest-text/70 hover:text-forest-primary transition-colors mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-forest-text">My Bookings</h1>
          <p className="text-forest-text/60 mt-2">
            Manage your reservations and view booking history
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-sm border border-forest-secondary/20 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Room Image */}
                  <div className="md:w-64 h-48 md:h-auto relative">
                    <img
                      src={
                        booking.rooms?.images?.[0] ||
                        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      }
                      alt={booking.rooms?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-forest-text">
                            {booking.rooms?.name}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-forest-text/70">
                            <Calendar size={16} />
                            <div>
                              <p className="text-xs text-forest-text/50">
                                Check-in
                              </p>
                              <p className="font-medium">
                                {format(
                                  new Date(booking.check_in),
                                  "MMM dd, yyyy",
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-forest-text/70">
                            <Calendar size={16} />
                            <div>
                              <p className="text-xs text-forest-text/50">
                                Check-out
                              </p>
                              <p className="font-medium">
                                {format(
                                  new Date(booking.check_out),
                                  "MMM dd, yyyy",
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-forest-text/70">
                            <Clock size={16} />
                            <div>
                              <p className="text-xs text-forest-text/50">
                                Booked On
                              </p>
                              <p className="font-medium">
                                {format(
                                  new Date(booking.created_at),
                                  "MMM dd, yyyy",
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-forest-text/70">
                            <span className="text-lg font-bold text-forest-primary">
                              ${booking.total_price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Add-ons */}
                        {booking.add_ons && booking.add_ons.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-forest-secondary/10">
                            <p className="text-sm font-medium text-forest-text mb-2">
                              Add-ons:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {booking.add_ons.map((addOn, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-forest-primary/10 text-forest-primary text-sm rounded-full"
                                >
                                  {addOn.item} (+${addOn.price})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {cancellingId === booking.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <X size={16} />
                                Cancel Booking
                              </>
                            )}
                          </button>
                        )}
                        {booking.status === "cancelled" && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg">
                            <AlertTriangle size={16} />
                            Cancelled
                          </div>
                        )}
                        {booking.status === "completed" && (
                          <Link
                            to={`/rooms/${booking.room_id}`}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-forest-primary text-white rounded-lg hover:bg-forest-primary/90 transition-colors"
                          >
                            Book Again
                            <ArrowRight size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-forest-secondary/20">
            <div className="w-20 h-20 bg-forest-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-forest-primary" />
            </div>
            <h2 className="text-xl font-bold text-forest-text mb-2">
              No Bookings Yet
            </h2>
            <p className="text-forest-text/60 mb-6">
              You haven't made any reservations yet. Start planning your forest
              getaway!
            </p>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest-primary text-white font-semibold rounded-xl hover:bg-forest-primary/90 transition-all"
            >
              Browse Rooms
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
