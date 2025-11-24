import { Calendar, Loader2, MapPin, Phone, User, X } from "lucide-react";
import React, { useRef, useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";

const ProfileModal = ({
  formData,
  handleInputChange,
  setIsEditModalOpen,
  userType,
  handleSaveProfile,
  isUpdating,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    setImageError("");

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError("Image size must be less than 2MB");
        return;
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setImageError("Only JPG and PNG files are allowed");
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
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
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  formData.name?.charAt(0)
                )}
              </div>
            </div>

            <div className="text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/jpeg,image/png"
                className="hidden"
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="text-[#5ecdc9] hover:text-teal-700 font-medium">
                Upload Photo
              </button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
              {imageError && (
                <p className="text-xs text-red-500 mt-1">{imageError}</p>
              )}
              {selectedImage && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ {selectedImage.name} selected
                </p>
              )}
            </div>
          </div>
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
                  options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
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
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
              Cancel
            </button>

            <button
              onClick={() => handleSaveProfile(selectedImage)}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 rounded-lg hover:bg-cyan-600 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
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
  );
};

export default ProfileModal;
