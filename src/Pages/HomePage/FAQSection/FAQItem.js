import { ChevronDown } from "lucide-react";
import React from "react";

const FAQItem = React.memo(({ faq, isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-lg">
        <span className="text-lg font-semibold text-gray-800 pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-6 h-6 text-teal-500 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        aria-hidden={!isOpen}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}>
        <div className="px-6 pb-6 pt-2">
          <p className="text-gray-600 leading-relaxed border-l-4 border-teal-400 pl-4">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
});

export default FAQItem;
