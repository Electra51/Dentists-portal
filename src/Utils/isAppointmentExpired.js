export const isAppointmentExpired = (appointmentDate, appointmentTime) => {
  const now = new Date();
  const aptDate = new Date(appointmentDate);

  const timeMatch = appointmentTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!timeMatch) return false;

  let hours = parseInt(timeMatch[1]);
  const minutes = parseInt(timeMatch[2]);
  const meridiem = timeMatch[3]?.toUpperCase();

  if (meridiem) {
    if (meridiem === "AM") {
      if (hours === 12) {
        hours = 0;
      }
    } else if (meridiem === "PM") {
      if (hours !== 12) {
        hours += 12;
      }
    }
  }

  aptDate.setHours(hours, minutes, 0, 0);
  return now > aptDate;
};
