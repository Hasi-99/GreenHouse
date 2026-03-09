import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { Star, Check, X, Trash2, MessageSquare } from "lucide-react";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // 'pending', 'approved', 'all'

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    let query = supabase
      .from("reviews")
      .select(
        `
        *,
        rooms (name)
      `,
      )
      .order("created_at", { ascending: false });

    if (filter === "pending") {
      query = query.eq("is_approved", false);
    } else if (filter === "approved") {
      query = query.eq("is_approved", true);
    }

    const { data, error } = await query;

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const handleApprove = async (reviewId) => {
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: true })
      .eq("id", reviewId);

    if (!error) {
      fetchReviews();
    }
  };

  const handleReject = async (reviewId) => {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (!error) {
      fetchReviews();
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to permanently delete this review?"))
      return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (!error) {
      fetchReviews();
    }
  };

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-forest-primary">
            Reviews & Testimonials
          </h1>
          <p className="text-forest-text/60 mt-1">
            Manage guest reviews and testimonials
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "pending", label: "Pending Review", count: pendingCount },
          { id: "approved", label: "Approved" },
          { id: "all", label: "All Reviews" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab.id
                ? "bg-forest-primary text-white"
                : "bg-white text-forest-text hover:bg-forest-primary/10"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-forest-text/60">
            Loading reviews...
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white p-6 rounded-xl border transition-all ${
                review.is_approved
                  ? "border-forest-secondary/20"
                  : "border-yellow-200 bg-yellow-50/50"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-forest-text">
                          {review.guest_name}
                        </h3>
                        {!review.is_approved && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            Pending Review
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-forest-text/60">
                        {review.rooms?.name && (
                          <span className="text-forest-primary">
                            {review.rooms.name}
                          </span>
                        )}
                        <span>•</span>
                        <span>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={
                            star <= review.rating
                              ? "text-forest-accent fill-forest-accent"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-forest-text/80">{review.comment}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:flex-col">
                  {!review.is_approved && (
                    <>
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Approve"
                      >
                        <Check size={18} />
                        <span className="text-sm">Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Reject"
                      >
                        <X size={18} />
                        <span className="text-sm">Reject</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-forest-secondary/20">
            <MessageSquare className="w-12 h-12 text-forest-text/30 mx-auto mb-4" />
            <p className="text-forest-text/60">
              {filter === "pending"
                ? "No pending reviews to display."
                : "No reviews found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
