import React, { useState, useCallback, useMemo } from "react";
import { MessageCircleQuestion } from "lucide-react";
import PrimaryButton from "../../../Components/PrimaryButton";
import SectionHeader from "../../../Components/SectionHeader";
import { faqs } from "../../../Shared/Jsondata";
import FAQItem from "./FAQItem";

const FAQAccordion = () => {
  const scrollToContact = useCallback(() => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = useCallback(
    (index) => setOpenIndex((prev) => (prev === index ? null : index)),
    []
  );

  const faqList = useMemo(
    () =>
      faqs.map((faq, index) => (
        <FAQItem
          key={index}
          faq={faq}
          isOpen={openIndex === index}
          onToggle={() => toggleFAQ(index)}
        />
      )),
    [openIndex, toggleFAQ]
  );

  return (
    <div className="px-4 mt-32">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          icon={MessageCircleQuestion}
          label="FAQ"
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our dental services"
        />

        <div className="space-y-4 mt-8">{faqList}</div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <PrimaryButton onClick={scrollToContact}>Contact Us</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;
