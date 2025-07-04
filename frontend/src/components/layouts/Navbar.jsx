import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-16 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-sm px-6 z-50"
    >
      <div className="container mx-auto flex items-center justify-between h-full">
        <Link to="/dashboard">
          <h2 className="text-white font-extrabold text-lg md:text-xl tracking-wide bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
            JobWell AI
          </h2>
        </Link>
      </div>
    </motion.div>
  );
};

export default Navbar;
