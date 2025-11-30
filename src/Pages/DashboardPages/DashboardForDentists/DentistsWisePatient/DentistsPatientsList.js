import React, { useState } from "react";
import {
  Users,
  Search,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  AlertCircle,
  Pill,
  Eye,
  Plus,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Modal } from "../../../../Components/Modal";
import PrescriptionForm from "../DentistsAppointments/PrescriptionForm";
import toast from "react-hot-toast";
import DashboardHeader from "../../../../Components/DashboardHeader";
import LoadingState from "../../../../Components/states/LoadingState";
import DataTable from "react-data-table-component";
import { calculateAge } from "../../../../Utils/calculateAge";
import { useGetDoctorPatientsQuery } from "../../../../redux/api/authApi";

export default function DentistsPatientsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { data, isLoading } = useGetDoctorPatientsQuery({
    search: searchQuery,
    bloodGroup: bloodGroupFilter,
    sortBy,
  });

  const handlePrescriptionSuccess = () => {
    toast.success("Prescription created successfully!");
  };
  const patients = data?.data || [];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  if (isLoading) {
    return (
      <LoadingState
        message="Loading patients lists..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  const handleOpenPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const columns = [
    {
      name: "SL",
      width: "60px",
      center: true,
      cell: (row, index) => (
        <div className="font-semibold text-gray-600">{index + 1}.</div>
      ),
    },
    {
      name: "Patient Info",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          {row.profileImage ? (
            <img
              src={row.profileImage}
              alt={row.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {row.name?.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">
              Age: {calculateAge(row.dateOfBirth)} years
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Contact",
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            {row.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            {row.email}
          </div>
          {row.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              {row.address}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Medical Info",
      cell: (row) => (
        <div className="space-y-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {row.bloodGroup || "N/A"}
          </span>

          {row.allergies && (
            <div className="flex items-center gap-1 text-xs text-orange-700">
              <AlertCircle className="w-3 h-3" />
              <span className="font-medium">Allergy Alert</span>
            </div>
          )}

          {row.chronicConditions && (
            <div className="flex items-center gap-1 text-xs text-red-700">
              <Activity className="w-3 h-3" />
              <span className="font-medium">Chronic Condition</span>
            </div>
          )}

          {row.currentMedications && (
            <div className="flex items-center gap-1 text-xs text-blue-700">
              <Pill className="w-3 h-3" />
              <span className="font-medium">On Medication</span>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Visits",
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-700">
              {row.appointmentCount || 0}
            </span>
            <span className="text-gray-500 text-xs">visits</span>
          </div>
          {row.lastVisit && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="w-3 h-3 text-gray-400" />
              Last: {new Date(row.lastVisit).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Actions",
      center: true,
      cell: (row) => {
        return (
          <div className=" space-y-2">
            <Link to={`${row?._id}`}>
              <button
                className="flex items-center gap-2 px-3.5 py-1.5 border border-gradient-to-r from-cyan-500 to-cyan-600 text-[#5ecdc9] rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-sm hover:shadow-md font-medium text-sm"
                title="View Details">
                <Eye className="w-4 h-4" /> View Details
              </button>
            </Link>

            <button
              onClick={() => handleOpenPrescriptionModal(row)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-sm hover:shadow-md font-medium text-sm">
              <Plus className="w-4 h-4" />
              Prescription
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      <DashboardHeader
        icon={Users}
        title="Patients List"
        subtitle="Manage your patients and view details"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        <select
          value={bloodGroupFilter}
          onChange={(e) => setBloodGroupFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
          <option value="all">All Blood Groups</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
          <option value="createdAt">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name (A-Z)</option>
          <option value="lastVisit">Recent Visit</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
        <DataTable
          columns={columns}
          data={patients}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          highlightOnHover
          noDataComponent={
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No patients found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters
              </p>
            </div>
          }
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Prescription">
        <PrescriptionForm
          patientData={selectedAppointment}
          onCancel={handleCloseModal}
          onSuccess={handlePrescriptionSuccess}
        />
      </Modal>
    </div>
  );
}
