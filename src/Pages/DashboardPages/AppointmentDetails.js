// import React from "react";
// import { useGetAppointmentDetailsQuery } from "../../redux/api/appointmentApi";
// import {
//   Calendar,
//   Clock,
//   User,
//   Stethoscope,
//   FileText,
//   CreditCard,
//   Phone,
//   Mail,
//   MapPin,
//   Activity,
//   Pill,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   DollarSign,
//   Hash,
// } from "lucide-react";
// import { useParams } from "react-router-dom";
// import LoadingState from "../../Components/states/LoadingState";
// import MessageState from "../../Components/states/MessageState";

// const AppointmentDetails = () => {
//   const { appointmentId } = useParams();
//   const { data, error, isLoading } =
//     useGetAppointmentDetailsQuery(appointmentId);

//   if (isLoading) {
//     return (
//       <LoadingState
//         message="Loading appointments details..."
//         spinnerColor="border-[#5ecdc9]"
//         height={"min-h-screen"}
//       />
//     );
//   }

//   if (error) {
//     return (
//       <MessageState
//         type="error"
//         title="Unable to load appointments details"
//         message="Please try refreshing the page or contact support if the problem persists."
//       />
//     );
//   }

//   if (!data?.data) {
//     return (
//       <MessageState
//         type="warning"
//         title="Appointment details Not Found"
//         message="Please login again to view your appointment details."
//       />
//     );
//   }

//   const appointment = data.data;
//   const patient = appointment.patientId;
//   const doctor = appointment.doctorId;

//   const getStatusColor = (status) => {
//     const colors = {
//       completed: "bg-green-100 text-green-800 border-green-200",
//       pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
//       confirmed: "bg-blue-100 text-blue-800 border-blue-200",
//       cancelled: "bg-red-100 text-red-800 border-red-200",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
//   };

//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       paid: "bg-green-100 text-green-800",
//       pending: "bg-yellow-100 text-yellow-800",
//       failed: "bg-red-100 text-red-800",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800";
//   };

