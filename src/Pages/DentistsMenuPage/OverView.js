import { Award, Briefcase, Building2, GraduationCap } from "lucide-react";
import React from "react";

const OverView = ({ dentist }) => {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
        <p className="text-gray-700 leading-relaxed">
          {dentist?.bio}
          Specialized in {dentist.specialization} with {dentist.experience} of
          experience. Providing quality dental care with modern techniques and
          patient-centered approach.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Qualifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <GraduationCap className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <p className="font-semibold text-gray-900">Education</p>
              <p className="text-gray-700">{dentist.qualification}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <Briefcase className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <p className="font-semibold text-gray-900">Experience</p>
              <p className="text-gray-700">{dentist.experience}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
            <Award className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <p className="font-semibold text-gray-900">Registration</p>
              <p className="text-gray-700">{dentist.bmdcNumber}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
            <Building2 className="w-6 h-6 text-orange-600 mt-1" />
            <div>
              <p className="font-semibold text-gray-900">Department</p>
              <p className="text-gray-700">{dentist.department}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Services Offered
        </h2>
        <div className="flex flex-wrap gap-3">
          {dentist?.services?.map((service, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full font-medium">
              {service}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverView;
