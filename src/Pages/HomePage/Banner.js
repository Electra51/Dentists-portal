import React from "react";
import banner from "../../assets/images/chair.png";
import PrimaryButton from "../../Components/PrimaryButton";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div
      className="hero min-h-max max-w-7xl mx-auto rounded-md p-6 sm:p-10 mt-20 lg:mt-32 border border-gray-100 shadow-md shadow-slate-100"
      style={{
        backgroundImage: `url("https://i.ibb.co/wNqKDzB/bg.png")`,
      }}>
      <div className="hero-content grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="text-center lg:text-left flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Your New Smile
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>

          <p className="text-[16px] sm:text-[17px] text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-7">
            Find a dentist near you on this website. Check your local dentist's
            opening times, services, facilities, reviews and ratings. And also
            easily schedule an appointment at home.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/appointment">
              <PrimaryButton variant="solid">Get Started</PrimaryButton>
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-full">
            <div
              className="absolute top-4 -left-4 sm:-left-8 lg:left-0 bg-white rounded-2xl shadow-2xl p-4 z-10 max-w-[200px] animate-bounce"
              style={{ animationDuration: "3s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Next Available</div>
                  <div className="font-bold text-gray-800 text-sm">
                    Today 2:30 PM
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-4 -right-4 sm:-right-6 lg:right-0 bg-white rounded-2xl shadow-2xl p-4 z-10 max-w-[200px] animate-bounce"
              style={{ animationDuration: "3s", animationDelay: "1s" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Nearest Clinic</div>
                  <div className="font-bold text-gray-800 text-sm">
                    0.5 km away
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-white rounded-3xl shadow-2xl p-3 sm:p-4 transform hover:scale-105 transition-transform duration-500 m-6 sm:m-11">
              <img
                src={banner}
                alt="dentist-chair"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
