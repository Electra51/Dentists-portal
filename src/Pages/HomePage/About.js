import React from "react";
import treatment from "../../assets/images/treatment.png";
import PrimaryButton from "../../Components/PrimaryButton";

import { Link } from "react-router-dom";
import { features, stats } from "../../Shared/Jsondata";
import { Building } from "lucide-react";

const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 group">
    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-r from-secondary to-info text-white hover:opacity-90  group-hover:scale-110 transition-all duration-300">
      <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
    </div>
    <span className="text-gray-700 font-medium">{text}</span>
  </div>
);

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="flex items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
    <div className="w-12 h-12 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900">{number}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </div>
);

const About = () => {
  return (
    <div className="hero min-h-max rounded-md p-10 mt-20 lg:mt-32">
      <div className="hero-content grid grid-cols-1 lg:grid-cols-2 gap-14">
        <img
          src={treatment}
          alt="dentist-chair"
          className="lg:w-full rounded-lg shadow-2xl"
        />
        <div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex gap-1.5 items-center mb-4 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-full uppercase tracking-wider">
              <Building />
              <span className="">About Us</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Exceptional Dental Care,{" "}
              <span className="text-[#5ecdc9]">on Your Terms</span>
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              We understand that dental visits can be stressful. That's why
              we've created a comfortable, modern environment where your care
              comes first. Most procedures are quick and painless, with numbing
              that ensures your comfort throughout the treatment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <FeatureItem key={index} {...feature} />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to={"/about"}>
                <PrimaryButton>Learn More</PrimaryButton>
              </Link>
              <Link to={"/appointment"}>
                <PrimaryButton variant="outline">
                  Book Appointment
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
