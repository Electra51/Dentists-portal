/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  ArrowLeft,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import PageHeader from "../Components/PageHeader";
const AppointmentBookingContent = ({
  dentist,
  avgRating,
  totalReviews,
  currentUser,
  patientInfo,
  setPatientInfo,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedService,
  setSelectedService,
  currentMonth,
  setCurrentMonth,
  createAppointment,
  bookingLoading,
  navigate,
}) => {
  useEffect(() => {
    if (dentist?.services?.length > 0 && selectedService === "") {
      setSelectedService(dentist.services[0]);
    }
  }, [dentist]);

  const isProfileComplete = () => {
    if (!currentUser) return false;

    const requiredFields = [
      "allergies",
      "chronicConditions",
      "currentMedications",
      "dateOfBirth",
      "bloodGroup",
    ];

    return requiredFields.every((field) => {
      const value = currentUser[field];

      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.toString().trim() !== "";
    });
  };

  const convertTo24Hour = (time12) => {
    const [time, period] = time12.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };

  const handleConfirmAppointment = async () => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const localAppointmentDate = `${year}-${month}-${day}`;
    if (!currentUser) {
      alert("Please login first");
      return;
    }

    if (!isProfileComplete()) {
      alert(
        "Please complete your profile first. Fill in: Allergies, Chronic Conditions, Current Medications, Date of Birth, and Blood Group"
      );
      navigate("/dashboard/profile");
      return;
    }

    if (
      !selectedDate ||
      !selectedTime ||
      !patientInfo.name ||
      !patientInfo.phone
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const appointmentData = {
        doctorId: dentist._id,
        appointmentDate: localAppointmentDate,
        appointmentTime: selectedTime,
        appointmentTime24: convertTo24Hour(selectedTime),
        service: selectedService,
        patientNotes: patientInfo.reason,
        patientInfo: {
          name: patientInfo.name,
          phone: patientInfo.phone,
          email: patientInfo.email,
        },
      };

      const response = await createAppointment(appointmentData).unwrap();
      //   alert("Appointment booked successfully!");
      Swal.fire({
        icon: "success",
        title: "Appointment Booked!",
        html: `
        <div class="text-left">
          <p><strong>Booking ID:</strong> ${response?.data?.bookingId}</p>
          <p><strong>Doctor:</strong> Dr. ${dentist.name}</p>
          <p><strong>Date:</strong> ${formatDate(selectedDate)}</p>
          <p><strong>Time:</strong> ${selectedTime}</p>
          <p><strong>Fee:</strong> $ ${dentist.settings.consultationFee}</p>
          <p class="text-yellow-600 mt-2">💰 Pay cash at clinic after consultation</p>
        </div>
      `,
        confirmButtonText: "View My Appointments",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/dashboard/my-appointments");
      }, 2000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error?.data?.message || "Something went wrong",
      });
    }
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][date.getDay()];

    return dentist?.schedule?.schedule?.[dayName]?.isAvailable || false;
  };

  const generateTimeSlots = () => {
    if (!selectedDate) return [];

    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][selectedDate.getDay()];

    const daySchedule = dentist?.schedule?.schedule?.[dayName];

    if (!daySchedule?.isAvailable) return [];

    const slots = [];
    const duration = parseInt(dentist?.settings?.appointmentDuration || 30);

    daySchedule.slots?.forEach((slot) => {
      const [startHour, startMin] = slot.start.split(":").map(Number);
      const [endHour, endMin] = slot.end.split(":").map(Number);

      let currentHour = startHour;
      let currentMin = startMin;

      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMin < endMin)
      ) {
        const timeStr = `${String(currentHour).padStart(2, "0")}:${String(
          currentMin
        ).padStart(2, "0")}`;
        const displayTime = formatTime(timeStr);
        slots.push({ value: timeStr, display: displayTime });

        currentMin += duration;
        if (currentMin >= 60) {
          currentHour += Math.floor(currentMin / 60);
          currentMin = currentMin % 60;
        }
      }
    });

    return slots;
  };

  const formatTime = (time24) => {
    const [hour, min] = time24.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${String(min).padStart(2, "0")} ${period}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const timeSlots = useMemo(() => generateTimeSlots(), [selectedDate, dentist]);
  const calendarDays = generateCalendarDays();
  const isFormValid =
    selectedDate && selectedTime && patientInfo.name && patientInfo.phone;

  const profileComplete = isProfileComplete();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <PageHeader
          title={"Book Your Appointment"}
          description={"Choose a convenient date and time for your dental care"}
        />
        <div className="max-w-7xl mx-auto px-4 py-4 mt-0">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Doctor Details
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!profileComplete && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">
                Profile Incomplete
              </h3>
              <p className="text-sm text-red-700 mb-3">
                Please complete your profile before booking an appointment.
                Required information: Allergies, Chronic Conditions, Current
                Medications, Date of Birth, and Blood Group.
              </p>
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Complete Profile Now
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={dentist?.profileImage}
              alt={dentist?.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Dr. {dentist?.name}
              </h1>
              <p className="text-gray-600">{dentist?.specialization}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{avgRating}</span>
                  <span className="text-gray-500">
                    ({totalReviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-cyan-500" />
                  <span>{dentist?.experience}</span>
                </div>
                {dentist?.verificationStatus === "approved" && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-medium">Verified</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center bg-cyan-50 px-6 py-4 rounded-lg">
              <p className="text-sm text-gray-600">Consultation Fee</p>
              <p className="text-3xl font-bold text-cyan-600">
                $ {dentist?.settings?.consultationFee || "500"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-500" />
                Select Date
              </h2>

              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  )
                )}

                {calendarDays.map((date, index) => {
                  if (!date) {
                    return (
                      <div key={`empty-${index}`} className="aspect-square" />
                    );
                  }

                  const isAvailable = isDateAvailable(date);
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString();
                  const isToday =
                    date.toDateString() === new Date().toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateSelect(date)}
                      disabled={!isAvailable}
                      className={`aspect-square rounded-lg font-medium transition-all ${
                        isSelected
                          ? "bg-cyan-500 text-white shadow-lg scale-105"
                          : isAvailable
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } ${
                        isToday && !isSelected ? "ring-2 ring-cyan-300" : ""
                      }`}>
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                <p>
                  Green dates are available. Gray dates are unavailable or in
                  the past.
                </p>
              </div>
            </div>

            {selectedDate && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-500" />
                  Select Time Slot
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Available slots for {formatDate(selectedDate)}
                </p>

                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.value}
                        onClick={() => setSelectedTime(slot.display)}
                        className={`py-3 px-4 rounded-lg font-medium transition-all ${
                          selectedTime === slot.display
                            ? "bg-cyan-500 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600"
                        }`}>
                        {slot.display}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No slots available for this date
                  </p>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Select Service
              </h2>
              {dentist?.services && dentist.services.length > 0 ? (
                <div className="space-y-2">
                  {dentist.services.map((service) => (
                    <label
                      key={service}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedService === service
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-gray-200 hover:border-cyan-300"
                      }`}>
                      <input
                        type="radio"
                        name="service"
                        value={service}
                        checked={selectedService === service}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-4 h-4 text-cyan-500"
                      />
                      <span className="font-medium">{service}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No services available
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-500" />
                Your Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={patientInfo?.name}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={patientInfo?.phone}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={patientInfo?.email}
                      onChange={(e) =>
                        setPatientInfo({
                          ...patientInfo,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit
                  </label>
                  <textarea
                    value={patientInfo?.reason}
                    onChange={(e) =>
                      setPatientInfo({ ...patientInfo, reason: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Briefly describe your dental concern..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Appointment Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-semibold">Dr. {dentist?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">
                      {selectedDate ? formatDate(selectedDate) : "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold">
                      {selectedTime || "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-semibold">
                      {selectedService || "Not selected"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-gray-700">
                    Consultation Fee
                  </span>
                  <span className="font-bold text-cyan-600 text-2xl">
                    $ {dentist?.settings?.consultationFee || "500"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmAppointment}
                disabled={!isFormValid || bookingLoading || !profileComplete}
                className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  isFormValid && !bookingLoading && profileComplete
                    ? "bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}>
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Booking...
                  </>
                ) : !profileComplete ? (
                  "Complete Profile First"
                ) : isFormValid ? (
                  "Confirm Appointment"
                ) : (
                  "Fill Required Fields"
                )}
              </button>

              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> You will receive a confirmation message
                  via SMS/Email after booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingContent;
