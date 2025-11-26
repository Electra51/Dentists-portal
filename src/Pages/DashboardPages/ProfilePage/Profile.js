/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadUserImageMutation,
  useRequestVerificationMutation,
} from "../../../redux/api/authApi";
import PrimaryButton from "../../../Components/PrimaryButton";
import InputField from "../../../Components/InputField";
import SelectField from "../../../Components/SelectField";
import ProfileModal from "../../../Components/ProfileModal";
import LoadingState from "../../../Components/states/LoadingState";
import MessageState from "../../../Components/states/MessageState";
import PatientProfile from "./PatientProfile";
import DentistProfile from "./DentistProfile";
import AdminProfile from "./AdminProfile";

export default function Profile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useGetUserProfileQuery();

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadUserImageMutation();

  const [requestVerification, { isLoading: isRequestingVerification }] =
    useRequestVerificationMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);
  const currentUser = profileData?.user;

  const userType =
    currentUser?.role === 0
      ? "patient"
      : currentUser?.role === 1
      ? "dentist"
      : "admin";

  useEffect(() => {
    if (currentUser) {
      setFormData(currentUser);
    }
  }, [currentUser]);

  const handleEditClick = () => {
    setFormData(currentUser);
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (imageFile) => {
    try {
      let updatedFormData = { ...formData };

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("profileImage", imageFile);

        const imageResult = await uploadImage({
          email: currentUser.email,
          formData: imageFormData,
        }).unwrap();

        console.log("Image uploaded:", imageResult);

        if (imageResult?.user?.profileImage) {
          updatedFormData = {
            ...updatedFormData,
            profileImage: imageResult.user.profileImage,
          };
        }
      }

      const res = await updateProfile(updatedFormData).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleRequestVerification = async () => {
    if (
      !currentUser.specialization ||
      !currentUser.bmdcNumber ||
      !currentUser.qualification
    ) {
      toast.error(
        "Please complete your profile before requesting verification"
      );
      return;
    }

    try {
      const res = await requestVerification().unwrap();
      toast.success(res.message || "Verification request sent successfully!");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message || "Failed to send verification request"
      );
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        message="Loading your profile..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  if (isError || !currentUser) {
    return (
      <MessageState
        type="error"
        title="Unable to Load profile"
        message="Please try refreshing the page or contact support if the problem persists."
      />
    );
  }

  console.log("currentUser...", currentUser);

  const getVerificationBadge = () => {
    const status = currentUser.verificationStatus;

    const badges = {
      approved: {
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        icon: <CheckCircle className="w-4 h-4" />,
        text: "Verified",
      },
      pending: {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        icon: <Clock className="w-4 h-4" />,
        text: "Pending",
      },
      rejected: {
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        icon: <XCircle className="w-4 h-4" />,
        text: "Rejected",
      },
      not_requested: {
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        icon: <AlertCircle className="w-4 h-4" />,
        text: "Not Verified",
      },
    };

    const badge = badges[status] || badges.not_requested;
    return (
      <span
        className={`flex items-center gap-1.5 ${badge.bgColor} ${badge.textColor} px-3 py-1 rounded-full text-xs font-semibold`}>
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  return (
    <div className="">
      <div className="max-w-[1440px] mx-auto mt-7">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-r from-secondary to-info hover:opacity-90 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
              {currentUser.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser.name?.charAt(0) || "U"
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentUser.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    userType === "patient"
                      ? "bg-blue-50 text-[#5ecdc9]"
                      : userType === "dentist"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                  {userType.toUpperCase()}
                </span>
                {userType === "dentist" && getVerificationBadge()}
              </div>
              <div className="flex flex-col gap-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{currentUser.email}</span>
                </div>
                {currentUser.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{currentUser.phone}</span>
                  </div>
                )}
                {currentUser.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{currentUser.address}</span>
                  </div>
                )}
              </div>
            </div>

            <PrimaryButton onClick={handleEditClick}>
              Edit Profile
            </PrimaryButton>
          </div>
        </div>

        {userType === "patient" && (
          <PatientProfile
            currentUser={currentUser}
            latestAppointment={profileData?.latestAppointment}
            nextVisit={profileData?.nextVisit}
          />
        )}

        {userType === "dentist" && (
          <DentistProfile
            currentUser={currentUser}
            handleRequestVerification={handleRequestVerification}
            isRequestingVerification={isRequestingVerification}
          />
        )}

        {userType === "admin" && <AdminProfile currentUser={currentUser} />}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  icon={<User className="w-5 h-5" />}
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  icon={<Phone className="w-5 h-5" />}
                />
                <InputField
                  label="Address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  icon={<MapPin className="w-5 h-5" />}
                  textarea
                />

                {userType === "patient" && (
                  <>
                    <InputField
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={
                        formData.dateOfBirth
                          ? formData.dateOfBirth.split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      icon={<Calendar className="w-5 h-5" />}
                    />
                    <SelectField
                      label="Blood Group"
                      name="bloodGroup"
                      value={formData.bloodGroup || ""}
                      onChange={handleInputChange}
                      options={[
                        "A+",
                        "A-",
                        "B+",
                        "B-",
                        "AB+",
                        "AB-",
                        "O+",
                        "O-",
                      ]}
                    />
                    <InputField
                      label="Emergency Contact"
                      name="emergencyContact"
                      value={formData.emergencyContact || ""}
                      onChange={handleInputChange}
                      icon={<Phone className="w-5 h-5" />}
                    />
                    <InputField
                      label="Allergies"
                      name="allergies"
                      placeholder="e.g., Penicillin, Latex"
                      value={formData.allergies || ""}
                      onChange={handleInputChange}
                      textarea
                    />
                    <InputField
                      label="Chronic Conditions"
                      name="chronicConditions"
                      placeholder="e.g., Diabetes, Hypertension"
                      value={formData.chronicConditions || ""}
                      onChange={handleInputChange}
                      textarea
                    />
                    <InputField
                      label="Current Medications"
                      name="currentMedications"
                      placeholder="e.g., Metformin 500mg"
                      value={formData.currentMedications || ""}
                      onChange={handleInputChange}
                      textarea
                    />
                  </>
                )}

                {userType === "dentist" && (
                  <>
                    <InputField
                      label="Specialization"
                      name="specialization"
                      value={formData.specialization || ""}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="BMDC Number"
                      name="bmdcNumber"
                      value={formData.bmdcNumber || ""}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Experience"
                      name="experience"
                      placeholder="e.g., 5 Years"
                      value={formData.experience || ""}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Qualification"
                      name="qualification"
                      placeholder="e.g., BDS, MDS"
                      value={formData.qualification || ""}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Department"
                      name="department"
                      value={formData.department || ""}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Schedule"
                      name="schedule"
                      placeholder="e.g., Sat-Thu: 9 AM - 5 PM"
                      value={formData.schedule || ""}
                      onChange={handleInputChange}
                    />
                  </>
                )}

                {userType === "admin" && (
                  <>
                    <InputField
                      label="Employee ID"
                      name="employeeId"
                      value={formData.employeeId || ""}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Department"
                      name="department"
                      value={formData.department || ""}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Join Date"
                      name="joinDate"
                      type="date"
                      value={
                        formData.joinDate ? formData.joinDate.split("T")[0] : ""
                      }
                      onChange={handleInputChange}
                      icon={<Calendar className="w-5 h-5" />}
                    />
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <ProfileModal
          setIsEditModalOpen={setIsEditModalOpen}
          isEditModalOpen={isEditModalOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          userType={userType}
          handleSaveProfile={handleSaveProfile}
          isUpdating={isUpdating || isUploadingImage}
        />
      )}
    </div>
  );
}
