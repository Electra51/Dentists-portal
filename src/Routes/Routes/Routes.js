import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layout/Main";
import About from "../../Pages/About/About";
import Appointment from "../../Pages/Appointment/Appointment";
import ContactUs from "../../Pages/ContactUs/ContactUs";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import ErrorPage from "../../Pages/ErrorPage/ErrorPage";
import Home from "../../Pages/Home/Home";
import Login from "../../Pages/Login/Login";
import Signup from "../../Pages/Login/Signup";
import Reviews from "../../Pages/Reviews/Reviews";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import DashboardLayout from "../../Layout/DashboardLayout";
import Profile from "../../Pages/ProfilePage/Profile";
import DoctorList from "../../Pages/DoctorList/DoctorList";
import DoctorVerification from "../../Pages/DoctorVerification/DoctorVerification";
import Patients from "../../Pages/PatientsList/Patients";
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
        element: <DoctorList />,
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
        element: <h2>Appointments</h2>,
      },
      {
        path: "my-appointments",
        element: <h2>My Appointments</h2>,
      },
      {
        path: "records",
        element: <h2>Medical Records</h2>,
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
        path: "dentists",
        element: <h2>Manage Dentists</h2>,
      },
      {
        path: "prescriptions",
        element: <h2>prescriptions page</h2>,
      },
      {
        path: "schedule",
        element: <h2>schedule page</h2>,
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
        element: <h2>Settings page</h2>,
      },
    ],
  },
]);
export default router;
