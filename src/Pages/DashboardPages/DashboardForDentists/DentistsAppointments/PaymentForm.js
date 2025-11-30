import React, { useState } from "react";
import { DollarSign, CheckCircle } from "lucide-react";

export default function PaymentForm({
  appointment,
  onSubmit,
  loading,
  onClose,
}) {
  const [amount, setAmount] = useState(
    appointment?.payment?.consultationFee || 0
  );
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointment._id, amount, note);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount Received (৳)
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
          Expected: ৳{appointment?.payment?.consultationFee}
        </p>
      </div>

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

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Payment Method:</span>{" "}
          {appointment?.payment?.paymentMethod?.toUpperCase() || "CASH"}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium shadow-sm">
          {loading ? (
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
  );
}
