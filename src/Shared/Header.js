import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthProvider";
import {
  LogIn,
  X,
  Menu,
  LayoutDashboard,
  UserIcon,
  LogOut,
} from "lucide-react";
import PrimaryButton from "../Components/PrimaryButton";
import LogoName from "../Components/LogoName";
import { logout } from "../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import defaultProfileImage from "../assets/images/profile.png";
import { useGetUserProfileQuery } from "../redux/api/authApi";

const NavItems = React.memo(({ user, pathname, handleLogOut, token }) => {
  const { data: profileData } = useGetUserProfileQuery();
  const [open, setOpen] = useState(false);
  const profileImage =
    user?.photoURL || profileData?.user?.profileImage || defaultProfileImage;
  return (
    <>
      <Link
        to="/"
        className={`nav-link relative pb-1 group ${
          pathname === "/" ? "active-nav" : ""
        }`}>
        Home
      </Link>
      <Link
        to="/doctors"
        className={`nav-link relative pb-1 group ${
          pathname === "/doctors" ? "active-nav" : ""
        }`}>
        Dentists
      </Link>
      <Link
        to="/appointment"
        className={`nav-link relative pb-1 group ${
          pathname === "/appointment" ? "active-nav" : ""
        }`}>
        Appointment
      </Link>

      <Link
        to="/about"
        className={`nav-link relative pb-1 group ${
          pathname === "/about" ? "active-nav" : ""
        }`}>
        About
      </Link>

      {user?.uid || token ? (
        <div className="relative">
          <img
            src={profileImage}
            alt="avatar"
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-full cursor-pointer border-2 border-blue-100 object-cover"
          />

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-50">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50"
                onClick={() => setOpen(false)}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <Link
                to="dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50"
                onClick={() => setOpen(false)}>
                <UserIcon size={18} />
                Profile
              </Link>

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogOut();
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 w-full text-left">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="w-full lg:w-auto">
          <PrimaryButton>
            <LogIn className="w-5" />
            <span className="pl-2">Login</span>
          </PrimaryButton>
        </Link>
      )}
    </>
  );
});

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = useCallback(() => {
    logOut()
      .then(() => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout error:", err);
      });
  }, [logOut, dispatch, navigate]);

  useEffect(() => {
    let timeout = null;

    const handleScroll = () => {
      if (timeout) return;

      timeout = setTimeout(() => {
        const isScrolled = window.scrollY > 10;
        setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
        timeout = null;
      }, 120);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = useMemo(
    () => (
      <NavItems
        user={user}
        pathname={location.pathname}
        handleLogOut={handleLogOut}
        token={token}
      />
    ),
    [user, location.pathname, token, handleLogOut]
  );

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 border-b border-gray-200 shadow-sm backdrop-blur-md"
          : "bg-[#F5F6FF] backdrop-blur-xl"
      }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-1.5">
        <div className="flex items-center justify-between h-16">
          <LogoName />
          <nav className="hidden lg:flex items-center gap-8">{menuItems}</nav>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => setOpen((prev) => !prev)}>
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}>
          <div className="flex flex-col gap-4 py-4">{menuItems}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
