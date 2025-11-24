import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  useGetDoctorScheduleQuery,
  useUpdateDoctorScheduleMutation,
} from "../../redux/api/doctorApi";
import toast from "react-hot-toast";

const DAYS_OF_WEEK = [
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
];

const DEFAULT_SCHEDULE = {
  sunday: { isAvailable: false, slots: [] },
  monday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
  tuesday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
  wednesday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
  thursday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
  friday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
  saturday: { isAvailable: true, slots: [{ start: "09:00", end: "13:00" }] },
};

export default function DoctorSchedule() {
  const { data, isLoading } = useGetDoctorScheduleQuery();
  const [updateSchedule, { isLoading: isUpdating }] =
    useUpdateDoctorScheduleMutation();

  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Backend response structure: { success: true, data: doctor.schedule }
    // So we need to access data?.data directly
    if (data?.data) {
      const backendSchedule = data.data;

      console.log("Backend Schedule:", backendSchedule); // Debug log

      // Check if it's wrapped in schedule key or direct
      const actualSchedule = backendSchedule.schedule || backendSchedule;

      const hasBackendData =
        actualSchedule && Object.keys(actualSchedule).length > 0;

      if (hasBackendData) {
        setSchedule(actualSchedule);
      } else {
        setSchedule(DEFAULT_SCHEDULE);
      }

      setHasChanges(false);
    }
  }, [data]);

  const handleDayToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
      },
    }));
    setHasChanges(true);
  };

  const handleAddSlot = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...(prev[day]?.slots || []), { start: "09:00", end: "10:00" }],
      },
    }));
    setHasChanges(true);
  };

  const handleRemoveSlot = (day, slotIndex) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, index) => index !== slotIndex),
      },
    }));
    setHasChanges(true);
  };

  const handleSlotChange = (day, slotIndex, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, index) =>
          index === slotIndex ? { ...slot, [field]: value } : slot
        ),
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Validation
    for (const day of DAYS_OF_WEEK) {
      if (
        schedule[day.key]?.isAvailable &&
        (!schedule[day.key]?.slots || schedule[day.key]?.slots.length === 0)
      ) {
        toast.error(`Please add at least one time slot for ${day.label}`);
        return;
      }

      // Check for invalid time ranges
      if (schedule[day.key]?.slots) {
        for (const slot of schedule[day.key].slots) {
          if (slot.start >= slot.end) {
            toast.error(
              `Invalid time range for ${day.label}. Start time must be before end time.`
            );
            return;
          }
        }
      }
    }

    try {
      const result = await updateSchedule({ schedule }).unwrap();

      console.log("Save Result:", result); // Debug log

      // Handle response - check if data is wrapped in schedule key
      if (result?.data) {
        const savedSchedule = result.data.schedule || result.data;
        setSchedule(savedSchedule);
      }

      toast.success("Schedule updated successfully!");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to update schedule");
      console.error("Save Error:", error);
    }
  };

  const handleReset = () => {
    if (data?.data) {
      const actualSchedule = data.data.schedule || data.data;

      if (Object.keys(actualSchedule).length > 0) {
        setSchedule(actualSchedule);
      } else {
        setSchedule(DEFAULT_SCHEDULE);
      }
    } else {
      setSchedule(DEFAULT_SCHEDULE);
    }
    setHasChanges(false);
  };

  const getTotalHours = (day) => {
    if (!schedule[day]?.isAvailable || !schedule[day]?.slots) return 0;

    let total = 0;
    schedule[day].slots.forEach((slot) => {
      const start = slot.start.split(":");
      const end = slot.end.split(":");
      const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
      const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
      total += (endMinutes - startMinutes) / 60;
    });
    return total;
  };

  const getTotalWeeklyHours = () => {
    let total = 0;
    DAYS_OF_WEEK.forEach((day) => {
      total += getTotalHours(day.key);
    });
    return total.toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-cyan-500" />
              My Schedule
            </h1>
            <p className="text-gray-600">
              Set your weekly availability and working hours
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Total Weekly Hours</div>
            <div className="text-3xl font-bold text-cyan-600">
              {getTotalWeeklyHours()}h
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Schedule Guidelines:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Patients can only book appointments during available hours
              </li>
              <li>Add multiple time slots for breaks during the day</li>
              <li>Remember to save your changes before leaving</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Days Schedule */}
      <div className="space-y-4 mb-6">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day.key}
            className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
              schedule[day.key]?.isAvailable
                ? "border-cyan-200"
                : "border-gray-200 opacity-60"
            }`}>
            <div className="p-6">
              {/* Day Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule[day.key]?.isAvailable || false}
                      onChange={() => handleDayToggle(day.key)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {day.label}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {schedule[day.key]?.isAvailable
                        ? `${getTotalHours(day.key).toFixed(1)} hours`
                        : "Unavailable"}
                    </p>
                  </div>
                </div>

                {schedule[day.key]?.isAvailable && (
                  <button
                    onClick={() => handleAddSlot(day.key)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Slot
                  </button>
                )}
              </div>

              {/* Time Slots */}
              {schedule[day.key]?.isAvailable && (
                <div className="space-y-3">
                  {!schedule[day.key]?.slots ||
                  schedule[day.key].slots.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                      No time slots added. Click "Add Slot" to get started.
                    </div>
                  ) : (
                    schedule[day.key].slots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-400" />

                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={slot.start || "09:00"}
                              onChange={(e) =>
                                handleSlotChange(
                                  day.key,
                                  index,
                                  "start",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                            <span className="text-gray-500 font-medium">
                              to
                            </span>
                            <input
                              type="time"
                              value={slot.end || "17:00"}
                              onChange={(e) =>
                                handleSlotChange(
                                  day.key,
                                  index,
                                  "end",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                          </div>

                          <div className="ml-auto text-sm text-gray-600 font-medium">
                            {(() => {
                              const start = (slot.start || "09:00").split(":");
                              const end = (slot.end || "17:00").split(":");
                              const startMinutes =
                                parseInt(start[0]) * 60 + parseInt(start[1]);
                              const endMinutes =
                                parseInt(end[0]) * 60 + parseInt(end[1]);
                              const duration = (endMinutes - startMinutes) / 60;
                              return duration > 0
                                ? `${duration.toFixed(1)}h`
                                : "Invalid";
                            })()}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveSlot(day.key, index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            {hasChanges ? (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 font-medium">
                  You have unsaved changes
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 font-medium">
                  All changes saved
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={!hasChanges || isUpdating}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isUpdating}
              className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium">
              {isUpdating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Schedule
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
