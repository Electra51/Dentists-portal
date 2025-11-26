import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layout/Main";
import ErrorPage from "../../Pages/ErrorPage/ErrorPage";
import Login from "../../Pages/Login/Login";
import Signup from "../../Pages/Login/Signup";
import Reviews from "../../Pages/Reviews/Reviews";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import DashboardLayout from "../../Layout/DashboardLayout";
import Profile from "../../Pages/DashboardPages/ProfilePage/Profile";
import DoctorList from "../../Pages/DoctorList/DoctorList";
import DoctorVerification from "../../Pages/DoctorVerification/DoctorVerification";
import Patients from "../../Pages/PatientsList/Patients";
import About from "../../Pages/AboutPage/About";
import Home from "../../Pages/HomePage/Home";
import Appointment from "../../Pages/AppointmentPage/Appointment";
import DentistsPage from "../../Pages/DentistsMenuPage/DentistsPage";
import DentistDetailsPage from "../../Pages/DentistsMenuPage/DentistDetailsPage";
import AppointmentBookingPage from "../../Pages/DentistsMenuPage/AppointmentBookingPage";
import Dashboard from "../../Pages/DashboardPages/Dashboard";
import MyPrescriptionPage from "../../Pages/DashboardPages/DashboardForPatients/MyPrescriptionPage";
import MyAppointmentPage from "../../Pages/DashboardPages/DashboardForPatients/MyAppointmentPage";
import DentistsAppointmentList from "../../Pages/DashboardPages/DashboardForDentists/DentistsAppointmentList";
import DentistsPatientsList from "../../Pages/DashboardPages/DashboardForDentists/DentistsPatientsList";
import DentistsPrescriptionList from "../../Pages/DashboardPages/DashboardForDentists/DentistsPrescriptionList";
import DentistsSchedulePage from "../../Pages/DashboardPages/DashboardForDentists/DentistsSchedulePage";
import DentistSettingsPage from "../../Pages/DashboardPages/DashboardForDentists/DentistSettingsPage";
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
        element: <DentistsPage />,
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
        path: "appointments",
        element: <DentistsAppointmentList />,
      },
      {
        path: "my-appointments",
        element: <MyAppointmentPage />,
      },

      {
        path: "doctor-verification",
        element: <DoctorVerification />,
      },
      {
        path: "patients",
        element: <Patients />,
      },
      {
        path: "my-patients",
        element: <DentistsPatientsList />,
      },
      {
        path: "my-prescriptions",
        element: <MyPrescriptionPage />,
      },
      {
        path: "dentists",
        element: <DoctorList />,
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
        element: <h2>Reports</h2>,
      },
      {
        path: "payments",
        element: <h2>payments page</h2>,
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
