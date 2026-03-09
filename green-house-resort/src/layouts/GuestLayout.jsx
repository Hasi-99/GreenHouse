import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppStore } from "../store/useAppStore";
import { Menu, X, Palmtree, User, LogOut, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function GuestLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode, theme } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch theme from database on load
  useEffect(() => {
    const fetchTheme = async () => {
      const { data } = await supabase
        .from("settings")
        .select("active_theme")
        .eq("id", 1)
        .single();
      if (data?.active_theme) {
        useAppStore.getState().setTheme(data.active_theme);
      }
    };
    fetchTheme();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-forest-bg text-forest-text">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-forest-bg/95 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Palmtree className="w-8 h-8 text-forest-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-forest-primary">
              Green House Resort
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-medium transition-colors hover:text-forest-primary ${
                  isActive(link.path) ? "text-forest-primary" : ""
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-forest-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-forest-secondary/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-2 px-4 py-2 bg-forest-primary text-white rounded-lg hover:bg-forest-primary/90 transition"
                >
                  <User size={18} />
                  My Bookings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-forest-text hover:text-red-500 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-forest-primary hover:text-forest-primary/80 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-forest-primary text-white rounded-lg hover:bg-forest-primary/90 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-forest-bg border-t border-forest-secondary/20 shadow-lg">
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-forest-primary/10 text-forest-primary"
                      : "hover:bg-forest-secondary/10"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-forest-secondary/20 my-2" />
              {user ? (
                <>
                  <Link
                    to="/my-bookings"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 bg-forest-primary text-white rounded-lg"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left text-red-500 rounded-lg hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 text-center text-forest-primary rounded-lg border border-forest-primary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 text-center bg-forest-primary text-white rounded-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-forest-primary text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palmtree className="w-8 h-8" />
                <span className="text-xl font-bold">Green House Resort</span>
              </div>
              <p className="text-white/80">
                Experience the tranquility of nature in our eco-friendly forest
                resort.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-white/80 hover:text-white transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-white/80">
                <li>📍 123 Forest Lane, Nature City</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>✉️ info@greenhouse-resort.com</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold mb-4">Newsletter</h4>
              <p className="text-white/80 mb-4">
                Subscribe for exclusive offers and updates.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-lg text-forest-text focus:outline-none focus:ring-2 focus:ring-forest-accent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-forest-accent text-forest-text font-medium rounded-lg hover:bg-forest-accent/90 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>
              © {new Date().getFullYear()} Green House Resort. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
