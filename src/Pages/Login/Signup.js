/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../redux/api/authApi";
import { AuthContext } from "../../Contexts/AuthProvider";
import LogoName from "../../Components/LogoName";
import FooterTag from "../../Components/FooterTag";
import toast from "react-hot-toast";
import { roles } from "../../Shared/Jsondata";

export default function Signup() {
  const navigate = useNavigate();
  const { googleSignIn } = useContext(AuthContext);
  const [registerUser] = useRegisterUserMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("patient");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [errors, setErrors] = useState({});
  const [signUpError, setSignUpError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSignUpError("");

    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email Address is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email address is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be 6 characters long";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      };

      const res = await registerUser(payload).unwrap();

      toast.success("User registered successfully!");
      navigate("/login");
    } catch (err) {
      console.log(err);
      setSignUpError(err?.data?.message || "Registration failed");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const googleUser = await googleSignIn();
      const userInfo = googleUser.user;

      const payload = {
        name: userInfo.displayName,
        email: userInfo.email,
        password: "",
        googleId: userInfo.uid,
        role: selectedRole,
      };

      await registerUser(payload).unwrap();

      toast.success("Google signup successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setSignUpError("Google signup failed");
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
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 flex flex-col justify-center items-center">
          <LogoName />

          <p className="text-gray-600 text-center ml-5">
            Your New Smile Starts Here
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Join us for exceptional dental care
          </p>

          <div className="space-y-5">
            <div className="flex justify-center items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    placeholder="Create a strong password"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`rounded-lg py-2 border-2 transition-all flex justify-center items-center gap-1.5
                          ${
                            selectedRole === role.id
                              ? "border-teal-500"
                              : "border-gray-300"
                          }`}>
                        <div
                          className={`w-8 h-8 ${role.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-xs font-semibold text-gray-800">
                          {role.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {signUpError && (
              <p className="text-red-500 text-sm">{signUpError}</p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg">
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-teal-600 hover:text-teal-700 font-semibold">
                Log In
              </Link>
            </p>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold py-3 rounded-lg mt-4 flex items-center justify-center gap-2">
              Continue with Google
            </button>
          </div>
        </div>

        <FooterTag />
      </div>
    </div>
  );
}
