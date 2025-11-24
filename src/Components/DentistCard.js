import React from "react";
import { MapPin, Star, Users, Calendar, Award } from "lucide-react";
const DentistCard = ({ dentist, onViewDetails }) => {
  const {
    _id,
    name,
    profileImage,
    specialization,
    department,
    experience,
    qualification,
    avgRating = 0,
    totalReviews = 0,
    totalPatients = 0,
    settings,
  } = dentist;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="relative h-48 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90">
        <div className="absolute inset-0 flex items-center justify-center">
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-500">
                {name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Rating Badge */}
        {parseFloat(avgRating) > 0 && (
          <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-800">{avgRating}</span>
            <span className="text-sm text-gray-500">({totalReviews})</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name and Title */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Dr. {name}</h3>
          <p className="text-cyan-600 font-medium">
            {specialization || "General Dentist"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-purple-500" />
            <span className="text-gray-600">{experience || "0"} Years Exp</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">{totalPatients} Patients</span>
          </div>
        </div>

        {/* Qualification */}
        {qualification && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700 line-clamp-2">
              {qualification}
            </p>
          </div>
        )}

        {/* Department */}
        {department && (
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{department}</span>
          </div>
        )}

        {/* Consultation Fee */}
        {settings?.consultationFee && (
          <div className="mb-4 flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Consultation Fee
            </span>
            <span className="text-lg font-bold text-green-600">
              ৳{settings.consultationFee}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(_id)}
            className="flex-1 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DentistCard;
