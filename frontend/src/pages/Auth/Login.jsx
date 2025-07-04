import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError('Please fill in both fields.');
    }

    setError(null);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col justify-center w-full max-w-md mx-auto px-6 py-8"
    >
      <h3 className="text-2xl font-extrabold text-black mb-3">Welcome Back!</h3>
      <p className="text-sm text-gray-600 mb-6">
        Enter your credentials to access your AI-powered interview toolkit.
      </p>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold text-gray-800">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-800">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-yellow-100 hover:text-black border border-yellow-300 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-5 text-sm text-gray-700 text-center">
        New here?{' '}
        <button
          onClick={() => setCurrentPage('signup')}
          className="text-amber-600 font-semibold underline hover:text-amber-800"
        >
          Create an Account
        </button>
      </p>
    </motion.div>
  );
};

export default Login;
