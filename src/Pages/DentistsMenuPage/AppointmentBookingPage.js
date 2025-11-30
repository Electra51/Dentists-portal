/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useCreateAppointmentMutation } from "../../redux/api/appointmentApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetDentistDetailsQuery,
  useGetUserProfileQuery,
} from "../../redux/api/authApi";
import AppointmentBookingContent from "../../Components/AppointmentBookingContent";

const AppointmentBookingPage = () => {
  const { dentistId } = useParams();
  const navigate = useNavigate();
  const { data: profileData } = useGetUserProfileQuery();
  const currentUser = profileData?.user;

  const {
    data: dentistData,
    isLoading: dentistLoading,
    isError: dentistError,
  } = useGetDentistDetailsQuery(dentistId);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    phone: "",
    email: "",
    reason: "",
  });

  // Auto-fill patient info from profile
  useEffect(() => {
    if (currentUser) {
      setPatientInfo((prev) => ({
        ...prev,
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);

  const [createAppointment, { isLoading: bookingLoading }] =
    useCreateAppointmentMutation();

  // Check if dentist data exists before accessing
  if (dentistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (dentistError || !dentistData?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load doctor details</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const dentist = dentistData.data?.dentist;
  const avgRating = dentistData.data?.avgRating || "0.0";
  const totalReviews = dentistData.data?.totalReviews || 0;

  // This component will handle the rest of the logic
  return (
    <AppointmentBookingContent
      dentist={dentist}
      avgRating={avgRating}
      totalReviews={totalReviews}
      currentUser={currentUser}
      patientInfo={patientInfo}
      setPatientInfo={setPatientInfo}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      selectedService={selectedService}
      setSelectedService={setSelectedService}
      currentMonth={currentMonth}
      setCurrentMonth={setCurrentMonth}
      createAppointment={createAppointment}
      bookingLoading={bookingLoading}
      navigate={navigate}
    />
  );
};

export default AppointmentBookingPage;
