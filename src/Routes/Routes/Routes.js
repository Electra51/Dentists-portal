import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layout/Main";
import ErrorPage from "../../Pages/ErrorPage/ErrorPage";
import Login from "../../Pages/Login/Login";
import Signup from "../../Pages/Login/Signup";
import Reviews from "../../Pages/Reviews/Reviews";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import DashboardLayout from "../../Layout/DashboardLayout";
import Profile from "../../Pages/DashboardPages/ProfilePage/Profile";
import About from "../../Pages/AboutPage/About";
import Home from "../../Pages/HomePage/Home";
import Appointment from "../../Pages/AppointmentPage/Appointment";
import DentistDetailsPage from "../../Pages/DentistsMenuPage/DentistDetailsPage";
import AppointmentBookingPage from "../../Pages/DentistsMenuPage/AppointmentBookingPage";
import Dashboard from "../../Pages/DashboardPages/Dashboard";
import MyPrescriptionPage from "../../Pages/DashboardPages/DashboardForPatients/MyPrescriptionPage";
import MyAppointmentPage from "../../Pages/DashboardPages/DashboardForPatients/MyAppointmentPage";
import DentistsAppointmentList from "../../Pages/DashboardPages/DashboardForDentists/DentistsAppointments/DentistsAppointmentList";
import DentistsPatientsList from "../../Pages/DashboardPages/DashboardForDentists/DentistsWisePatient/DentistsPatientsList";
import DentistsPrescriptionList from "../../Pages/DashboardPages/DashboardForDentists/DentistsPrescriptionList";
import DentistsSchedulePage from "../../Pages/DashboardPages/DashboardForDentists/DentistsSchedulePage";
import DentistSettingsPage from "../../Pages/DashboardPages/DashboardForDentists/DentistSettingsPage";
import AppointmentDetails from "../../Pages/DashboardPages/DashboardForDentists/DentistsAppointments/AppointmentDetails";
import PatientsDetails from "../../Pages/DashboardPages/DashboardForDentists/DentistsWisePatient/PatientsDetails";
import DentistsVerification from "../../Pages/DashboardPages/DashboardForAdmin/DentistsVerification";
import AllAppointments from "../../Pages/DashboardPages/DashboardForAdmin/AllAppointments";
import DentistsList from "../../Pages/DashboardPages/DashboardForAdmin/AllDentistsList";
import AllDentistsList from "../../Pages/DashboardPages/DashboardForAdmin/AllDentistsList";
import AllPatientsList from "../../Pages/DashboardPages/DashboardForAdmin/AllPatientsList";
import AdminRevenueMenu from "../../Pages/DashboardPages/DashboardForAdmin/AdminRevenueMenu";
import AdminReportsMenu from "../../Pages/DashboardPages/DashboardForAdmin/AdminReportsMenu";
import DentistsEarningPage from "../../Pages/DashboardPages/DashboardForDentists/DentistsEarningPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/doctors",
        element: <AllDentistsList />,
      },
      {
        path: "/doctors/:dentistId",
        element: <DentistDetailsPage />,
      },
      {
        path: "/appointment/book/:dentistId",
        element: <AppointmentBookingPage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/appointment",
        element: <Appointment />,
      },
      {
        path: "/reviews",
        element: <Reviews />,
      },
    ],
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },

      {
        path: "admin-appointments",
        element: <AllAppointments />,
      },
      {
        path: "admin-revenue",
        element: <AdminRevenueMenu />,
      },

      {
        path: "appointments",
        children: [
          {
            path: "",
            element: <DentistsAppointmentList />,
          },
          {
            path: ":appointmentId",
            element: <AppointmentDetails />,
          },
        ],
      },
      {
        path: "my-appointments",
        element: <MyAppointmentPage />,
      },

      {
        path: "doctor-verification",
        element: <DentistsVerification />,
      },
      {
        path: "patients",
        element: <AllPatientsList />,
      },

      {
        path: "my-patients",
        children: [
          {
            path: "",
            element: <DentistsPatientsList />,
          },
          {
            path: ":patientId",
            element: <PatientsDetails />,
          },
        ],
      },
      {
        path: "my-prescriptions",
        element: <MyPrescriptionPage />,
      },
      {
        path: "dentists",
        element: <DentistsList />,
      },
      {
        path: "prescriptions",
        element: <DentistsPrescriptionList />,
      },
      {
        path: "schedule",
        element: <DentistsSchedulePage />,
      },
      {
        path: "reviews",
        element: <h2>reviews page</h2>,
      },
      {
        path: "reports",
        element: <AdminReportsMenu />,
      },
      {
        path: "payments",
        element: <DentistsEarningPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <DentistSettingsPage />,
      },
    ],
  },
]);
export default router;
