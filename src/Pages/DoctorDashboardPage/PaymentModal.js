import React, { useState } from "react";
import { DollarSign, X, CheckCircle } from "lucide-react";

export default function PaymentModal({
  isOpen,
  onClose,
  appointment,
  onConfirm,
  isLoading,
}) {
  const [amount, setAmount] = useState(
    appointment?.payment?.consultationFee || 0
  );
  const [note, setNote] = useState("");

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(appointment._id, amount, note);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Mark Payment as Received
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Patient Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Patient:</span>
              <span className="text-sm font-semibold text-gray-900">
                {appointment.patientInfo?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Booking ID:</span>
              <span className="text-sm font-semibold text-gray-900">
                {appointment.bookingId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Service:</span>
              <span className="text-sm font-semibold text-gray-900">
                {appointment.service}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Received ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Expected: ${appointment.payment?.consultationFee}
              </p>
            </div>

            {/* Note Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="3"
                maxLength="200"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Add any payment notes (e.g., Cash received, Receipt number, etc.)"
              />
              <p className="mt-1 text-xs text-gray-500">
                {note.length}/200 characters
              </p>
            </div>

            {/* Payment Method Display */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Payment Method:</span>{" "}
                {appointment.payment?.paymentMethod?.toUpperCase() || "CASH"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-sm">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
