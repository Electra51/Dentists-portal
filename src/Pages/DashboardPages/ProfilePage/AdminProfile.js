import { Clock, Shield } from "lucide-react";
import React from "react";
import InfoItem from "./InfoItem";

const AdminProfile = ({ currentUser }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-500" />
          Role Information
        </h2>
        <div className="space-y-3">
          <InfoItem label="Role" value="System Administrator" />
          <InfoItem
            label="Employee ID"
            value={currentUser.employeeId || "Not provided"}
          />
          <InfoItem
            label="Department"
            value={currentUser.department || "Not provided"}
          />
          <InfoItem
            label="Join Date"
            value={
              currentUser.joinDate
                ? new Date(currentUser.joinDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Not provided"
            }
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-500" />
          Access Information
        </h2>
        <div className="space-y-3">
          <InfoItem
            label="Permissions"
            value={currentUser.permissions || "Standard"}
          />
          <InfoItem
            label="Access Level"
            value={currentUser.accessLevel || "Level 1"}
          />
          <InfoItem
            label="Last Login"
            value={
              currentUser.lastLogin
                ? new Date(currentUser.lastLogin).toLocaleString()
                : "N/A"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
