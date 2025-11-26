import React from "react";
import { useGetUserProfileQuery } from "../../redux/api/authApi";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientDashboard from "./DashboardForPatients/PatientDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: userProfile } = useGetUserProfileQuery();
  const isProfileIncomplete =
    !userProfile?.phone || !userProfile?.address || !userProfile?.dateOfBirth;

  console.log("isProfileIncomplete", isProfileIncomplete);

  return (
    <div>
      {isProfileIncomplete === "false" ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-yellow-600" />
              <p className="text-yellow-800 font-medium">
                Please complete your profile to book appointments
              </p>
            </div>
            <button
              onClick={() => navigate("profile")}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
              Complete Now
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <PatientDashboard />
    </div>
  );
};

export default Dashboard;
