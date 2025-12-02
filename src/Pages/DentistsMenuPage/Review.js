/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Star, MessageSquare, ThumbsUp, Loader2 } from "lucide-react";
import { useSubmitReviewMutation } from "../../redux/api/reviewApi";

const Review = ({
  doctorId,
  avgRating,
  totalReviews,
  ratingDistribution,
  reviews,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // API Integration
  const [submitReview, { isLoading: isSubmitting }] = useSubmitReviewMutation();

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment");
      return;
    }

    try {
      const reviewData = {
        doctorId,
        rating,
        comment,
        // appointmentId can be passed as a prop if needed
        // appointmentId: appointmentId
      };

      const response = await submitReview(reviewData).unwrap();

      // Reset form
      setRating(0);
      setComment("");
      setShowReviewForm(false);

      alert("Review submitted successfully! Awaiting admin approval.");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert(
        error?.data?.message || "Failed to submit review. Please try again."
      );
    }
  };

  const renderStars = (count, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          size={interactive ? 24 : 18}
          className={`${
            starValue <= (interactive ? hoverRating || rating : count)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          } ${interactive ? "cursor-pointer transition-all" : ""}`}
          onClick={() => interactive && setRating(starValue)}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      );
    });
  };

  const getRatingPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6">
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {parseFloat(avgRating || 0).toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {renderStars(Math.round(parseFloat(avgRating || 0)))}
          </div>
          <p className="text-gray-600 text-sm">
            {totalReviews || 0} total review{totalReviews !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 w-8">
                {star}★
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-400 h-full transition-all duration-300"
                  style={{
                    width: `${getRatingPercentage(
                      ratingDistribution?.[star] || 0
                    )}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">
                {ratingDistribution?.[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="w-full md:w-1/3 border border-cyan-600 hover:bg-cyan-50 transition-all mb-6 flex items-center justify-center gap-2 shadow-md rounded-md py-2 mx-auto mt-10">
          <MessageSquare size={20} />
          Write a Review
        </button>
      )}

      {showReviewForm && (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-cyan-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Share Your Experience
          </h3>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Rate Your Experience
            </label>
            <div className="flex gap-2">{renderStars(rating, true)}</div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 5 && "Excellent! 🌟"}
                {rating === 4 && "Very Good! 😊"}
                {rating === 3 && "Good 👍"}
                {rating === 2 && "Fair 😐"}
                {rating === 1 && "Poor 😞"}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this doctor..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-32 resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="flex-1 bg-cyan-500 text-white py-2.5 rounded-lg font-medium hover:bg-cyan-600 transition-colors shadow-sm disabled:bg-cyan-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
            <button
              onClick={() => {
                setShowReviewForm(false);
                setRating(0);
                setComment("");
              }}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed">
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Your review will be visible after admin approval
          </p>
        </div>
      )}

      {reviews?.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            No reviews yet. Be the first to review!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div
              key={review._id}
              className="border-t border-gray-200 pt-6 hover:bg-gray-50 transition-colors rounded-lg p-4 -m-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.patientId?.profileImage ? (
                    <img
                      src={review.patientId.profileImage}
                      alt={review.patientId.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyan-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-sm">
                      <span className="text-xl font-bold text-white">
                        {review.patientId?.name?.charAt(0).toUpperCase() || "P"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        {review.patientId?.name || "Patient"}
                        {review.isVerifiedPatient && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(review.rating)}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {review.comment}
                  </p>

                  {/* Helpful Button */}
                  <button className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition-colors font-medium">
                    <ThumbsUp size={16} />
                    Helpful
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Review;