//   return (
//     <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//         <div className="flex items-start justify-between">
//           <div>
//             <div className="flex items-center gap-2 mb-2">
//               <Hash className="w-5 h-5 text-gray-500" />
//               <span className="text-sm font-medium text-gray-500">
//                 {appointment.bookingId}
//               </span>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Appointment Details
//             </h1>
//             <p className="text-gray-600">
//               Complete information about this appointment
//             </p>
//           </div>
//           <span
//             className={`px-4 py-2 rounded-full text-sm font-medium border capitalize ${getStatusColor(
//               appointment.status
//             )}`}>
//             {appointment.status}
//           </span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Patient Information */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <User className="w-5 h-5 text-blue-600" />
//             <h2 className="text-xl font-semibold text-gray-900">
//               Patient Information
//             </h2>
//           </div>
//           <div className="space-y-4">
//             <div className="flex items-center gap-4">
//               <img
//                 src={patient?.profileImage || "https://via.placeholder.com/80"}
//                 alt={patient?.name}
//                 className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
//               />
//               <div>
//                 <h3 className="font-semibold text-lg text-gray-900">
//                   {patient?.name}
//                 </h3>
//                 <p className="text-sm text-gray-500">Patient</p>
//               </div>
//             </div>
//             <div className="space-y-3 pt-3 border-t border-gray-200">
//               <div className="flex items-center gap-3 text-gray-700">
//                 <Mail className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm">{patient?.email}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-700">
//                 <Phone className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm">{patient?.phone}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-700">
//                 <MapPin className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm">{patient?.address}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-700">
//                 <Activity className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm">
//                   Blood Group: {patient?.bloodGroup}
//                 </span>
//               </div>
//               {patient?.allergies && (
//                 <div className="flex items-start gap-3 text-gray-700">
//                   <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium">Allergies</p>
//                     <p className="text-sm text-gray-600">{patient.allergies}</p>
//                   </div>
//                 </div>
//               )}
//               {patient?.chronicConditions && (
//                 <div className="flex items-start gap-3 text-gray-700">
//                   <FileText className="w-4 h-4 text-orange-500 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium">Chronic Conditions</p>
//                     <p className="text-sm text-gray-600">
//                       {patient.chronicConditions}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {patient?.currentMedications && (
//                 <div className="flex items-start gap-3 text-gray-700">
//                   <Pill className="w-4 h-4 text-blue-500 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium">Current Medications</p>
//                     <p className="text-sm text-gray-600">
//                       {patient.currentMedications}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Doctor Information */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Stethoscope className="w-5 h-5 text-blue-600" />
//             <h2 className="text-xl font-semibold text-gray-900">
//               Doctor Information
//             </h2>
//           </div>
//           <div className="space-y-4">
//             <div className="flex items-center gap-4">
//               <img
//                 src={doctor?.profileImage || "https://via.placeholder.com/80"}
//                 alt={doctor?.name}
//                 className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
//               />
//               <div>
//                 <h3 className="font-semibold text-lg text-gray-900">
//                   Dr. {doctor?.name}
//                 </h3>
//                 <p className="text-sm text-blue-600">
//                   {doctor?.specialization}
//                 </p>
//               </div>
//             </div>
//             <div className="space-y-3 pt-3 border-t border-gray-200">
//               <div className="flex items-center gap-3 text-gray-700">
//                 <Mail className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm">{doctor?.email}</span>
//               </div>
//               <div className="flex items-center gap-3 text-gray-700">
//                 <Phone className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm">{doctor?.phone}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Appointment Details */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Calendar className="w-5 h-5 text-blue-600" />
//             <h2 className="text-xl font-semibold text-gray-900">
//               Appointment Details
//             </h2>
//           </div>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between py-3 border-b border-gray-200">
//               <div className="flex items-center gap-3 text-gray-700">
//                 <Calendar className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm font-medium">Date</span>
//               </div>
//               <span className="text-sm text-gray-900 font-medium">
//                 {new Date(appointment.appointmentDate).toLocaleDateString(
//                   "en-US",
//                   {
//                     weekday: "short",
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   }
//                 )}
//               </span>
//             </div>
//             <div className="flex items-center justify-between py-3 border-b border-gray-200">
//               <div className="flex items-center gap-3 text-gray-700">
//                 <Clock className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm font-medium">Time</span>
//               </div>
//               <span className="text-sm text-gray-900 font-medium">
//                 {appointment.appointmentTime} ({appointment.duration} min)
//               </span>
//             </div>
//             <div className="flex items-center justify-between py-3 border-b border-gray-200">
//               <div className="flex items-center gap-3 text-gray-700">
//                 <FileText className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm font-medium">Service</span>
//               </div>
//               <span className="text-sm text-gray-900 font-medium">
//                 {appointment.service}
//               </span>
//             </div>
//             {appointment.patientNotes && (
//               <div className="py-3">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   Patient Notes
//                 </p>
//                 <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
//                   {appointment.patientNotes}
//                 </p>
//               </div>
//             )}
//             {appointment.doctorNotes && (
//               <div className="py-3">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   Doctor Notes
//                 </p>
//                 <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
//                   {appointment.doctorNotes}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Payment Information */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <CreditCard className="w-5 h-5 text-blue-600" />
//             <h2 className="text-xl font-semibold text-gray-900">
//               Payment Information
//             </h2>
//           </div>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between py-3 border-b border-gray-200">
//               <span className="text-sm font-medium text-gray-700">
//                 Consultation Fee
//               </span>
//               <span className="text-xl font-bold text-gray-900">
//                 ৳{appointment.payment?.consultationFee}
//               </span>
//             </div>
//             <div className="flex items-center justify-between py-3 border-b border-gray-200">
//               <span className="text-sm font-medium text-gray-700">
//                 Payment Method
//               </span>
//               <span className="text-sm text-gray-900 font-medium capitalize">
//                 {appointment.payment?.paymentMethod}
//               </span>
//             </div>
//             <div className="flex items-center justify-between py-3 border-b border-gray-200">
//               <span className="text-sm font-medium text-gray-700">
//                 Payment Status
//               </span>
//               <span
//                 className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(
//                   appointment.payment?.paymentStatus
//                 )}`}>
//                 {appointment.payment?.paymentStatus}
//               </span>
//             </div>
//             {appointment.payment?.paidAmount && (
//               <div className="flex items-center justify-between py-3 border-b border-gray-200">
//                 <span className="text-sm font-medium text-gray-700">
//                   Paid Amount
//                 </span>
//                 <span className="text-sm text-green-600 font-semibold">
//                   ৳{appointment.payment.paidAmount}
//                 </span>
//               </div>
//             )}
//             {appointment.payment?.paidAt && (
//               <div className="flex items-center justify-between py-3">
//                 <span className="text-sm font-medium text-gray-700">
//                   Paid At
//                 </span>
//                 <span className="text-sm text-gray-900">
//                   {new Date(appointment.payment.paidAt).toLocaleString()}
//                 </span>
//               </div>
//             )}
//             {appointment.payment?.paymentNote && (
//               <div className="py-3 bg-green-50 rounded-lg p-3">
//                 <p className="text-sm font-medium text-green-800 mb-1">
//                   Payment Note
//                 </p>
//                 <p className="text-sm text-green-700">
//                   {appointment.payment.paymentNote}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Audit Log */}
//       {appointment.auditLog && appointment.auditLog.length > 0 && (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
//           <div className="flex items-center gap-2 mb-4">
//             <FileText className="w-5 h-5 text-blue-600" />
//             <h2 className="text-xl font-semibold text-gray-900">
//               Activity History
//             </h2>
//           </div>
//           <div className="space-y-3">
//             {appointment.auditLog.map((log, index) => (
//               <div
//                 key={log._id}
//                 className="flex items-start gap-4 pb-3 border-b border-gray-200 last:border-b-0 last:pb-0">
//                 <div className="flex-shrink-0">
//                   {log.action === "created" && (
//                     <CheckCircle className="w-5 h-5 text-blue-500" />
//                   )}
//                   {log.action === "paid" && (
//                     <DollarSign className="w-5 h-5 text-green-500" />
//                   )}
//                   {log.action === "cancelled" && (
//                     <XCircle className="w-5 h-5 text-red-500" />
//                   )}
//                   {!["created", "paid", "cancelled"].includes(log.action) && (
//                     <Activity className="w-5 h-5 text-gray-500" />
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900 capitalize">
//                     {log.action}
//                   </p>
//                   <p className="text-sm text-gray-600 mt-0.5">{log.note}</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {new Date(log.performedAt).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AppointmentDetails;

