import { Link } from "react-router-dom";
import {
  ArrowRight,
  TreePine,
  Wifi,
  Coffee,
  Mountain,
  Star,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const fetchApprovedReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (data) setReviews(data);
    setLoading(false);
  };

  const features = [
    {
      icon: <TreePine className="w-8 h-8" />,
      title: "Forest Location",
      description: "Immersed in a lush private forest with nature trails.",
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Free Wi-Fi",
      description: "Stay connected with high-speed internet access.",
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Organic Breakfast",
      description: "Start your day with farm-fresh local produce.",
    },
    {
      icon: <Mountain className="w-8 h-8" />,
      title: "Adventure Activities",
      description: "Guided hikes, bird watching, and more.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Forest Resort"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-text/60 via-forest-text/40 to-forest-bg" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Escape to <span className="text-forest-accent">Nature</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            Experience sustainable luxury in the heart of the forest. Your
            peaceful retreat awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rooms"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-forest-primary hover:bg-forest-primary/90 text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              View Rooms
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl transition-all hover:scale-105"
            >
              Contact Us
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="text-center">
              <p className="text-4xl font-bold text-forest-accent">4</p>
              <p className="text-white/80">Room Types</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-forest-accent">500+</p>
              <p className="text-white/80">Happy Guests</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-forest-accent">4.9</p>
              <p className="text-white/80">Rating</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-forest-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest-primary mb-4">
              Why Choose Us
            </h2>
            <p className="text-forest-text/70 max-w-2xl mx-auto">
              We offer a unique blend of comfort and nature, ensuring your stay
              is both relaxing and memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-forest-secondary/20 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-forest-primary/10 rounded-xl flex items-center justify-center text-forest-primary mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-forest-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-forest-text/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest-primary mb-4">
              Our Accommodations
            </h2>
            <p className="text-forest-text/70 max-w-2xl mx-auto">
              Choose from our carefully designed rooms, each offering a unique
              view of the surrounding forest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Double Room",
                price: 120,
                image:
                  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                capacity: 2,
              },
              {
                name: "Triple Room",
                price: 160,
                image:
                  "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                capacity: 3,
              },
              {
                name: "Family Room",
                price: 250,
                image:
                  "https://images.unsplash.com/photo-1598928506311-c55ez361a17e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                capacity: 5,
              },
              {
                name: "Driver Room",
                price: 50,
                image:
                  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                capacity: 1,
              },
            ].map((room, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-forest-secondary/20 hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-forest-primary">
                    {room.capacity} Guest{room.capacity > 1 ? "s" : ""}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-forest-text mb-2">
                    {room.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-forest-primary">
                      ${room.price}
                      <span className="text-sm font-normal text-forest-text/60">
                        /night
                      </span>
                    </p>
                    <Link
                      to={`/rooms`}
                      className="text-forest-primary hover:text-forest-primary/80 font-medium transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-forest-primary text-forest-primary font-semibold rounded-xl hover:bg-forest-primary hover:text-white transition-all"
            >
              View All Rooms
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-forest-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest-primary mb-4">
              What Our Guests Say
            </h2>
            <p className="text-forest-text/70 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our guests have to
              say about their stay.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading reviews...</div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-forest-secondary/20"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < review.rating
                            ? "text-forest-accent fill-forest-accent"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-forest-text/80 mb-6 italic">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-forest-primary/10 rounded-full flex items-center justify-center text-forest-primary font-bold">
                      {review.guest_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-forest-text">
                        {review.guest_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-forest-text/60">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-8 py-4 bg-forest-primary text-white font-semibold rounded-xl hover:bg-forest-primary/90 transition"
            >
              <Calendar size={20} />
              Book Your Stay
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-forest-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Escape to Nature?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Book your stay today and experience the tranquility of our forest
            retreat.
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-forest-primary font-bold rounded-xl hover:bg-forest-accent transition-all hover:scale-105"
          >
            Book Now
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}
