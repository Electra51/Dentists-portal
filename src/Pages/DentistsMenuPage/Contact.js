import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";

const Contact = ({ dentist }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Contact Information
      </h2>
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
          <Phone className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">Phone</p>
            <p className="text-gray-700">{dentist.phone}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
          <Mail className="w-6 h-6 text-green-600 mt-1" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">Email</p>
            <p className="text-gray-700">{dentist.email}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
          <MapPin className="w-6 h-6 text-purple-600 mt-1" />
          <div>
            <p className="font-semibold text-gray-900 mb-1">Address</p>
            <p className="text-gray-700">{dentist.address}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <MapPin className="w-12 h-12 text-gray-400" />
        <span className="ml-2 text-gray-500">Map View</span>
      </div>
    </div>
  );
};

export default Contact;