import React, { useState } from "react";
import { useGetAppointmentDetailsQuery } from "../../redux/api/appointmentApi";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Activity,
  Pill,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Hash,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import LoadingState from "../../Components/states/LoadingState";
import MessageState from "../../Components/states/MessageState";
import { Modal } from "../../Components/Modal";

import toast from "react-hot-toast";
import {
  useMarkPaymentReceivedMutation,
  useUpdateAppointmentStatusMutation,
} from "../../redux/api/appointmentApi";
import PrescriptionForm from "./DashboardForDentists/PrescriptionForm";
import PaymentForm from "./DashboardForDentists/PaymentForm";

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } =
    useGetAppointmentDetailsQuery(appointmentId);

  // Modal States
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // API Mutations
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAppointmentStatusMutation();
  const [markPayment, { isLoading: isMarkingPayment }] =
    useMarkPaymentReceivedMutation();

  // Handlers
  const handleStatusUpdate = async (newStatus) => {
    if (
      !window.confirm(`Are you sure you want to ${newStatus} this appointment?`)
    ) {
      return;
    }

    try {
      await updateStatus({ appointmentId, status: newStatus }).unwrap();
      toast.success(`Appointment ${newStatus} successfully`);
      refetch();
    } catch (error) {
      toast.error(`Failed to ${newStatus} appointment`);
    }
  };

  const handleMarkAsPaid = async (appointmentId, amount, note) => {
    try {
      await markPayment({ appointmentId, amount, note }).unwrap();
      toast.success("Payment marked as received!");
      setIsPaymentModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Payment update error:", error);
      toast.error(error?.data?.message || "Failed to update payment");
    }
  };

  const handlePrescriptionSuccess = () => {
    toast.success("Prescription created successfully!");
    setIsPrescriptionModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <LoadingState
        message="Loading appointment details..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  if (error) {
    return (
      <MessageState
        type="error"
        title="Unable to load appointment details"
        message="Please try refreshing the page or contact support if the problem persists."
      />
    );
  }

  if (!data?.data) {
    return (
      <MessageState
        type="warning"
        title="Appointment details Not Found"
        message="Please login again to view your appointment details."
      />
    );
  }

  const appointment = data.data;
  const patient = appointment.patientId;
  const doctor = appointment.doctorId;

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      {/* Header with Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: Title & Info */}
          <div className="flex-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Appointments</span>
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">
                {appointment.bookingId}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Appointment Details
            </h1>
            <p className="text-gray-600">
              Complete information about this appointment
            </p>
          </div>

          {/* Right: Status & Actions */}
          <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[300px]">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border capitalize text-center ${getStatusColor(
                appointment.status
              )}`}>
              Status: {appointment.status}
            </span>

            {/* Action Buttons Based on Status */}
            <div className="flex flex-col gap-2">
              {appointment.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate("confirmed")}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}

              {(appointment.status === "confirmed" ||
                appointment.status === "scheduled") && (
                <button
                  onClick={() => handleStatusUpdate("completed")}
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Mark as Completed
                </button>
              )}

              {/* Medical Actions */}
              {/* {(appointment.status === "confirmed" ||
                appointment.status === "completed") && (
                <button
                  onClick={() => setIsPrescriptionModalOpen(true)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Create Prescription
                </button>
              )} */}

              {(appointment.status === "confirmed" ||
                appointment.status === "completed") && (
                <>
                  {appointment.prescription ? (
                    <Link
                      to={`/prescription/${
                        appointment.prescription._id || appointment.prescription
                      }`}>
                      <button className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm font-medium">
                        <FileText className="w-4 h-4" />
                        View Prescription
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => setIsPrescriptionModalOpen(true)}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-sm font-medium">
                      <Plus className="w-4 h-4" />
                      Create Prescription
                    </button>
                  )}
                </>
              )}

              {/* Payment Action */}
              {appointment.payment.paymentStatus === "pending" && (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  disabled={isMarkingPayment}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm font-medium">
                  <DollarSign className="w-4 h-4" />
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Patient Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={patient?.profileImage || "https://via.placeholder.com/80"}
                alt={patient?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {patient?.name}
                </h3>
                <p className="text-sm text-gray-500">Patient</p>
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{patient?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{patient?.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{patient?.address}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  Blood Group: {patient?.bloodGroup}
                </span>
              </div>
              {patient?.allergies && (
                <div className="flex items-start gap-3 text-gray-700">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Allergies</p>
                    <p className="text-sm text-gray-600">{patient.allergies}</p>
                  </div>
                </div>
              )}
              {patient?.chronicConditions && (
                <div className="flex items-start gap-3 text-gray-700">
                  <FileText className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Chronic Conditions</p>
                    <p className="text-sm text-gray-600">
                      {patient.chronicConditions}
                    </p>
                  </div>
                </div>
              )}
              {patient?.currentMedications && (
                <div className="flex items-start gap-3 text-gray-700">
                  <Pill className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Current Medications</p>
                    <p className="text-sm text-gray-600">
                      {patient.currentMedications}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Doctor Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={doctor?.profileImage || "https://via.placeholder.com/80"}
                alt={doctor?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Dr. {doctor?.name}
                </h3>
                <p className="text-sm text-blue-600">
                  {doctor?.specialization}
                </p>
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{doctor?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{doctor?.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Appointment Details
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Date</span>
              </div>
              <span className="text-sm text-gray-900 font-medium">
                {new Date(appointment.appointmentDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Time</span>
              </div>
              <span className="text-sm text-gray-900 font-medium">
                {appointment.appointmentTime} ({appointment.duration} min)
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Service</span>
              </div>
              <span className="text-sm text-gray-900 font-medium">
                {appointment.service}
              </span>
            </div>
            {appointment.patientNotes && (
              <div className="py-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Patient Notes
                </p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {appointment.patientNotes}
                </p>
              </div>
            )}
            {appointment.doctorNotes && (
              <div className="py-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Doctor Notes
                </p>
                <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                  {appointment.doctorNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Payment Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Consultation Fee
              </span>
              <span className="text-xl font-bold text-gray-900">
                ৳{appointment.payment?.consultationFee}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Payment Method
              </span>
              <span className="text-sm text-gray-900 font-medium capitalize">
                {appointment.payment?.paymentMethod}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Payment Status
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(
                  appointment.payment?.paymentStatus
                )}`}>
                {appointment.payment?.paymentStatus}
              </span>
            </div>
            {appointment.payment?.paidAmount && (
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Paid Amount
                </span>
                <span className="text-sm text-green-600 font-semibold">
                  ৳{appointment.payment.paidAmount}
                </span>
              </div>
            )}
            {appointment.payment?.paidAt && (
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-700">
                  Paid At
                </span>
                <span className="text-sm text-gray-900">
                  {new Date(appointment.payment.paidAt).toLocaleString()}
                </span>
              </div>
            )}
            {appointment.payment?.paymentNote && (
              <div className="py-3 bg-green-50 rounded-lg p-3">
                <p className="text-sm font-medium text-green-800 mb-1">
                  Payment Note
                </p>
                <p className="text-sm text-green-700">
                  {appointment.payment.paymentNote}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audit Log */}
      {appointment.auditLog && appointment.auditLog.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Activity History
            </h2>
          </div>
          <div className="space-y-3">
            {appointment.auditLog.map((log) => (
              <div
                key={log._id}
                className="flex items-start gap-4 pb-3 border-b border-gray-200 last:border-b-0 last:pb-0">
                <div className="flex-shrink-0">
                  {log.action === "created" && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                  {log.action === "paid" && (
                    <DollarSign className="w-5 h-5 text-green-500" />
                  )}
                  {log.action === "cancelled" && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  {!["created", "paid", "cancelled"].includes(log.action) && (
                    <Activity className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {log.action}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">{log.note}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(log.performedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        title="Create Prescription">
        <PrescriptionForm
          patientData={appointment}
          onCancel={() => setIsPrescriptionModalOpen(false)}
          onSuccess={handlePrescriptionSuccess}
        />
      </Modal>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Mark Payment as Received">
        <PaymentForm
          appointment={appointment}
          onSubmit={handleMarkAsPaid}
          loading={isMarkingPayment}
          onClose={() => setIsPaymentModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AppointmentDetails;
