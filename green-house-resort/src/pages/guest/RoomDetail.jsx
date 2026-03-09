import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  Wifi,
  Coffee,
  TreePine,
  ArrowLeft,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchRoomDetails();
    fetchAddOns();
  }, [id]);

  const fetchRoomDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setRoom(data);
    }
    setLoading(false);
  };

  const fetchAddOns = async () => {
    const { data } = await supabase
      .from("add_ons")
      .select("*")
      .eq("is_active", true);

    if (data) setAddOns(data);
  };

  const defaultImages = {
    "Double Room": [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ],
    "Triple Room": [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ],
    "Family Room": [
      "https://images.unsplash.com/photo-1598928506311-c55ez361a17e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ],
    "Driver Room": [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ],
  };

  const getImages = () => {
    if (room?.images && room.images.length > 0) return room.images;
    return defaultImages[room?.name] || defaultImages["Double Room"];
  };

  const images = getImages();

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-forest-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-forest-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-forest-text/60">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-forest-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-forest-text/60 text-lg mb-4">Room not found</p>
          <Link to="/rooms" className="text-forest-primary hover:underline">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-bg pb-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-forest-text/70 hover:text-forest-primary transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Rooms
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-forest-secondary/20">
              <div
                className="relative h-96 cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={images[currentImageIndex]}
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium">
                    Click to enlarge
                  </span>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-forest-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-forest-secondary/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-forest-text mb-2">
                    {room.name}
                  </h1>
                  <div className="flex items-center gap-4 text-forest-text/70">
                    <span className="flex items-center gap-1.5">
                      <Users size={18} />
                      Up to {room.capacity} Guest{room.capacity > 1 ? "s" : ""}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        room.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {room.status === "available"
                        ? "Available"
                        : "Under Maintenance"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-forest-primary">
                    ${room.price}
                  </p>
                  <p className="text-forest-text/60">per night</p>
                </div>
              </div>

              <div className="border-t border-forest-secondary/20 pt-6">
                <h2 className="text-xl font-bold text-forest-text mb-4">
                  Description
                </h2>
                <p className="text-forest-text/80 leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div className="border-t border-forest-secondary/20 pt-6 mt-6">
                <h2 className="text-xl font-bold text-forest-text mb-4">
                  Room Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.features && room.features.length > 0 ? (
                    room.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-forest-text/80"
                      >
                        <div className="w-2 h-2 bg-forest-primary rounded-full" />
                        {feature}
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-forest-text/80">
                        <Wifi size={16} /> Free High-Speed Wi-Fi
                      </div>
                      <div className="flex items-center gap-2 text-forest-text/80">
                        <Coffee size={16} /> Coffee Maker
                      </div>
                      <div className="flex items-center gap-2 text-forest-text/80">
                        <TreePine size={16} /> Forest View
                      </div>
                      <div className="flex items-center gap-2 text-forest-text/80">
                        Private Bathroom
                      </div>
                      <div className="flex items-center gap-2 text-forest-text/80">
                        Air Conditioning
                      </div>
                      <div className="flex items-center gap-2 text-forest-text/80">
                        Flat Screen TV
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-forest-secondary/20">
              <h2 className="text-xl font-bold text-forest-text mb-6">
                Guest Reviews
              </h2>
              <div className="space-y-6">
                {[
                  {
                    name: "Sarah M.",
                    rating: 5,
                    comment:
                      "Absolutely loved our stay! The forest views were breathtaking and the room was spotless.",
                    date: "2 weeks ago",
                  },
                  {
                    name: "John D.",
                    rating: 5,
                    comment:
                      "Perfect getaway. The staff was incredibly friendly and the nature walk guide was amazing!",
                    date: "1 month ago",
                  },
                ].map((review, index) => (
                  <div
                    key={index}
                    className="border-b border-forest-secondary/10 pb-6 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-forest-primary/10 rounded-full flex items-center justify-center text-forest-primary font-bold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-forest-text">
                            {review.name}
                          </p>
                          <p className="text-sm text-forest-text/60">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? "text-forest-accent fill-forest-accent"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-forest-text/80 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-forest-secondary/20 sticky top-24">
              <h2 className="text-xl font-bold text-forest-text mb-6">
                Book This Room
              </h2>
              <BookingForm room={room} addOns={addOns} />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={32} />
          </button>

          <button
            className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={prevImage}
          >
            <ChevronLeft size={32} />
          </button>

          <img
            src={images[currentImageIndex]}
            alt={`${room.name} - Image ${currentImageIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={nextImage}
          >
            <ChevronRight size={32} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

// Booking Form Component
function BookingForm({ room, addOns }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(room?.price || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const nights =
      checkIn && checkOut
        ? Math.ceil(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
          )
        : 0;
    const addOnsTotal = selectedAddOns.reduce((sum, id) => {
      const addOn = addOns.find((a) => a.id === id);
      return sum + (addOn?.price || 0);
    }, 0);
    setTotalPrice((room?.price || 0) * nights + addOnsTotal);
  }, [checkIn, checkOut, selectedAddOns, room?.price, addOns]);

  const toggleAddOn = (addOnId) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId],
    );
  };

  const handleBookRoom = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedAddOnsData = selectedAddOns.map((id) => {
        const addOn = addOns.find((a) => a.id === id);
        return { item: addOn.name, price: addOn.price };
      });

      const { error } = await supabase.from("bookings").insert([
        {
          guest_id: user.id,
          room_id: room.id,
          check_in: checkIn,
          check_out: checkOut,
          total_price: totalPrice,
          add_ons: selectedAddOnsData,
          status: "confirmed",
        },
      ]);

      if (error) throw error;

      await supabase.functions.invoke("send-email", {
        body: {
          action: "booking",
          guestEmail: user.email,
          guestName: user.user_metadata?.full_name || "Valued Guest",
          roomName: room.name,
          price: totalPrice.toFixed(2),
          checkIn,
          checkOut,
        },
      });

      alert("Booking successful! A confirmation email has been sent.");
      navigate("/my-bookings");
    } catch (error) {
      console.error("Error booking room:", error.message);
      alert("Failed to book the room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
        )
      : 0;

  return (
    <form onSubmit={handleBookRoom} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-forest-text mb-2">
          Check-in Date
        </label>
        <input
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full px-4 py-3 border border-forest-secondary/20 rounded-xl focus:ring-2 focus:ring-forest-primary focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-forest-text mb-2">
          Check-out Date
        </label>
        <input
          type="date"
          required
          min={checkIn || new Date().toISOString().split("T")[0]}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full px-4 py-3 border border-forest-secondary/20 rounded-xl focus:ring-2 focus:ring-forest-primary focus:border-transparent"
        />
      </div>

      {addOns.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-forest-text mb-2">
            Optional Add-ons
          </label>
          <div className="space-y-2">
            {addOns.map((addOn) => (
              <label
                key={addOn.id}
                className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${selectedAddOns.includes(addOn.id) ? "border-forest-primary bg-forest-primary/5" : "border-forest-secondary/20 hover:border-forest-primary/50"}`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addOn.id)}
                    onChange={() => toggleAddOn(addOn.id)}
                    className="w-4 h-4 text-forest-primary rounded focus:ring-forest-primary"
                  />
                  <div>
                    <p className="font-medium text-forest-text text-sm">
                      {addOn.name}
                    </p>
                    <p className="text-xs text-forest-text/60">
                      {addOn.description}
                    </p>
                  </div>
                </div>
                <span className="text-forest-primary font-semibold">
                  +${addOn.price}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {nights > 0 && (
        <div className="bg-forest-bg p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-forest-text/80">
            <span>
              ${room.price} x {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>${(room.price * nights).toFixed(2)}</span>
          </div>
          {selectedAddOns.length > 0 && (
            <div className="flex justify-between text-forest-text/80">
              <span>Add-ons</span>
              <span>${(totalPrice - room.price * nights).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-forest-secondary/20 pt-2 flex justify-between font-bold text-forest-text">
            <span>Total</span>
            <span className="text-forest-primary">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !checkIn || !checkOut}
        className="w-full py-4 bg-forest-primary text-white font-semibold rounded-xl hover:bg-forest-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Booking..." : user ? "Book Now" : "Login to Book"}
      </button>

      {!user && (
        <p className="text-center text-sm text-forest-text/60">
          <Link to="/login" className="text-forest-primary hover:underline">
            Login
          </Link>{" "}
          to complete your booking
        </p>
      )}
    </form>
  );
}
