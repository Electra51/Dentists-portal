/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Mail, Lock, Eye, EyeOff, Users, Stethoscope } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LogoName from "../../Components/LogoName";
import FooterTag from "../../Components/FooterTag";
import { AuthContext } from "../../Contexts/AuthProvider";
import { authApi, useLoginUserMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function Login() {
  const navigate = useNavigate();
  const { googleSignIn } = useContext(AuthContext);
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("0");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const roles = [
    {
      id: "0",
      label: "Patient",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      id: "1",
      label: "Doctor",
      icon: Stethoscope,
      color: "bg-green-500",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoginError("");

    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Auto-role for admin
      let finalRole = selectedRole;
      if (formData.email === "admin@gmail.com") {
        finalRole = "2"; // doctor role → change to "0" if needed
      }

      const payload = {
        email: formData.email,
        password: formData.password,
        role: finalRole,
      };

      const res = await loginUser(payload).unwrap();

      localStorage.setItem("token", res.token);
      toast.success("Login Successful!");

      // ✅ IMPORTANT: Redux cache reset করুন
      dispatch(authApi.util.resetApiState());

      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      console.log(err);
      setLoginError(err?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleUser = await googleSignIn();
      const userInfo = googleUser.user;

      const payload = {
        email: userInfo.email,
        password: "",
        googleId: userInfo.uid,
        role: selectedRole,
      };

      const res = await loginUser(payload).unwrap();

      localStorage.setItem("token", res.token);
      toast.success("Google Login Successful!");

      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      console.log(err);
      setLoginError("Google login failed");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 flex flex-col justify-center items-center">
          <LogoName />
          <p className="text-gray-600 text-center ml-5">
            Your New Smile Starts Here
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome Back
          </h2>

          <div className="space-y-6">
            {/* ROLE SELECTION */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`rounded-lg py-2 border-2 transition-all flex justify-center items-center gap-2 
                    ${
                      selectedRole === role.id
                        ? "border-teal-500"
                        : "border-gray-300"
                    }`}>
                    <div
                      className={`w-8 h-8 ${role.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {role.label}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg">
              Log In
            </button>

            <p className="text-center text-sm text-gray-600">
              New to Dentist Portal?{" "}
              <Link
                to="/signup"
                className="text-teal-600 hover:text-teal-700 font-semibold">
                Sign Up
              </Link>
            </p>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* GOOGLE LOGIN */}
            <button
              onClick={handleGoogleLogin}
              className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
              Continue with Google
            </button>
          </div>
        </div>

        <FooterTag />
      </div>
    </div>
  );
}
