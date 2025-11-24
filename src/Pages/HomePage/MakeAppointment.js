import React from "react";
import { Calendar, Phone } from "lucide-react";
import doctor from "../../assets/images/doctor.png";
import appointmentBg from "../../assets/images/appointment.png";
import PrimaryButton from "../../Components/PrimaryButton";
import { Link } from "react-router-dom";

const MakeAppointment = () => {
  return (
    <section
      className="max-w-7xl mx-auto rounded-md mt-20 lg:mt-32"
      style={{ background: `url(${appointmentBg})` }}>
      <div className="">
        <div className="flex lg:flex-row items-center">
          <img
            src={doctor}
            alt="doctor"
            className="-mt-32 hidden lg:block lg:w-1/2 lg:h-[75vh]"
          />
          <div className="p-10">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Book Your Visit
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Make an Appointment <br />
                <span className="text-white/90">Today</span>
              </h2>

              <p className="text-white/90 text-lg leading-relaxed mb-2">
                Schedule your dental appointment with ease. Our experienced team
                is ready to provide you with exceptional care in a comfortable
                environment.
              </p>

              <Link to={"/appointment"}>
                <PrimaryButton>
                  <Calendar className="w-4 h-4" />
                  <span className="pl-2">Book Appointment Now</span>
                </PrimaryButton>
              </Link>

              <div className="mt-3 pt-4 border-t border-white/20">
                <p className="text-white/80 text-sm mb-1">
                  Available Monday - Saturday, 9AM - 6PM
                </p>
                <p className="text-white font-semibold text-lg flex items-center gap-1.5">
                  <Phone className="w-5 h-5" /> +880-1234-567890
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MakeAppointment;
