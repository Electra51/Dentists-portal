import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../Components/PrimaryButton";
import { reviewsData } from "../../Shared/Jsondata";
import TestimonialCard from "./TestimonialCard";
import SectionHeader from "../../Components/SectionHeader";

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reviewsData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + reviewsData.length) % reviewsData.length
    );
  };

  return (
    <section className="px-4 mt-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <SectionHeader
            icon={Quote}
            label="Testimonials"
            title="What Our Patients Say"
            subtitle="Real feedback from our valued patients"
          />

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md  rounded-full flex items-center justify-center hover:bg-primary/80 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reviewsData.map((review, index) => (
            <TestimonialCard
              key={review.id}
              review={review}
              isActive={index === currentSlide}
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-8 md:hidden">
          {reviewsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="flex md:hidden justify-center gap-4 mt-6">
          <button
            onClick={prevSlide}
            className="px-6 py-3 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-50">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="px-6 py-3 bg-primary text-white rounded-full shadow hover:bg-primary/80">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-16 text-center bg-gradient-to-r from-info to-secondary text-white hover:opacity-90 shadow-md rounded-md py-10 px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Experience Exceptional Care?
          </h3>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Join hundreds of satisfied patients who trust us with their dental
            health.
          </p>
          <Link to={"/appointment"}>
            <PrimaryButton
              variant="outline"
              className=" border border-white bg-white">
              Book Appointment
            </PrimaryButton>
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-[#5ecdc9]">500+</p>
            <p className="text-gray-600 tracking-wider uppercase">
              Happy Patients
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#5ecdc9]">4.9/5</p>
            <p className="text-gray-600 tracking-wider uppercase">Avg Rating</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#5ecdc9]">98%</p>
            <p className="text-gray-600 tracking-wider uppercase">
              Satisfaction Rate
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#5ecdc9]">15+</p>
            <p className="text-gray-600 tracking-wider uppercase">
              Years Experience
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
