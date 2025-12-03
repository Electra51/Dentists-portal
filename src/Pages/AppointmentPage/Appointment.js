/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  DollarSign,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useGetAllDentistsQuery,
  useGetUserProfileQuery,
} from "../../redux/api/authApi";
import { useCreateAppointmentMutation } from "../../redux/api/appointmentApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PageHeader from "../../Components/PageHeader";
import { convertTo12Hour } from "../../Utils/convertTo12Hour";

export default function DoctorAppointment() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Get logged-in user profile
  const { data: profileData } = useGetUserProfileQuery();
  const currentUser = profileData?.user;

  const { data, isLoading } = useGetAllDentistsQuery({
    search: "",
    specialization: "all",
  });

  const [createAppointment, { isLoading: bookingLoading }] =
    useCreateAppointmentMutation();

  const dentists = data?.data || [];
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (dentists.length > 0 && !selectedDoctor) {
      setSelectedDoctor(dentists[0]);
      if (dentists[0]?.services?.length > 0) {
        setSelectedService(dentists[0].services[0]);
      }
    }
  }, [dentists, selectedDoctor]);

  useEffect(() => {
    if (selectedDoctor?.services?.length > 0) {
      setSelectedService(selectedDoctor.services[0]);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  }, [selectedDoctor]);

  // Check if user profile is complete
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

  // Generate calendar days based on current month
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

  // Check if a date is available based on doctor's schedule
  const isDateAvailable = (date) => {
    if (!date || !selectedDoctor) return false;

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

    return selectedDoctor?.schedule?.schedule?.[dayName]?.isAvailable || false;
  };

  // Generate time slots based on selected date and doctor's schedule
  const generateTimeSlots = () => {
    if (!selectedDate || !selectedDoctor) return [];

    const dayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ][selectedDate.getDay()];

    const daySchedule = selectedDoctor?.schedule?.schedule?.[dayName];

    if (!daySchedule?.isAvailable) return [];

    const slots = [];
    const duration = parseInt(
      selectedDoctor?.settings?.appointmentDuration || 30
    );

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
        const displayTime = convertTo12Hour(timeStr);
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

  const handleDateClick = (date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not selected";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!currentUser) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to book an appointment",
      });
      return;
    }

    // Check if profile is complete
    if (!isProfileComplete()) {
      Swal.fire({
        icon: "warning",
        title: "Profile Incomplete",
        text: "Please complete your profile first. Fill in: Allergies, Chronic Conditions, Current Medications, Date of Birth, and Blood Group",
        confirmButtonText: "Complete Profile",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard/profile");
        }
      });
      return;
    }

    // Validate form
    if (!selectedDate || !selectedTime || !selectedService) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please select date, time, and service",
      });
      return;
    }

    if (!formData.name || !formData.phone) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in your name and phone number",
      });
      return;
    }

    // Prepare appointment data
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const localAppointmentDate = `${year}-${month}-${day}`;

    try {
      const appointmentData = {
        doctorId: selectedDoctor._id,
        appointmentDate: localAppointmentDate,
        appointmentTime: selectedTime,
        appointmentTime24: convertTo24Hour(selectedTime),
        service: selectedService,
        patientNotes: formData.message,
        patientInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
      };

      const response = await createAppointment(appointmentData).unwrap();

      Swal.fire({
        icon: "success",
        title: "Appointment Booked!",
        html: `
          <div class="text-left">
            <p><strong>Booking ID:</strong> ${response?.data?.bookingId}</p>
            <p><strong>Doctor:</strong> Dr. ${selectedDoctor.name}</p>
            <p><strong>Date:</strong> ${formatDate(selectedDate)}</p>
            <p><strong>Time:</strong> ${selectedTime}</p>
            <p><strong>Fee:</strong> $ ${
              selectedDoctor.settings?.consultationFee || "500"
            }</p>
            <p class="text-yellow-600 mt-2">💰 Pay cash at clinic after consultation</p>
          </div>
        `,
        confirmButtonText: "View My Appointments",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard/my-appointments");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error?.data?.message || "Something went wrong",
      });
    }
  };

  const calendarDays = generateCalendarDays();
  const timeSlots = generateTimeSlots();
  const profileComplete = isProfileComplete();

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <div className="text-xl text-gray-600">Loading doctors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title={"Book Appointment"}
        description={"Your smile is our priority. We provide high-quality"}
      />

      <div className="max-w-7xl mx-auto">
        {/* Profile Incomplete Warning */}
        {currentUser && !profileComplete && (
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

        {/* Not Logged In Warning */}
        {!currentUser && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-1">
                Login Required
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                You need to login to book an appointment.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                Login Now
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Calendar & Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select Doctor */}
            <div className="rounded-xl mt-7">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Select Doctor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dentists.map((doctor) => (
                  <div
                    key={doctor._id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                      selectedDoctor?._id === doctor._id
                        ? "border-cyan-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}>
                    <img
                      src={doctor.profileImage}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h3 className="font-semibold text-center text-gray-800">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center justify-center mt-2 text-sm text-yellow-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1">{doctor.avgRating || 0}</span>
                      <span className="text-gray-500 ml-1">
                        ({doctor.totalReviews || 0})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-500" />
                Select Date
              </h2>

              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-gray-600 py-2">
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
                    <div
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all font-medium ${
                        isSelected
                          ? "bg-[#51B7D5] text-white shadow-lg scale-105"
                          : isAvailable
                          ? "bg-green-100 hover:bg-green-200 text-green-800"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed"
                      } ${
                        isToday && !isSelected ? "ring-2 ring-blue-300" : ""
                      }`}>
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-sm text-gray-600 flex items-center bg-blue-50 p-3 rounded-lg">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                <span>
                  Green dates are available based on doctor's schedule. Click to
                  select.
                </span>
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-500" />
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
                            ? "bg-[#51B7D5] text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
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

            {/* Select Service */}
            <div className="rounded-lg shadow bg-white p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Select Service
              </h2>
              {selectedDoctor?.services?.length > 0 ? (
                <div className="space-y-3">
                  {selectedDoctor.services.map((service) => (
                    <label
                      key={service}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedService === service
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}>
                      <input
                        type="radio"
                        name="service"
                        value={service}
                        checked={selectedService === service}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-5 h-5 text-blue-500"
                      />
                      <span className="ml-3 text-gray-800 font-medium">
                        {service}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No services available
                </p>
              )}
            </div>

            {/* Your Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-500" />
                Your Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="+880 | 1XXXXXXXXX *"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <input
                  type="email"
                  placeholder="yourname@email.com (Optional)"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  placeholder="Reason for visit..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows="3"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"></textarea>
              </div>
            </div>
          </div>

          {/* Right Section - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-t-none rounded-b-md shadow p-6 sticky top-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Appointment Summary
              </h2>

              {selectedDoctor && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <img
                      src={selectedDoctor.profileImage}
                      alt={selectedDoctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Dr. {selectedDoctor.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedDoctor.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold">
                          {formatDate(selectedDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-semibold">
                          {selectedTime || "Not selected"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Service</p>
                        <p className="font-semibold">
                          {selectedService || "Not selected"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-gray-700">Consultation Fee</span>
                      <span className="text-blue-600 flex items-center">
                        <DollarSign className="w-5 h-5" />
                        {selectedDoctor.settings?.consultationFee || "500"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={
                      !selectedDate ||
                      !selectedTime ||
                      !selectedService ||
                      !formData.name ||
                      !formData.phone ||
                      bookingLoading ||
                      !currentUser ||
                      !profileComplete
                    }
                    className={`w-full py-3 rounded-md font-semibold transition-all flex items-center justify-center gap-2 ${
                      selectedDate &&
                      selectedTime &&
                      selectedService &&
                      formData.name &&
                      formData.phone &&
                      currentUser &&
                      profileComplete &&
                      !bookingLoading
                        ? "bg-gradient-to-r from-secondary to-info text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}>
                    {bookingLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Booking...
                      </>
                    ) : !currentUser ? (
                      "Login Required"
                    ) : !profileComplete ? (
                      "Complete Profile First"
                    ) : selectedDate &&
                      selectedTime &&
                      selectedService &&
                      formData.name &&
                      formData.phone ? (
                      "Confirm Appointment"
                    ) : (
                      "Fill Required Fields"
                    )}
                  </button>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-600 fill-current" />
                      <p className="ml-2 text-sm text-gray-700">
                        Average rating: {selectedDoctor.avgRating || 0}/5.0
                        based on {selectedDoctor.totalReviews || 0} reviews
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
