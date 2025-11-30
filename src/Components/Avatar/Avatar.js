// Avatar.jsx
import React from "react";

const Avatar = ({
  name,
  src,
  size = "md", // sm, md, lg, xl

  className = "",
}) => {
  // Sizes mapping
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-md",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl",
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.split(" ");
    const initials =
      words.length === 1 ? words[0][0] : words[0][0] + words[1][0];
    return initials.toUpperCase();
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`rounded-full object-cover ${sizeClasses[size]}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-full bg-gray-300 text-white font-bold ${sizeClasses[size]}`}>
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
