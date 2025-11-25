import React, { useState } from "react";
import {
  Users,
  Search,
  Loader2,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  AlertCircle,
  Pill,
  Eye,
  Plus,
  TrendingUp,
  Clock,
  User,
} from "lucide-react";
import { useGetDoctorPatientsQuery } from "../../redux/api/doctorApi";
import { useNavigate } from "react-router-dom";

export default function DentistsPatientsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { data, isLoading } = useGetDoctorPatientsQuery({
    search: searchQuery,
    bloodGroup: bloodGroupFilter,
    sortBy,
  });

  const patients = data?.data || [];

  // Calculate statistics
  const stats = {
    total: patients.length,
    withAllergies: patients.filter((p) => p.allergies).length,
    chronicPatients: patients.filter((p) => p.chronicConditions).length,
    recentVisits: patients.filter((p) => {
      const lastVisit = new Date(p.lastVisit);
      const daysDiff = (new Date() - lastVisit) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    }).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Statistics */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-cyan-500" />
          My Patients
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-700 font-medium">
                  Total Patients
                </p>
                <p className="text-2xl font-bold text-cyan-900">
                  {stats.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-cyan-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Recent Visits
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.recentVisits}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">
                  With Allergies
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {stats.withAllergies}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">
                  Chronic Cases
                </p>
                <p className="text-2xl font-bold text-red-900">
                  {stats.chronicPatients}
                </p>
              </div>
              <Activity className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
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
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Patient Info
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Medical Info
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Visits
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr
                key={patient._id}
                className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {patient.profileImage ? (
                      <img
                        src={patient.profileImage}
                        alt={patient.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {patient.name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {patient.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Age:{" "}
                        {new Date().getFullYear() -
                          new Date(patient.dateOfBirth).getFullYear()}{" "}
                        years
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {patient.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {patient.email}
                    </div>
                    {patient.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {patient.address}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {patient.bloodGroup || "N/A"}
                    </span>

                    {patient.allergies && (
                      <div className="flex items-center gap-1 text-xs text-orange-700">
                        <AlertCircle className="w-3 h-3" />
                        <span className="font-medium">Allergy Alert</span>
                      </div>
                    )}

                    {patient.chronicConditions && (
                      <div className="flex items-center gap-1 text-xs text-red-700">
                        <Activity className="w-3 h-3" />
                        <span className="font-medium">Chronic Condition</span>
                      </div>
                    )}

                    {patient.currentMedications && (
                      <div className="flex items-center gap-1 text-xs text-blue-700">
                        <Pill className="w-3 h-3" />
                        <span className="font-medium">On Medication</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-700">
                        {patient.appointmentCount || 0}
                      </span>
                      <span className="text-gray-500 text-xs">visits</span>
                    </div>
                    {patient.lastVisit && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3 text-gray-400" />
                        Last: {new Date(patient.lastVisit).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details">
                      <Eye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/add-prescription/${patient._id}`)
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-sm hover:shadow-md font-medium">
                      <Plus className="w-4 h-4" />
                      Prescription
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/appointments?patientId=${patient._id}`)
                      }
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View Appointments">
                      <Calendar className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {patients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No patients found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Patient Details
                </h2>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                {selectedPatient.profileImage ? (
                  <img
                    src={selectedPatient.profileImage}
                    alt={selectedPatient.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-cyan-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                    {selectedPatient.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedPatient.name}
                  </h3>
                  <p className="text-gray-600">{selectedPatient.email}</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    {selectedPatient.bloodGroup}
                  </span>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-600" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium text-gray-900">
                      {selectedPatient.phone}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Emergency:</span>
                    <p className="font-medium text-gray-900">
                      {selectedPatient.emergencyContact || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date of Birth:</span>
                    <p className="font-medium text-gray-900">
                      {new Date(
                        selectedPatient.dateOfBirth
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Age:</span>
                    <p className="font-medium text-gray-900">
                      {new Date().getFullYear() -
                        new Date(
                          selectedPatient.dateOfBirth
                        ).getFullYear()}{" "}
                      years
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium text-gray-900">
                      {selectedPatient.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  Medical History
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-orange-800 font-medium">
                      Allergies:
                    </span>
                    <p className="text-gray-700 mt-1">
                      {selectedPatient.allergies || "None reported"}
                    </p>
                  </div>
                  <div>
                    <span className="text-orange-800 font-medium">
                      Chronic Conditions:
                    </span>
                    <p className="text-gray-700 mt-1">
                      {selectedPatient.chronicConditions || "None reported"}
                    </p>
                  </div>
                  <div>
                    <span className="text-orange-800 font-medium">
                      Current Medications:
                    </span>
                    <p className="text-gray-700 mt-1">
                      {selectedPatient.currentMedications || "None"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Visit Stats */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Visit Statistics
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-blue-800">Total Visits:</span>
                    <p className="text-2xl font-bold text-blue-900">
                      {selectedPatient.appointmentCount || 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-800">Last Visit:</span>
                    <p className="font-medium text-gray-900">
                      {selectedPatient.lastVisit
                        ? new Date(
                            selectedPatient.lastVisit
                          ).toLocaleDateString()
                        : "No visits yet"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    navigate(`/add-prescription/${selectedPatient._id}`);
                    setSelectedPatient(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all font-medium">
                  <FileText className="w-5 h-5" />
                  Add Prescription
                </button>
                <button
                  onClick={() => {
                    navigate(`/appointments?patientId=${selectedPatient._id}`);
                    setSelectedPatient(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium">
                  <Calendar className="w-5 h-5" />
                  View Appointments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
