import About from "./About";
import Banner from "./Banner";
import Contact from "./Contact";
import DentalGallery from "./DentalGallery";
import FAQAccordion from "./FAQAccordion";
import InfoCards from "./InfoCards";
import MakeAppointment from "./MakeAppointment";
import Services from "./Services";
import Testimonial from "./Testimonial";

const Home = () => {
  return (
    <div>
      <Banner />
      <InfoCards />
      <Services />
      <About />
      <MakeAppointment />
      <Testimonial />
      <Contact />
      <FAQAccordion />
      <DentalGallery />
    </div>
  );
};

export default Home;
