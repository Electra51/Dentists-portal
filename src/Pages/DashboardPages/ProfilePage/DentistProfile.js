import {
  Award,
  Briefcase,
  CheckCircle,
  Clock,
  Loader2,
  Send,
  XCircle,
} from "lucide-react";
import React from "react";
import InfoItem from "./InfoItem";

const DentistProfile = ({
  currentUser,
  handleRequestVerification,
  isRequestingVerification,
}) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 mb-6">
        <p>
          <span className="font-semibold text-base underline">About Me:</span>{" "}
          {currentUser.bio || "Not provided"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-500" />
            Professional Information
          </h2>
          <div className="space-y-3">
            <InfoItem
              label="Specialization"
              value={currentUser.specialization || "Not provided"}
            />
            <InfoItem
              label="BMDC Number"
              value={currentUser.bmdcNumber || "Not provided"}
            />
            <InfoItem
              label="Experience"
              value={currentUser.experience || "Not provided"}
            />
            <InfoItem
              label="Qualification"
              value={currentUser.qualification || "Not provided"}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-500" />
            Work Details
          </h2>
          <div className="space-y-3">
            <InfoItem
              label="Department"
              value={currentUser.department || "Not provided"}
            />{" "}
            <InfoItem
              label="Category"
              value={currentUser.category || "Not provided"}
            />
            <InfoItem
              label="Services"
              value={
                currentUser.services && currentUser.services.length > 0
                  ? currentUser.services.join(", ")
                  : "Not provided"
              }
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

      <div className="mt-6">
        {currentUser.verificationStatus === "not_requested" && (
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Send className="w-5 h-5 text-[#eaab4c] mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-[#eaab4c] mb-1">
                  Complete Your Profile Verification
                </h3>
                <p className="text-sm text-[#eaab4c] mb-3">
                  Submit your profile for admin verification to start accepting
                  appointments and appear in the doctors list on the landing
                  page.
                </p>
                <button
                  onClick={handleRequestVerification}
                  disabled={isRequestingVerification}
                  className="bg-orange-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isRequestingVerification ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Request Verification
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentUser.verificationStatus === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Verification Pending
                </h3>
                <p className="text-sm text-yellow-700">
                  Your verification request is under review. Admin will verify
                  your credentials soon. You'll be notified once approved.
                </p>
                {currentUser.verificationRequestDate && (
                  <p className="text-base text-yellow-600 mt-2">
                    Requested on:{" "}
                    {new Date(
                      currentUser.verificationRequestDate
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentUser.verificationStatus === "rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  Verification Rejected
                </h3>
                <p className="text-sm text-red-700 mb-2">
                  {currentUser.rejectionReason ||
                    "Your verification request was rejected. Please update your credentials and submit again."}
                </p>
                <button
                  onClick={handleRequestVerification}
                  disabled={isRequestingVerification}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isRequestingVerification ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resubmitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Resubmit Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentUser.verificationStatus === "approved" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">
                  ✅ Profile Verified!
                </h3>
                <p className="text-sm text-green-700">
                  Congratulations! Your profile has been verified. You can now
                  set appointment slots and patients can book appointments with
                  you.
                </p>
                {currentUser.verifiedAt && (
                  <p className="text-xs text-green-600 mt-2">
                    Verified on:{" "}
                    {new Date(currentUser.verifiedAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DentistProfile;
