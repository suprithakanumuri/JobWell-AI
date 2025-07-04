// ✅ CreateSessionForm.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from 'react-router-dom';

const CreateSessionForm = ({ onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    topicsToFocus: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Generate AI questions
      const aiRes = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: formData.role,
        experience: formData.experience,
        topicsToFocus: formData.topicsToFocus,
        numberOfQuestions: 10,
      });
      let questions = aiRes.data?.questions || aiRes.data;
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('No questions generated.');
      }
      // Ensure each question is an object with a question property
      questions = questions.map(q => typeof q === 'string' ? { question: q } : q);

      // 2. Create session with generated questions
      const sessionPayload = {
        ...formData,
        questions,
      };
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, sessionPayload);
      toast.success("Session created!");
      const sessionId = response.data?.session?._id;
      if (sessionId) {
        onClose();
        navigate(`/interview-prep/${sessionId}`);
      }
    } catch (error) {
      console.error("Error creating session:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || error.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-3">Start a New Interview Journey</h2>
      <p className="text-sm mb-6 text-gray-500">
        Fill out a few quick details and unlock your personalized set of interview questions!
      </p>

      <label className="block text-sm mb-1 font-medium">Target Role</label>
      <input
        type="text"
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="input-box"
        placeholder="e.g. Frontend Developer, UI/UX Designer, etc."
        required
      />

      <label className="block text-sm mb-1 font-medium mt-4">Years of Experience</label>
      <input
        type="text"
        name="experience"
        value={formData.experience}
        onChange={handleChange}
        className="input-box"
        placeholder="e.g. 1 year, 3 years, 5+ years"
        required
      />

      <label className="block text-sm mb-1 font-medium mt-4">Topics to Focus on</label>
      <input
        type="text"
        name="topicsToFocus"
        value={formData.topicsToFocus}
        onChange={handleChange}
        className="input-box"
        placeholder="Comma-separated, e.g. React, Node.js, MongoDB"
        required
      />

      <label className="block text-sm mb-1 font-medium mt-4">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="input-box"
        placeholder="Any specific goals or notes for this session"
        rows={3}
      />

      <button type="submit" className="btn-primary mt-4" disabled={loading}>
        {loading ? 'Generating Questions...' : 'Create Session'}
      </button>

      <button
        type="button"
        onClick={onClose}
        className="text-sm mt-3 text-gray-500 underline"
      >
        Close
      </button>
    </form>
  );
};

export default CreateSessionForm;
