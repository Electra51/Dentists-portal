import React, { useState } from "react";
import { Users, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useDeletePatientMutation,
  useGetAllPatientsQuery,
} from "../../../redux/api/authApi";
import LoadingState from "../../../Components/states/LoadingState";
import DashboardHeader from "../../../Components/DashboardHeader";
import DataTable from "../../../Components/DataTable/DataTable";

export default function AllPatientsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const { data, isLoading, refetch } = useGetAllPatientsQuery({
    search: searchQuery,
    bloodGroup: bloodGroupFilter,
    sortBy,
  });
  const [deletePatient] = useDeletePatientMutation();
  const patients = data?.data || [];

  const handleDelete = async (patientId, patientName) => {
    if (!window.confirm(`Are you sure you want to delete ${patientName}?`)) {
      return;
    }

    try {
      await deletePatient(patientId).unwrap();
      toast.success("Patient deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete patient");
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        message="Loading patients list..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  const filteredPatients = patients.filter((p) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(searchLower) ||
      p.email?.toLowerCase().includes(searchLower) ||
      p.specialization?.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      name: "Patient",
      selector: (row) => row.name,
      width: "240px",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-semibold">
            {row.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      name: "Contact",
      width: "250px",
      selector: (row) => row.phone,
      sortable: true,
      cell: (row) => (
        <td className="px-6 py-4 text-sm text-gray-600">
          {row.phone || "N/A"}
        </td>
      ),
    },
    {
      name: "Blood Group",
      selector: (row) => row.bloodGroup,
      cell: (row) => (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          {row.bloodGroup || "N/A"}
        </span>
      ),
    },
    {
      name: "Joined",
      selector: (row) => row.verificationStatus,
      sortable: true,
      cell: (row) => <p> {new Date(row.createdAt).toLocaleDateString()}</p>,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleDelete(row._id, row.name)}
            className="text-red-600 hover:text-red-800">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
      right: true,
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-6">
      <div className="flex justify-between items-start mb-2">
        <DashboardHeader
          icon={Users}
          title="Patients Lists"
          subtitle={`Showing ${filteredPatients.length} of ${patients.length} dentists`}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-[53%]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-lg">
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
            className="px-2 py-1.5 border border-gray-300 rounded-lg">
            <option value="createdAt">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredPatients}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30, 50]}
      />
    </div>
  );
}
