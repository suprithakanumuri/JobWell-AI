import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { motion } from "framer-motion";
import {
  AiOutlineRobot,
  AiOutlineSetting,
  AiOutlineCloud,
  AiOutlineCode,
  AiOutlineDatabase,
  AiOutlineBulb,
} from "react-icons/ai";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false); // ⬅️ control modal

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#1e293b] to-[#3b82f6] text-white relative overflow-hidden">
      {/* Floating tech icons */}
      {[AiOutlineRobot, AiOutlineSetting, AiOutlineCloud, AiOutlineCode, AiOutlineDatabase, AiOutlineBulb].map(
        (Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white opacity-10"
            style={{ top: `${Math.random() * 90}%`, left: `${Math.random() * 90}%` }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity }}
          >
            <Icon size={40 + i * 5} />
          </motion.div>
        )
      )}

      {/* Navbar */}
      <div className="w-full flex justify-between items-center px-6 py-4 border-b border-white/10 z-20 relative">
        <h1 className="text-2xl font-extrabold tracking-wide">JobWell AI</h1>
        {user && (
          <div className="flex items-center gap-4">
            <div className="bg-orange-400 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-right text-sm">
              <span>{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-orange-300 hover:text-orange-100 underline text-xs"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="p-6 md:p-10 z-10 relative">{children}</main>

      {/* Floating Add New Button */}
      <motion.button
        onClick={() => setShowCreateModal(true)} // ← Trigger your modal here
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#6A82FB] font-bold px-6 py-3 rounded-full shadow-lg transition-all"
      >
        + Add New
      </motion.button>

      {/* Modal (conditionally render yours here) */}
      {/* {showCreateModal && <CreateSessionModal onClose={() => setShowCreateModal(false)} />} */}
    </div>
  );
};

export default DashboardLayout;
