import React, { useState, useEffect } from "react";
import { Users, Sparkles, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DentistCard from "../../Components/DentistCard";
import PageHeader from "../../Components/PageHeader";
import appointmentBg from "../../assets/images/appointment.png";
import PrimaryButton from "../../Components/PrimaryButton";
import { useGetAllDentistsQuery } from "../../redux/api/authApi";
import LoadingState from "../../Components/states/LoadingState";

const DentistsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, refetch } = useGetAllDentistsQuery({
    search: debouncedSearch,
    specialization:
      selectedSpecialization === "all" ? "" : selectedSpecialization,
    sortBy,
  });

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [debouncedSearch, selectedSpecialization, sortBy, refetch]);

  const handleViewDetails = (dentistId) => {
    navigate(`/doctors/${dentistId}`);
  };

  if (isLoading) {
    return (
      <LoadingState
        message="Loading your dentists page..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  const dentists = data?.data || [];

  return (
    <div className="min-h-screen">
      <PageHeader
        title={"Find Your Dentist"}
        description={"Browse verified dental professionals"}
      />
      <div className="bg-white shadow-sm p-3 mb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name, specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
          />

          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none">
            <option value="all">All Specializations</option>
            <option value="Orthodontics">Orthodontics</option>
            <option value="Pediatric Dentistry">Pediatric Dentistry</option>
            <option value="Endodontics">Endodontics</option>
            <option value="Periodontics">Periodontics</option>
            <option value="Oral Surgery">Oral Surgery</option>
          </select>

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
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-600">
            Found{" "}
            <span className="font-semibold text-gray-900">
              {dentists.length}
            </span>{" "}
            dentists
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dentists.map((dentist) => (
            <DentistCard
              key={dentist._id}
              dentist={dentist}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-16">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">24+</p>
                <p className="text-sm text-gray-600">Available Slots Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">500+</p>
                <p className="text-sm text-gray-600">Happy Patients</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-yellow-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">15+</p>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-16 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md rounded-lg p-12 text-center mx-2"
          style={{ background: `url(${appointmentBg})` }}>
          <h2 className="text-4xl font-bold mb-4">Need Urgent Care?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact our emergency hotline for immediate assistance
          </p>

          <PrimaryButton
            variant="outline"
            className="border border-white bg-white">
            Call Now: 1-800-DENTIST
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default DentistsPage;
