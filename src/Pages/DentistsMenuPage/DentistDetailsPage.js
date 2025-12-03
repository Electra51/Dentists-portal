import React, { useState } from "react";
import {
  Star,
  Award,
  Users,
  Calendar,
  CheckCircle,
  MessageSquare,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useGetDentistDetailsQuery } from "../../redux/api/authApi";
import Review from "./Review";
import LoadingState from "../../Components/states/LoadingState";
import MessageState from "../../Components/states/MessageState";
import { convertTo12Hour } from "../../Utils/convertTo12Hour";
import OverView from "./OverView";
import Schedule from "./Schedule";
import Contact from "./Contact";

const DentistDetailsPage = () => {
  const { dentistId } = useParams();

  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDentistDetailsQuery(dentistId);

  const dentist = data?.data?.dentist;
  const avgRating = data?.data?.avgRating || "0.0";
  const totalReviews = data?.data?.totalReviews || 0;
  const totalPatients = data?.data?.totalPatients || 0;
  const ratingDistribution = data?.data?.ratingDistribution || {};
  const reviews = data?.data?.reviews || [];

  if (isLoading) {
    return (
      <LoadingState
        message="Loading ..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  if (isError || !dentist) {
    return (
      <MessageState
        type="error"
        title="Unable to Load Prescriptions"
        message="Please try refreshing the page or contact support if the problem persists."
      />
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
            {activeTab === "overview" && <OverView dentist={dentist} />}
            {activeTab === "schedule" && (
              <Schedule daysOfWeek={daysOfWeek} dentist={dentist} />
            )}
            {activeTab === "reviews" && (
              <Review
                doctorId={dentistId}
                avgRating={avgRating}
                totalReviews={totalReviews}
                ratingDistribution={ratingDistribution}
                reviews={reviews}
              />
            )}
            {activeTab === "contact" && <Contact dentist={dentist} />}
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
                              .map(
                                (s) =>
                                  `${convertTo12Hour(
                                    s.start
                                  )}-${convertTo12Hour(s.end)}`
                              )
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
