import {
  TreePine,
  Heart,
  Shield,
  Leaf,
  Coffee,
  Wifi,
  Car,
  UtensilsCrossed,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-forest-bg">
      {/* Hero Banner */}
      <div className="relative py-20 bg-forest-primary">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Forest"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Green House Resort
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Where nature meets luxury in perfect harmony
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-forest-primary mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-forest-text/80 leading-relaxed">
                <p>
                  Founded in 2015, Green House Resort was born from a simple
                  vision: create a sanctuary where guests could escape the chaos
                  of city life and reconnect with nature without sacrificing
                  comfort.
                </p>
                <p>
                  Nestled in the heart of a pristine private forest, our resort
                  spans 50 acres of untouched wilderness, offering breathtaking
                  views, serene walking trails, and accommodations that blend
                  seamlessly with the natural environment.
                </p>
                <p>
                  We believe in sustainable tourism. Every aspect of our resort
                  is designed with environmental responsibility in mind, from
                  solar-powered amenities to organic farm-to-table dining
                  experiences.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Our Resort"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <p className="text-4xl font-bold text-forest-primary">15+</p>
                <p className="text-forest-text/60">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-forest-primary mb-4">
              Our Values
            </h2>
            <p className="text-forest-text/70 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <TreePine className="w-8 h-8" />,
                title: "Sustainability",
                desc: "Eco-friendly practices in every aspect of our operations",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Hospitality",
                desc: "Warm, personalized service that makes you feel at home",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Safety",
                desc: "Your peace of mind is our top priority",
              },
              {
                icon: <Leaf className="w-8 h-8" />,
                title: "Nature",
                desc: "Preserving the beauty of our forest home",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-forest-bg hover:bg-forest-primary/5 transition-colors"
              >
                <div className="w-16 h-16 bg-forest-primary/10 rounded-full flex items-center justify-center text-forest-primary mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-forest-text mb-2">
                  {value.title}
                </h3>
                <p className="text-forest-text/70">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 bg-forest-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-forest-primary mb-4">
              Resort Amenities
            </h2>
            <p className="text-forest-text/70 max-w-2xl mx-auto">
              Everything you need for a comfortable and enjoyable stay
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Wifi className="w-6 h-6" />, name: "Free Wi-Fi" },
              {
                icon: <Coffee className="w-6 h-6" />,
                name: "Organic Breakfast",
              },
              { icon: <Car className="w-6 h-6" />, name: "Free Parking" },
              {
                icon: <UtensilsCrossed className="w-6 h-6" />,
                name: "Restaurant",
              },
            ].map((amenity, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-forest-secondary/20 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-forest-primary/10 rounded-lg flex items-center justify-center text-forest-primary">
                  {amenity.icon}
                </div>
                <span className="font-medium text-forest-text">
                  {amenity.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-forest-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Experience Nature's Embrace
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Book your stay today and discover why Green House Resort is the
            perfect escape from the everyday.
          </p>
          <a
            href="/rooms"
            className="inline-block px-8 py-4 bg-white text-forest-primary font-bold rounded-xl hover:bg-forest-accent transition-all"
          >
            Book Your Stay
          </a>
        </div>
      </section>
    </div>
  );
}
