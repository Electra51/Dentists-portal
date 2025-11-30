import React from "react";
import {
  useDeleteArchivedAppointmentMutation,
  useGetAllAppointmentsQuery,
} from "../../../redux/api/appointmentApi";

const AllAppointments = () => {
  // Admin Appointments Page
  const { data, isLoading } = useGetAllAppointmentsQuery();
  console.log("data", data);

  // Delete button (শুধু archived এ show হবে)
  //   {
  //     appointment.status === "archived" && (
  //       <button onClick={() => deleteAppointment(appointment._id)}>
  //         <TrashIcon />
  //       </button>
  //     );
  //   }

  // Delete mutation
  const [deleteAppointment] = useDeleteArchivedAppointmentMutation();
  return <div>AllAppointments</div>;
};

export default AllAppointments;
