import React from "react";
import ServiceCard from "./ServiceCard";
import SectionHeader from "../../Components/SectionHeader";
import { WormIcon } from "lucide-react";
import { serviceData } from "../../Shared/Jsondata";

const Services = () => {
  return (
    <div className="max-w-7xl mx-auto rounded-md p-6 mt-32">
      <div className="text-center">
        <SectionHeader
          icon={WormIcon}
          label="Our Services"
          title="Services We Provide"
          subtitle="Comprehensive dental care solutions tailored to your needs"
        />
        <div className="flex justify-center mt-6">
          <div className="w-24 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full"></div>
        </div>
      </div>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10">
        {serviceData.map((service) => (
          <ServiceCard key={service.id} service={service}></ServiceCard>
        ))}
      </div>
    </div>
  );
};

export default Services;
