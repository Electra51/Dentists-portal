import React, { useState, useEffect } from "react";
import { Bell, DollarSign, Clock, Save, Loader2, Settings } from "lucide-react";

import toast from "react-hot-toast";

import DashboardHeader from "../../../Components/DashboardHeader";
import LoadingState from "../../../Components/states/LoadingState";
import {
  useGetDoctorSettingsQuery,
  useUpdateDoctorSettingsMutation,
} from "../../../redux/api/authApi";

const DentistSettingsPage = () => {
  const { data: settingsData, isLoading: fetchingSettings } =
    useGetDoctorSettingsQuery();
  const [updateDoctorSettings, { isLoading: updating }] =
    useUpdateDoctorSettingsMutation();

  const [settings, setSettings] = useState({
    consultationFee: "500",
    appointmentDuration: "30",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    appointmentReminders: true,
    cancellationAlerts: true,
    newPatientAlerts: true,
  });

  // Load settings from API when data arrives
  useEffect(() => {
    if (settingsData?.data) {
      if (settingsData.data.settings) {
        setSettings(settingsData.data.settings);
      }
      if (settingsData.data.notifications) {
        setNotifications(settingsData.data.notifications);
      }
    }
  }, [settingsData]);

  const handleSaveSettings = async () => {
    try {
      await updateDoctorSettings({
        settings,
        notifications,
      }).unwrap();
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
      console.error("Failed to save settings:", error);
    }
  };

  if (fetchingSettings) {
    return (
      <LoadingState
        message="Loading your setting..."
        spinnerColor="border-[#5ecdc9]"
        height={"min-h-screen"}
      />
    );
  }

  return (
    <div className="min-h-screen max-w-[1440px] mx-auto p-5 md:p-7">
      <DashboardHeader
        icon={Settings}
        title="Settings"
        subtitle="Manage your practice settings and preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Practice Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consultation Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-[#5ecdc9]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Practice Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee (BDT)
                </label>
                <input
                  type="number"
                  value={settings.consultationFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      consultationFee: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Amount patients will pay per appointment
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Appointment Duration
                </label>
                <select
                  value={settings.appointmentDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appointmentDuration: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Standard time allocated per patient
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Schedule Settings</p>
                  <p>
                    To manage your working days, hours, and availability, visit
                    the <span className="font-semibold">Schedule</span> page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Notifications */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-[#5ecdc9]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive updates via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        email: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5ecdc9]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">SMS Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive updates via SMS
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        sms: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5ecdc9]"></div>
                </label>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">
                    Appointment Reminders
                  </p>
                  <p className="text-sm text-gray-500">
                    Get reminded of appointments
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.appointmentReminders}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        appointmentReminders: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5ecdc9]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">
                    Cancellation Alerts
                  </p>
                  <p className="text-sm text-gray-500">
                    Alert on cancellations
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.cancellationAlerts}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        cancellationAlerts: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5ecdc9]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">
                    New Patient Alerts
                  </p>
                  <p className="text-sm text-gray-500">
                    Notify of new patients
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.newPatientAlerts}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        newPatientAlerts: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5ecdc9]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            disabled={updating}
            className="w-full bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 disabled:bg-blue-400  font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg">
            {updating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DentistSettingsPage;
