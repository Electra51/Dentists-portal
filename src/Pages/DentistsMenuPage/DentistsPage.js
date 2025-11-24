import React, { useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAllDentistsQuery } from "../../redux/api/doctorApi";
import DentistCard from "../../Components/DentistCard";
import PageHeader from "../../Components/PageHeader";

// Dentists List Page
const DentistsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const { data, isLoading } = useGetAllDentistsQuery({
    search: searchTerm,
    specialization: selectedSpecialization,
    sortBy,
  });

  const handleViewDetails = (dentistId) => {
    navigate(`/doctors/${dentistId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  const dentists = data?.data || [];

  return (
    <div className="min-h-screen">
      {" "}
      <PageHeader
        title={" Find Your Dentist"}
        description={"Browse verified dental professionals"}
      />
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by name, specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />

            {/* Specialization Filter */}
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none">
              <option value="all">All Specializations</option>
              <option value="Orthodontist">Orthodontist</option>
              <option value="Pediatric Dentist">Pediatric Dentist</option>
              <option value="Endodontist">Endodontist</option>
              <option value="Periodontist">Periodontist</option>
              <option value="Oral Surgeon">Oral Surgeon</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none">
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found{" "}
            <span className="font-semibold text-gray-900">
              {dentists.length}
            </span>{" "}
            dentists
          </p>
        </div>

        {/* Dentists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dentists.map((dentist) => (
            <DentistCard
              key={dentist._id}
              dentist={dentist}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* Empty State */}
        {dentists.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No dentists found
            </h3>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DentistsPage;
