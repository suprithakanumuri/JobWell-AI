
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HERO_IMG_1 from "../assets/HERO_IMG_1 .png";
import HERO_IMG_2 from "../assets/HERO_IMG_2.png";
import HERO_IMG_3 from "../assets/HERO_IMG_3.png";
import HERO_IMG_4 from "../assets/HERO_IMG_4.png";

import { APP_FEATURES } from "../utils/data";
import { LuSparkles } from 'react-icons/lu';
import {
  AiOutlineRobot,
  AiOutlineSetting,
  AiOutlineCloud,
  AiOutlineCode,
  AiOutlineDatabase,
  AiOutlineBulb
} from 'react-icons/ai';

import Modal from '../components/Modal';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import { UserContext } from '../context/userContext';

const images = [HERO_IMG_1, HERO_IMG_2, HERO_IMG_3, HERO_IMG_4];

const LandingPage = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-tr from-[#1e293b] to-[#3b82f6] relative overflow-hidden">
        {[AiOutlineRobot, AiOutlineSetting, AiOutlineCloud, AiOutlineCode, AiOutlineDatabase, AiOutlineBulb].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white opacity-10"
            style={{ top: `${Math.random() * 90}%`, left: `${Math.random() * 90}%` }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity }}
          >
            <Icon size={40 + i * 5} />
          </motion.div>
        ))}

        <div className="container mx-auto px-6 pt-6 pb-20 relative z-10 flex flex-col items-center">
          <header className="flex justify-between items-center w-full max-w-7xl mb-16 text-white">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl font-extrabold tracking-wide"
            >
              JobWell AI
            </motion.div>

            {user ? (
              <div className="flex flex-col items-end gap-2 text-white font-semibold">
                <span>Welcome, {user.name || "User"}!</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-300 hover:text-red-500 underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <motion.button
                onClick={() => setOpenAuthModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] text-sm md:text-base font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-2xl text-white border border-white transition-colors cursor-pointer"
              >
                Login / Sign Up
              </motion.button>
            )}
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 text-[14px] text-purple-400 font-semibold bg-purple-900/30 px-4 py-1 rounded-full border border-purple-700 shadow-sm justify-center mx-auto mb-4">
              <LuSparkles className="text-purple-400" /> AI Enhanced
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Master Interviews with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] animate-text-shine font-extrabold">
                AI-Driven Intelligence
              </span>
            </h1>

            <p className="text-lg text-purple-200 leading-relaxed mb-10 px-4 md:px-0">
              Personalized role-specific questions, instant explanations, and smart note organization — all powered by AI to accelerate your career growth.
            </p>

            <motion.button
              onClick={handleCTA}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-700 hover:bg-purple-900 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg transition-colors cursor-pointer border border-purple-900"
            >
              Get Started Now
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full max-w-5xl mt-14 h-[360px] md:h-[460px] overflow-hidden rounded-xl"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={imageIndex}
                src={images[imageIndex]}
                alt="AI interview visual"
                className="w-full h-full object-cover border-2 border-white rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </AnimatePresence>
          </motion.div>

          <section className="w-full max-w-6xl mt-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-semibold text-center text-white mb-14"
            >
              Features That Empower Your Success
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {APP_FEATURES.map((feature) => (
                <motion.div
                  key={feature.id}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)' }}
                  className="bg-purple-900/50 p-7 rounded-xl shadow-sm border border-purple-700 cursor-pointer transition"
                >
                  <h3 className="text-lg font-semibold mb-3 text-pink-300">{feature.title}</h3>
                  <p className="text-purple-100 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <footer className="text-sm bg-[#1e293b] text-purple-400 text-center py-6 border-t border-purple-700">
          Crafted with 💜 and the power of AI to help you shine bright!
        </footer>

        <Modal
          isOpen={openAuthModal}
          onClose={() => {
            setOpenAuthModal(false);
            setCurrentPage("login");
          }}
          hideHeader
        >
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <Signup setCurrentPage={setCurrentPage} />}
        </Modal>
      </div>
    </>
  );
};

export default LandingPage;
