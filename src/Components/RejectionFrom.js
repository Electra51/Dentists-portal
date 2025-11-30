import React from "react";
import { XCircle, Loader2 } from "lucide-react";

const RejectionForm = ({
  selectedDoctor,
  rejectionReason,
  setRejectionReason,
  isRejecting,
  handleRejectSubmit,
  onCancel,
}) => {
  return (
    <div className="p-4">
      <p className="text-gray-700 mb-4">
        You are about to reject the verification request for{" "}
        <strong>{selectedDoctor?.name}</strong>. Please provide a reason:
      </p>

      <textarea
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
        placeholder="Enter reason for rejection..."
        className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />

      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">
          Cancel
        </button>

        <button
          onClick={handleRejectSubmit}
          disabled={isRejecting || !rejectionReason?.trim()}
          className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isRejecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Rejecting...
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5" />
              Confirm Rejection
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RejectionForm;
