import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Determine actual input type based on showPassword state
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-4">
      {label && <label className="text-[13px] text-slate-800 block mb-1">{label}</label>}
      <div className="relative flex items-center border border-gray-300 rounded px-3 py-2">
        <input
          type={inputType}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={onChange}
        />
        {type === "password" && (
          <span className="ml-2 cursor-pointer text-gray-500" onClick={toggleShowPassword}>
            {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
