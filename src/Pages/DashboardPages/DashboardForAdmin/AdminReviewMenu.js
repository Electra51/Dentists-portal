import React, { useState } from "react";
import {
  Star,
  Check,
  X,
  Clock,
  Search,
  Filter,
  Eye,
  User,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useGetAllReviewsQuery,
  useModerateReviewMutation,
} from "../../../redux/api/reviewApi";

const AdminReviewMenu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 20;

  const { data, isLoading, refetch } = useGetAllReviewsQuery({
    status: filterStatus,
    page: currentPage,
    limit: reviewsPerPage,
  });

  const [moderateReview, { isLoading: isModerating }] =
    useModerateReviewMutation();

  const reviews = data?.reviews || [];
  const stats = data?.stats || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
  };

  // handle approve/reject
  const handleModerate = async (reviewId, status) => {
    const actionText = status === "approved" ? "approve" : "reject";
    if (
      !window.confirm(`Are you sure you want to ${actionText} this review?`)
    ) {
      return;
    }

    try {
      await moderateReview({ reviewId, status }).unwrap();
      alert(`Review ${status} successfully!`);
      setSelectedReview(null);
      refetch();
    } catch (error) {
      console.error("Failed to moderate review:", error);
      alert(error?.data?.message || `Failed to ${actionText} review`);
    }
  };

  // filter reviews
  const filteredReviews = reviews.filter((review) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      review.patient?.name?.toLowerCase().includes(searchLower) ||
      review.doctor?.name?.toLowerCase().includes(searchLower) ||
      review.comment?.toLowerCase().includes(searchLower)
    );
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };

    const icons = {
      pending: <Clock size={14} />,
      approved: <Check size={14} />,
      rejected: <X size={14} />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // handle status
  const handleStatusFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
    setCurrentPage(1);
  };

  // pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reviews & Feedback Management
          </h1>
          <p className="text-gray-600">
            Review and moderate patient feedback for doctors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <MessageSquare size={32} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
              <Clock size={32} className="text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approved}
                </p>
              </div>
              <Check size={32} className="text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rejected}
                </p>
              </div>
              <X size={32} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by patient, doctor, or comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No reviews found</p>
              {searchTerm && (
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Patient Avatar */}
                      <div className="flex-shrink-0">
                        {review.patient?.image ? (
                          <img
                            src={review.patient.image}
                            alt={review.patient.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                            <User size={24} className="text-white" />
                          </div>
                        )}
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              {review.patient?.name || "Unknown Patient"}
                              {review.isVerifiedPatient && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  ✓ Verified
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Review for: Dr. {review.doctor?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Calendar size={12} />
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                          {getStatusBadge(review.status)}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 ml-2">
                            {review.rating}/5
                          </span>
                        </div>

                        {/* Comment */}
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {review.comment}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          {review.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleModerate(review._id, "approved")
                                }
                                disabled={isModerating}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed">
                                <Check size={16} />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleModerate(review._id, "rejected")
                                }
                                disabled={isModerating}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed">
                                <X size={16} />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedReview(review)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                            <Eye size={16} />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * reviewsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * reviewsPerPage,
                        pagination.totalReviews
                      )}{" "}
                      of {pagination.totalReviews} reviews
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                      <div className="flex items-center gap-1">
                        {[...Array(pagination.totalPages)].map((_, index) => {
                          const page = index + 1;
                          // Show first, last, current, and adjacent pages
                          if (
                            page === 1 ||
                            page === pagination.totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 rounded-lg transition-colors ${
                                  page === currentPage
                                    ? "bg-cyan-500 text-white"
                                    : "border border-gray-300 hover:bg-gray-100"
                                }`}>
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span key={page} className="px-2">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Review Details
                </h2>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Patient</p>
                    <p className="font-semibold text-gray-900">
                      {selectedReview.patient?.name || "Unknown"}
                    </p>
                    {selectedReview.patient?.email && (
                      <p className="text-xs text-gray-500">
                        {selectedReview.patient.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Doctor</p>
                    <p className="font-semibold text-gray-900">
                      Dr. {selectedReview.doctor?.name || "Unknown"}
                    </p>
                    {selectedReview.doctor?.speciality && (
                      <p className="text-xs text-gray-500">
                        {selectedReview.doctor.speciality}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      {renderStars(selectedReview.rating)}
                      <span className="text-sm text-gray-600 ml-2">
                        {selectedReview.rating}/5
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    {getStatusBadge(selectedReview.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Verified Patient
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selectedReview.isVerifiedPatient ? "Yes ✓" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Submitted On</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selectedReview.createdAt)}
                    </p>
                  </div>
                </div>

                {selectedReview.appointment && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Appointment Details
                    </p>
                    <div className="text-sm text-blue-800">
                      <p>Date: {selectedReview.appointment.date}</p>
                      <p>Time: {selectedReview.appointment.slotTime}</p>
                      <p>
                        Status:{" "}
                        {selectedReview.appointment.status?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-2">Review Comment</p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedReview.comment}
                    </p>
                  </div>
                </div>

                {selectedReview.status === "pending" && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleModerate(selectedReview._id, "approved");
                      }}
                      disabled={isModerating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed">
                      <Check size={18} />
                      {isModerating ? "Processing..." : "Approve Review"}
                    </button>
                    <button
                      onClick={() => {
                        handleModerate(selectedReview._id, "rejected");
                      }}
                      disabled={isModerating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed">
                      <X size={18} />
                      {isModerating ? "Processing..." : "Reject Review"}
                    </button>
                  </div>
                )}

                {selectedReview.status !== "pending" && (
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-gray-600">
                      This review has been {selectedReview.status}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewMenu;
