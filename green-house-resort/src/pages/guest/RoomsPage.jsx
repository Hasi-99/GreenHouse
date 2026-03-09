import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { Users, Wifi, Coffee, Car, TreePine, ArrowRight } from "lucide-react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCapacity, setSelectedCapacity] = useState("all");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("status", "available")
      .order("price", { ascending: true });

    if (!error && data) {
      setRooms(data);
    }
    setLoading(false);
  };

  const getCapacityIcon = (capacity) => {
    if (capacity === 1) return <Car size={16} />;
    if (capacity === 2) return <Users size={16} />;
    return <Users size={16} />;
  };

  const filteredRooms =
    selectedCapacity === "all"
      ? rooms
      : rooms.filter((room) => room.capacity === parseInt(selectedCapacity));

  const roomImages = {
    "Double Room":
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "Triple Room":
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "Family Room":
      "https://images.unsplash.com/photo-1598928506311-c55ez361a17e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "Driver Room":
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  };

  return (
    <div className="min-h-screen bg-forest-bg">
      {/* Hero Banner */}
      <div className="relative py-20 bg-forest-primary">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Rooms"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Rooms & Suites
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover your perfect retreat in the heart of the forest. Each room
            is designed for comfort and connection with nature.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="text-forest-text/70 font-medium">
            Filter by capacity:
          </span>
          {[
            { value: "all", label: "All Rooms" },
            { value: "1", label: "1 Guest (Driver)" },
            { value: "2", label: "2 Guests (Double)" },
            { value: "3", label: "3 Guests (Triple)" },
            { value: "5", label: "5+ Guests (Family)" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedCapacity(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCapacity === filter.value
                  ? "bg-forest-primary text-white"
                  : "bg-white text-forest-text hover:bg-forest-primary/10"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-forest-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-forest-text/60">Loading rooms...</p>
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-forest-secondary/20 hover:shadow-xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={
                      roomImages[room.name] ||
                      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    }
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-forest-primary text-white px-4 py-1.5 rounded-full text-sm font-medium">
                    {room.status === "available"
                      ? "Available"
                      : "Under Maintenance"}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-forest-primary flex items-center gap-1.5">
                    {getCapacityIcon(room.capacity)}
                    {room.capacity} Guest{room.capacity > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-forest-text">
                        {room.name}
                      </h3>
                      <p className="text-forest-text/60 mt-1 line-clamp-2">
                        {room.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-forest-primary">
                        ${room.price}
                      </p>
                      <p className="text-sm text-forest-text/60">per night</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.features &&
                      room.features.slice(0, 4).map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-forest-bg text-forest-text/70 text-sm rounded-full flex items-center gap-1"
                        >
                          {feature.includes("Wi-Fi") && <Wifi size={12} />}
                          {feature.includes("Breakfast") && (
                            <Coffee size={12} />
                          )}
                          {feature.includes("View") && <TreePine size={12} />}
                          {feature}
                        </span>
                      ))}
                    {(!room.features || room.features.length === 0) && (
                      <>
                        <span className="px-3 py-1 bg-forest-bg text-forest-text/70 text-sm rounded-full flex items-center gap-1">
                          <Wifi size={12} /> Free Wi-Fi
                        </span>
                        <span className="px-3 py-1 bg-forest-bg text-forest-text/70 text-sm rounded-full">
                          Private Bathroom
                        </span>
                      </>
                    )}
                  </div>

                  <Link
                    to={`/rooms/${room.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-4 bg-forest-primary text-white font-semibold rounded-xl hover:bg-forest-primary/90 transition-all group/btn"
                  >
                    View Details & Book
                    <ArrowRight
                      size={20}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-forest-text/60 text-lg">
              No rooms available for the selected criteria.
            </p>
            <button
              onClick={() => setSelectedCapacity("all")}
              className="mt-4 text-forest-primary hover:underline"
            >
              View all rooms
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
