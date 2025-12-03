import React from "react";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import footerBg from "../assets/images/footer.png";
import teeth from "../teeth.json";
import FooterTag from "../Components/FooterTag";
import { Facebook, Linkedin, Twitter } from "lucide-react";
const Footer = () => {
  const footerData = [
    {
      title: "SERVICES",
      links: [
        "Monthly Checkup",
        "Emergency Checkup",
        "Deep Checkup",
        "Weekly Checkup",
      ],
    },
    {
      title: "ORAL HEALTH",
      links: ["Fluoride Treatment", "Cavity Filling", "Teeth Whitening"],
    },
    {
      title: "OUR ADDRESS",
      links: ["House 15, Road No. 32, Dhanmondi Residential Area, Dhaka 1209"],
    },
  ];
  return (
    <div className="mt-20">
      <footer
        className="py-10 bg-base-200 text-base-content rounded-xl"
        style={{
          background: `url(${footerBg}) center/cover no-repeat`,
        }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex flex-col items-center font-semibold text-lg">
            <Lottie animationData={teeth} loop={true} className="w-20 h-20" />
            <span className="font-bold text-gray-800 tracking-wide text-xl lg:text-2xl">
              Dentist - <span className="text-[#5ecdc9]">Portal</span>
            </span>
          </Link>

          {footerData.map((section, index) => (
            <div key={index} className="flex flex-col gap-2 ml-5">
              <span className="footer-title font-semibold text-gray-700">
                {section.title}
              </span>

              {section.links.map((link, i) => (
                <Link
                  key={i}
                  className="link link-hover text-gray-600 hover:text-primary transition-colors">
                  {link}
                </Link>
              ))}
              {section.title === "OUR ADDRESS" && (
                <div className="flex items-center gap-4 mt-3 p-2 bg-white/30 backdrop-blur-sm rounded-lg w-fit">
                  <Link
                    to="/https:facebook.com"
                    className="hover:text-white bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md p-1.5 rounded-md">
                    <Facebook size={20} />
                  </Link>
                  <Link
                    to="/https:facebook.com"
                    className="hover:text-white bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md p-1.5 rounded-md">
                    <Linkedin size={20} />
                  </Link>
                  <Link
                    to="/https:facebook.com"
                    className="hover:text-white bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md p-1.5 rounded-md">
                    <Twitter size={20} />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </footer>

      <FooterTag />
    </div>
  );
};

export default Footer;
