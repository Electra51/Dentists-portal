// import React from "react";
// import { useGetUserProfileQuery } from "../../redux/api/authApi";
// import { AlertCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import PatientDashboard from "./DashboardForPatients/PatientDashboard";
// import DoctorDashboard from "./DashboardForDentists/DoctorDashboard";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { data: userProfile } = useGetUserProfileQuery();
//   const isProfileIncomplete =
//     !userProfile?.phone || !userProfile?.address || !userProfile?.dateOfBirth;

//   console.log("isProfileIncomplete", isProfileIncomplete);

//   return (
//     <div>
//       {isProfileIncomplete === "false" ? (
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <AlertCircle className="text-yellow-600" />
//               <p className="text-yellow-800 font-medium">
//                 Please complete your profile to book appointments
//               </p>
//             </div>
//             <button
//               onClick={() => navigate("profile")}
//               className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
//               Complete Now
//             </button>
//           </div>
//         </div>
//       ) : (
//         ""
//       )}
//       <PatientDashboard />
//       <DoctorDashboard />
//     </div>
//   );
// };

// export default Dashboard;

import React from "react";
import { useGetUserProfileQuery } from "../../redux/api/authApi";
import { AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientDashboard from "./DashboardForPatients/PatientDashboard";
import DoctorDashboard from "./DashboardForDentists/DoctorDashboard";
// import AdminDashboard from "./DashboardForAdmin/AdminDashboard"; // যখন বানাবেন

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: userProfile, isLoading } = useGetUserProfileQuery();

  // Profile incomplete check (শুধু patient এর জন্য)
  const isProfileIncomplete =
    userProfile?.user?.role === 0 &&
    (!userProfile?.user?.phone ||
      !userProfile?.user?.address ||
      !userProfile?.user?.dateOfBirth);

  console.log("User Profile:", userProfile);
  console.log("User Role:", userProfile?.user.role);
  console.log("isProfileIncomplete:", isProfileIncomplete);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // যদি user profile না থাকে
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center max-w-[1440px] mx-auto min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-red-800">
              Unable to Load Profile
            </h3>
          </div>
          <p className="text-red-600 mb-4">
            Please try logging in again or contact support.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Profile incomplete warning (শুধু patient এর জন্য)
  const ProfileIncompleteWarning = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-yellow-600" />
          <p className="text-yellow-800 font-medium">
            Please complete your profile to book appointments
          </p>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
          Complete Now
        </button>
      </div>
    </div>
  );

  // Role-based dashboard rendering
  const renderDashboard = () => {
    switch (userProfile?.user?.role) {
      case 0: // Patient
        return (
          <>
            {isProfileIncomplete && <ProfileIncompleteWarning />}
            <PatientDashboard />
          </>
        );

      case 1: // Doctor/Dentist
        return <DoctorDashboard />;

      case 2: // Admin
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Admin Dashboard
              </h2>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </div>
        );
      // Uncomment when admin dashboard is ready:
      // return <AdminDashboard />;

      default:
        return (
          <div className="flex items-center justify-center max-w-[1440px] mx-auto min-h-screen">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-red-800">
                  Invalid User Role
                </h3>
              </div>
              <p className="text-red-600 mb-4">
                Your account has an invalid role. Please contact support.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Go to Login
              </button>
            </div>
          </div>
        );
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default Dashboard;
