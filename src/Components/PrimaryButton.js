import React from "react";

const PrimaryButton = ({
  children,
  variant = "solid",
  className = "",
  onClick,
}) => {
  const baseClasses =
    "btn btn-primary px-4 py-2 rounded-lg font-semibold transition-all duration-300";

  const variants = {
    solid:
      "bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md",
    outline:
      "border-2 border-info text-info bg-transparent hover:bg-info hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default PrimaryButton;
