import React from "react";
import {
  Award,
  Users,
  Heart,
  Clock,
  Shield,
  Star,
  Dock,
  Zap,
  Smile,
  Target,
  Lamp,
} from "lucide-react";
import appointmentBg from "../../assets/images/appointment.png";
import PrimaryButton from "../../Components/PrimaryButton";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen ">
      <div
        className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-24 px-4 mt-20"
        style={{ background: `url(${appointmentBg})` }}>
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Our Dental Care
          </h1>
          <p className="text-lg text-teal-100 max-w-3xl">
            Your smile is our priority. We provide high-quality dental care with
            modern technology, skilled doctors, and a comfortable environment.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">10+</h3>
            <p className="text-gray-600 text-sm">Years Experience</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">5000+</h3>
            <p className="text-gray-600 text-sm">Happy Patients</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">15+</h3>
            <p className="text-gray-600 text-sm">Special Treatments</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">4.9</h3>
            <p className="text-gray-600 text-sm">Patient Rating</p>
          </div>
        </div>
      </div>

      {/* About Story Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal-400 rounded-full opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=600&fit=crop"
              alt="Modern dental clinic"
              className="rounded-2xl shadow-2xl w-full relative z-10"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg max-w-xs z-10">
              <p className="text-sm text-gray-600 mb-2">Trusted by patients</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-2 font-semibold text-gray-800">5.0</span>
              </div>
            </div>
          </div>

          <div>
            <p className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary text-[12px] font-bold rounded-full uppercase">
              <Dock className="w-[15px]" />{" "}
              <span className="pb-0 mt-0.5">Our Story</span>
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-6">
              Exceptional Dental Care, On Your Terms
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our clinic is dedicated to offering world-class dental care. From
              preventive dentistry to cosmetic procedures, our goal is to ensure
              every patient leaves with a brighter, healthier smile. We
              understand that dental visits can be stressful.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              With advanced equipment and experienced dental professionals, we
              focus on delivering painless and precise treatments tailored to
              each patient's needs.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Flexible Hours
                  </h4>
                  <p className="text-sm text-gray-600">Open 7 days a week</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Safe Care
                  </h4>
                  <p className="text-sm text-gray-600">Highest standards</p>
                </div>
              </div>
            </div>
            <PrimaryButton>Book Appointment</PrimaryButton>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary text-[12px] font-bold rounded-full uppercase">
              <Dock className="w-[15px]" />{" "}
              <span className="pb-0 mt-0.5">Our Expert Team</span>
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              Meet Our Specialists
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of certified dental professionals is committed to
              providing exceptional care with compassion and expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=700&fit=crop"
              alt="Dr. John Doe"
              className="w-full rounded-2xl shadow-xl"
            />

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Dr. John Doe
              </h3>
              <p className="text-teal-600 font-medium mb-4">
                Lead Dental Surgeon
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Dr. John Doe is a certified dental surgeon with over 10+ years
                of experience. He is committed to providing painless,
                comfortable, and personalized treatments that help patients
                achieve their ideal smile. With advanced equipment and
                experienced dental professionals, we focus on delivering
                painless and precise treatments tailored to each patient's
                needs. Our team of certified dental professionals is committed
                to providing exceptional care with compassion and expertise.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-teal-50 rounded-lg flex items-center justify-center">
                    <Award className="w-8 h-8 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Certified Professional
                    </h4>
                    <p className="text-sm text-gray-600">
                      Board certified dental surgeon
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Patient Focused
                    </h4>
                    <p className="text-sm text-gray-600">
                      Personalized treatment plans
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className=" py-20">
        <div className="max-w-7xl mx-auto px-2">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary text-[12px] font-bold rounded-full uppercase">
              <Dock className="w-[15px]" />
              <span className="pb-0 mt-0.5">Our Values</span>
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To provide high-quality, comfortable, and affordable dental care
                using modern technology and a patient-focused approach. We
                strive to make every visit a positive experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted dental care provider and create
                confident smiles for patients from all walks of life. Excellence
                in every treatment, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mt-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary text-[12px] font-bold rounded-full uppercase">
              <Lamp className="w-[15px]" />{" "}
              <span className="pb-0 mt-0.5">Why Choose Us</span>
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              What Makes Us Different
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Modern Technology
              </h3>
              <p className="text-gray-600 leading-relaxed">
                State-of-the-art equipment for precise diagnosis and painless
                treatments
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                <Smile className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Patient Comfort
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Relaxing environment designed to make every visit stress-free
                and comfortable
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Personalized Care
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Customized treatment plans tailored to your unique needs and
                goals
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="mt-16 text-center bg-gradient-to-r from-info to-secondary text-white hover:opacity-90 shadow-md rounded-md py-10 max-w-7xl mx-auto ">
        <div className="px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Smile?
          </h2>
          <p className="text-lg text-blue-50 mb-8">
            Book your appointment today and experience exceptional dental care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={"/appointment"}>
              <button className="bg-white text-teal-600 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold">
                Make an Appointment
              </button>
            </Link>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-teal-600 transition-all font-semibold">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
