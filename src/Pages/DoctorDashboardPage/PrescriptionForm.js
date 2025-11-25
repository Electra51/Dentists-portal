import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, User, FileText } from "lucide-react";

const PrescriptionForm = ({ onSubmit, onCancel, patientData }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    appointmentId: "",
    medicines: [
      {
        id: Date.now(),
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
    generalInstructions: "",
    nextVisit: "",
  });

  // Auto-fill patient data when component mounts or patientData changes
  useEffect(() => {
    if (patientData) {
      setFormData((prev) => ({
        ...prev,
        patientName:
          patientData.patientInfo?.name || patientData.patientId?.name || "",
        patientId: patientData.patientId?._id || "",
        appointmentId: patientData._id || "",
      }));
    }
  }, [patientData]);

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        {
          id: Date.now(),
          medicineName: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    });
  };

  const handleRemoveMedicine = (id) => {
    if (formData.medicines.length > 1) {
      setFormData({
        ...formData,
        medicines: formData.medicines.filter((med) => med.id !== id),
      });
    }
  };

  const handleMedicineChange = (id, field, value) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      ),
    });
  };

  const handleGeneralChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    // Validate: at least one medicine should be filled
    const hasValidMedicine = formData.medicines.some(
      (med) => med.medicineName && med.dosage && med.frequency && med.duration
    );

    if (!hasValidMedicine) {
      alert("Please fill in at least one complete medicine entry");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Patient Info Section - Read Only */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          Patient Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Patient Name
            </label>
            <div className="px-3 py-2 bg-white rounded-lg border border-purple-200 text-sm font-medium text-gray-800">
              {formData.patientName || "N/A"}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Appointment ID
            </label>
            <div className="px-3 py-2 bg-white rounded-lg border border-purple-200 text-sm font-mono text-gray-600">
              {formData.appointmentId || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Medicines Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" />
            Prescribed Medicines
          </h3>
          <button
            type="button"
            onClick={handleAddMedicine}
            className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all flex items-center gap-1.5 text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Medicine
          </button>
        </div>

        {formData.medicines.map((medicine, index) => (
          <div
            key={medicine.id}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded">
                Medicine #{index + 1}
              </span>
              {formData.medicines.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMedicine(medicine.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Medicine Name *
              </label>
              <input
                type="text"
                value={medicine.medicineName}
                onChange={(e) =>
                  handleMedicineChange(
                    medicine.id,
                    "medicineName",
                    e.target.value
                  )
                }
                placeholder="e.g., Amoxicillin"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Dosage *
                </label>
                <input
                  type="text"
                  value={medicine.dosage}
                  onChange={(e) =>
                    handleMedicineChange(medicine.id, "dosage", e.target.value)
                  }
                  placeholder="500mg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Frequency *
                </label>
                <select
                  value={medicine.frequency}
                  onChange={(e) =>
                    handleMedicineChange(
                      medicine.id,
                      "frequency",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm">
                  <option value="">Select</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="As needed">As needed</option>
                  <option value="Before meals">Before meals</option>
                  <option value="After meals">After meals</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  value={medicine.duration}
                  onChange={(e) =>
                    handleMedicineChange(
                      medicine.id,
                      "duration",
                      e.target.value
                    )
                  }
                  placeholder="7 days"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Special Instructions (Optional)
              </label>
              <textarea
                value={medicine.instructions}
                onChange={(e) =>
                  handleMedicineChange(
                    medicine.id,
                    "instructions",
                    e.target.value
                  )
                }
                rows="2"
                placeholder="Take with food, avoid alcohol, etc..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      {/* General Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          General Instructions (Optional)
        </label>
        <textarea
          value={formData.generalInstructions}
          onChange={(e) =>
            handleGeneralChange("generalInstructions", e.target.value)
          }
          rows="3"
          placeholder="General advice for the patient: rest, diet recommendations, precautions, etc..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-sm"
        />
      </div>

      {/* Next Visit Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 items-center gap-2">
          <Calendar className="w-4 h-4" />
          Next Visit Date (Optional)
        </label>
        <input
          type="date"
          value={formData.nextVisit}
          onChange={(e) => handleGeneralChange("nextVisit", e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm font-medium">
          Create Prescription
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PrescriptionForm;
