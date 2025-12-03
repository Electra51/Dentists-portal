import React from "react";
import treatment from "../../../assets/images/treatment.png";
import PrimaryButton from "../../../Components/PrimaryButton";
import { Link } from "react-router-dom";
import { features, stats } from "../../../Shared/Jsondata";
import { Building } from "lucide-react";
import StatCard from "./StatCard";
import FeatureItem from "./FeatureItem";

const About = () => {
  return (
    <div className="hero min-h-max max-w-7xl mx-auto rounded-md p-2.5 mt-20 lg:mt-44">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
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
