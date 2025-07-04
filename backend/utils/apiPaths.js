// src/utils/apiPaths.js

// ✅ Vite-compatible base URL
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    GET_PROFILE: `${BASE_URL}/auth/profile`,
  },

  IMAGE: {
    UPLOAD_IMAGE: `${BASE_URL}/auth/upload-image`,
  },

  AI: {
    GENERATE_QUESTIONS: `${BASE_URL}/ai/generate-questions`,
    GENERATE_EXPLANATION: `${BASE_URL}/ai/explain-concept`,
    GENERATE_SHORT_ANSWER: `${BASE_URL}/ai/generate-short-answer`, // ✅ Added this missing endpoint
  },

  SESSION: {
    CREATE: `${BASE_URL}/sessions/create`,
    GET_ALL: `${BASE_URL}/sessions/my-sessions`,
    GET_ONE: (id) => `${BASE_URL}/sessions/${id}`,
    DELETE: (id) => `${BASE_URL}/sessions/${id}`,
  },

  QUESTION: {
    ADD_TO_SESSION: `${BASE_URL}/questions/add`,
    PIN: (id) => `${BASE_URL}/questions/${id}/pin`,
    NOTE: (id) => `${BASE_URL}/questions/${id}/note`,
  },
};
