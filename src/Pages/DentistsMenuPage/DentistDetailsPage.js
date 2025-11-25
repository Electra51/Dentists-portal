import React, { useState } from "react";
import {
  Star,
  MapPin,
  Award,
  Users,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Briefcase,
  GraduationCap,
  MessageSquare,
  ChevronLeft,
  ArrowRight,
  ThumbsUp,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetDentistDetailsQuery } from "../../redux/api/doctorApi";
import { useParams } from "react-router-dom";

const DentistDetailsPage = () => {
  const { dentistId } = useParams();
  console.log("dentistId", dentistId);

  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDentistDetailsQuery(dentistId);
  const dentist = data?.data?.dentist;
  const avgRating = data?.data?.avgRating || "0.0";
  const totalReviews = data?.data?.totalReviews || 0;
  const totalPatients = data?.data?.totalPatients || 0;
  const ratingDistribution = data?.data?.ratingDistribution || {};
  const reviews = data?.data?.reviews || [];

  console.log("Full API Response:", data?.data);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError || !dentist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">Failed to load dentist details</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-secondary to-info hover:opacity-90 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 mt-14">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white mb-6 hover:opacity-80 transition-opacity hover:underline">
            <ChevronLeft className="w-5 h-5" />
            Back to Dentists
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative">
              <img
                src={dentist.profileImage}
                alt={dentist.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Dr. {dentist.name}</h1>
              <p className="text-xl text-cyan-100 mb-3">
                {dentist.specialization}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                  <span className="font-semibold">{avgRating}</span>
                  <span className="text-cyan-100">
                    ({totalReviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{totalPatients} Patients</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>{dentist.experience}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-blue-100 bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
              <p className="text-base text-white font-medium mb-1">
                Consultation Fee
              </p>
              <p className="text-3xl font-bold">
                $ {dentist.settings.consultationFee}
              </p>
              <button
                className="mt-4 bg-white text-cyan-600 px-6 py-2 rounded-lg font-semibold hover:bg-cyan-50 transition-colors flex items-center gap-2 mx-auto"
                onClick={() => navigate(`/appointment/book/${dentistId}`)}>
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            {[
              { key: "overview", label: "Overview" },
              { key: "schedule", label: "Schedule" },
              { key: "reviews", label: "Reviews" },
              { key: "contact", label: "Contact" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-[#5ecdc9] text-cyan-500"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {dentist?.bio}
                    Specialized in {dentist.specialization} with{" "}
                    {dentist.experience} of experience. Providing quality dental
                    care with modern techniques and patient-centered approach.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Qualifications
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">Education</p>
                        <p className="text-gray-700">{dentist.qualification}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <Briefcase className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Experience
                        </p>
                        <p className="text-gray-700">{dentist.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                      <Award className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Registration
                        </p>
                        <p className="text-gray-700">{dentist.bmdcNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                      <Building2 className="w-6 h-6 text-orange-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Department
                        </p>
                        <p className="text-gray-700">{dentist.department}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Services Offered
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {dentist?.services?.map((service, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full font-medium">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "schedule" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Weekly Schedule
                </h2>
                <div className="space-y-3">
                  {daysOfWeek.map((day) => {
                    const daySchedule = dentist.schedule?.schedule?.[day];

                    return (
                      <div
                        key={day}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                          daySchedule?.isAvailable
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}>
                        <div className="flex items-center gap-3">
                          <Calendar
                            className={`w-5 h-5 ${
                              daySchedule?.isAvailable
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="font-semibold text-gray-900 capitalize">
                            {day}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {daySchedule?.isAvailable ? (
                            daySchedule.slots.map((slot, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-white border border-green-300 rounded-lg text-sm font-medium text-green-700">
                                {slot.start} - {slot.end}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500">Unavailable</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Patient Reviews
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {avgRating}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${
                            star <= parseFloat(avgRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">
                      {totalReviews} total reviews
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 w-8">
                          {rating}★
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width:
                                totalReviews > 0
                                  ? `${
                                      (ratingDistribution[rating] /
                                        totalReviews) *
                                      100
                                    }%`
                                  : "0%",
                            }}></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {ratingDistribution[rating]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-t border-gray-200 pt-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-cyan-600">
                              {review.patientId?.name?.charAt(0) || "P"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.patientId?.name || "Patient"}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {review.createdAt}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                            <button className="mt-2 text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              Helpful
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "contact" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Phone</p>
                      <p className="text-gray-700">{dentist.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                    <Mail className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Email</p>
                      <p className="text-gray-700">{dentist.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">
                        Address
                      </p>
                      <p className="text-gray-700">{dentist.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-gray-400" />
                  <span className="ml-2 text-gray-500">Map View</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  className="w-full bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => navigate(`/appointment/book/${dentistId}`)}>
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg border-2 border-gray-300 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Patients</span>
                  <span className="font-bold text-gray-900">
                    {totalPatients}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-bold text-gray-900">
                    {dentist?.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-bold text-gray-900">
                    {dentist.experience}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-bold text-gray-900">
                    {totalReviews}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {avgRating}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Working Hours</h3>
              <div className="space-y-2 text-sm">
                {daysOfWeek.map((day) => {
                  const daySchedule = dentist.schedule?.schedule?.[day];
                  return (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{day}</span>
                      <span
                        className={`font-medium ${
                          daySchedule?.isAvailable
                            ? "text-gray-900"
                            : "text-red-600"
                        }`}>
                        {daySchedule?.isAvailable
                          ? daySchedule.slots
                              .map((s) => `${s.start}-${s.end}`)
                              .join(", ")
                          : "Closed"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentistDetailsPage;
