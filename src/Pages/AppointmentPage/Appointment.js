import React, { useState } from "react";
import AppointmentHeader from "./AppointmentHeader";
import AvailableAppointment from "./AvailableAppointment";

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div>
      <AppointmentHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <AvailableAppointment selectedDate={selectedDate} />
    </div>
  );
};

export default Appointment;
