import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Palmtree, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, error: signInError } = await signIn(email, password);

      if (signInError) {
        // Handle specific error cases
        if (signInError.message.toLowerCase().includes("invalid")) {
          setError("Invalid email or password. Please try again.");
        } else if (signInError.message.toLowerCase().includes("confirmed")) {
          setError("Please check your email and confirm your account first.");
        } else {
          setError(signInError.message);
        }
      } else {
        // Success - navigate based on role
        if (profile?.role === "admin") {
          navigate("/admin");
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-bg py-12 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-forest-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-forest-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <Palmtree className="w-10 h-10 text-forest-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold text-forest-primary">
              Green House Resort
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-forest-secondary/20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-forest-text">
              Welcome Back
            </h1>
            <p className="text-forest-text/60 mt-2">
              Sign in to manage your bookings
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forest-text mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-text/40"
                  size={20}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-forest-secondary/20 rounded-xl focus:ring-2 focus:ring-forest-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-text mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-text/40"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3.5 border border-forest-secondary/20 rounded-xl focus:ring-2 focus:ring-forest-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-forest-text/40 hover:text-forest-text/60"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-forest-primary text-white font-semibold rounded-xl hover:bg-forest-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-forest-text/60">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-forest-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-forest-bg rounded-xl">
            <p className="text-sm text-forest-text/60 text-center">
              Note: Check your email to confirm account after signup.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-forest-text/60 hover:text-forest-primary"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
