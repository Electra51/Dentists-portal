import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import {
  useCreateAppointmentMutation,
  useGetAvailableSlotsQuery,
} from "../../redux/api/appointmentApi";
import { useNavigate } from "react-router-dom";

const AppointmentBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  // Get available slots when date is selected
  const { data: slotsData, isLoading: slotsLoading } =
    useGetAvailableSlotsQuery(
      {
        doctorId: "6923e24cdfbeb3dd49851b68",
        date: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
      },
      { skip: !selectedDate }
    );

  const [createAppointment, { isLoading: bookingLoading }] =
    useCreateAppointmentMutation();

  // Handle booking
  const handleConfirmAppointment = async () => {
    try {
      const appointmentData = {
        doctorId: dentist._id,
        appointmentDate: selectedDate.toISOString().split("T")[0],
        appointmentTime: selectedTime,
        appointmentTime24: convertTo24Hour(selectedTime), // Helper function
        service: selectedService,
        patientNotes: patientInfo.reason,
        patientInfo: {
          name: patientInfo.name,
          phone: patientInfo.phone,
          email: patientInfo.email,
        },
      };

      const response = await createAppointment(appointmentData).unwrap();
      alert("Appointment booked successfully!");
      navigate("/appointments"); // Or wherever you want
    } catch (error) {
      alert(error?.data?.message || "Booking failed");
    }
  };

  // Helper to convert 12hr to 24hr
  const convertTo24Hour = (time12) => {
    const [time, period] = time12.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };

  // Mock dentist data from API
  const dentist = {
    _id: "6923e24cdfbeb3dd49851b68",
    name: "Shaila Rahman",
    email: "shaila@gmail.com",
    profileImage:
      "https://res.cloudinary.com/dwkogyk75/image/upload/v1763959506/profile_images/user-1763959504353.jpg",
    phone: "+8801712002200",
    specialization: "Orthodontics",
    experience: "7 years",
    settings: {
      consultationFee: "500",
      appointmentDuration: "30",
    },
    schedule: {
      schedule: {
        sunday: { isAvailable: false, slots: [] },
        monday: {
          isAvailable: true,
          slots: [{ start: "15:00", end: "18:00" }],
        },
        tuesday: {
          isAvailable: true,
          slots: [{ start: "09:00", end: "12:30" }],
        },
        wednesday: {
          isAvailable: true,
          slots: [{ start: "16:00", end: "19:40" }],
        },
        thursday: {
          isAvailable: true,
          slots: [{ start: "09:00", end: "17:00" }],
        },
        friday: {
          isAvailable: true,
          slots: [{ start: "17:00", end: "20:00" }],
        },
        saturday: {
          isAvailable: true,
          slots: [{ start: "09:00", end: "13:00" }],
        },
      },
    },
  };

  const avgRating = "4.8";
  const totalReviews = 156;

  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState(
    "General Consultation"
  );
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1)); // November 2025
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    phone: "",
    email: "",
    reason: "",
  });

  const services = [
    "General Consultation",
    "Braces & Aligners",
    "Teeth Whitening",
    "Dental Cleaning",
    "Orthodontic Treatment",
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Check if a date is available based on doctor's schedule
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
    return dentist.schedule.schedule[dayName]?.isAvailable || false;
  };

  // Generate time slots for selected date
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
    const daySchedule = dentist.schedule.schedule[dayName];

    if (!daySchedule?.isAvailable) return [];

    const slots = [];
    const duration = parseInt(dentist.settings.appointmentDuration);

    daySchedule.slots.forEach((slot) => {
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
      setSelectedTime(null); // Reset time when date changes
    }
  };

  //   const handleConfirmAppointment = () => {
  //     if (
  //       !selectedDate ||
  //       !selectedTime ||
  //       !patientInfo.name ||
  //       !patientInfo.phone
  //     ) {
  //       alert("Please fill all required fields");
  //       return;
  //     }

  //     const appointmentData = {
  //       dentistId: dentist._id,
  //       dentistName: dentist.name,
  //       date: formatDate(selectedDate),
  //       time: selectedTime,
  //       service: selectedService,
  //       patientInfo,
  //       fee: dentist.settings.consultationFee,
  //     };

  //     console.log("Appointment Data:", appointmentData);
  //     alert("Appointment booked successfully! Check console for details.");
  //   };

  const timeSlots = useMemo(() => generateTimeSlots(), [selectedDate]);
  const calendarDays = generateCalendarDays();
  const isFormValid =
    selectedDate && selectedTime && patientInfo.name && patientInfo.phone;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Doctor Details
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Doctor Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={dentist.profileImage}
              alt={dentist.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Dr. {dentist.name}
              </h1>
              <p className="text-gray-600">{dentist.specialization}</p>
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
                  <span>{dentist.experience}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-medium">Verified</span>
                </div>
              </div>
            </div>
            <div className="text-center bg-cyan-50 px-6 py-4 rounded-lg">
              <p className="text-sm text-gray-600">Consultation Fee</p>
              <p className="text-3xl font-bold text-cyan-600">
                ৳{dentist.settings.consultationFee}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Date & Time Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-500" />
                Select Date
              </h2>

              {/* Month Navigation */}
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

              {/* Calendar Grid */}
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

            {/* Time Slots */}
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

            {/* Service Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Select Service
              </h2>
              <div className="space-y-2">
                {services.map((service) => (
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
            </div>

            {/* Patient Information */}
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
                    value={patientInfo.name}
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
                      value={patientInfo.phone}
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
                      value={patientInfo.email}
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
                    value={patientInfo.reason}
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

          {/* Right Column - Summary */}
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
                    <p className="font-semibold">Dr. {dentist.name}</p>
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
                    <p className="font-semibold">{selectedService}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-gray-700">
                    Consultation Fee
                  </span>
                  <span className="font-bold text-cyan-600 text-2xl">
                    ৳{dentist.settings.consultationFee}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmAppointment}
                disabled={!isFormValid}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  isFormValid
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}>
                {isFormValid ? "Confirm Appointment" : "Fill Required Fields"}
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

export default AppointmentBookingPage;
