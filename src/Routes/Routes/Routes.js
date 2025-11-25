import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layout/Main";
import ContactUs from "../../Pages/ContactUs/ContactUs";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import ErrorPage from "../../Pages/ErrorPage/ErrorPage";
import Login from "../../Pages/Login/Login";
import Signup from "../../Pages/Login/Signup";
import Reviews from "../../Pages/Reviews/Reviews";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import DashboardLayout from "../../Layout/DashboardLayout";
import Profile from "../../Pages/ProfilePage/Profile";
import DoctorList from "../../Pages/DoctorList/DoctorList";
import DoctorVerification from "../../Pages/DoctorVerification/DoctorVerification";
import Patients from "../../Pages/PatientsList/Patients";
import About from "../../Pages/AboutPage/About";
import Home from "../../Pages/HomePage/Home";
import Appointment from "../../Pages/AppointmentPage/Appointment";
import DentistSettingsPage from "../../Pages/DoctorDashboardPage/DentistSettingsPage";
import DoctorSchedule from "../../Pages/DoctorDashboardPage/DoctorSchedule";
import DoctorAppointment from "../../Pages/DoctorDashboardPage/DoctorAppointment";
import DentistsPage from "../../Pages/DentistsMenuPage/DentistsPage";
import DentistDetailsPage from "../../Pages/DentistsMenuPage/DentistDetailsPage";
import AppointmentBookingPage from "../../Pages/DentistsMenuPage/AppointmentBookingPage";
import MyAppointmentPage from "../../Pages/PatientsDashboardPage/MyAppointmentPage";
import DentistsPatientsPage from "../../Pages/DoctorDashboardPage/DentistsPatientsPage";
import AllPrescriptionListDoctor from "../../Pages/DoctorDashboardPage/AllPrescriptionListDoctor";
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
      {
        path: "/contactUs",
        element: <ContactUs />,
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
        element: <DoctorAppointment />,
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
        element: <DentistsPatientsPage />,
      },

      {
        path: "dentists",
        element: <DoctorList />,
      },
      {
        path: "prescriptions",
        element: <AllPrescriptionListDoctor />,
      },
      {
        path: "schedule",
        element: <DoctorSchedule />,
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
