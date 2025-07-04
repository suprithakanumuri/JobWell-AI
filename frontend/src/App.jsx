import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup.jsx";
import Landingpage from "./pages/landingpage.jsx";
import Dashboard from "./pages/Home/Dashboard.jsx";
import InterviewPrep from "./pages/interviewprep/Interviewprep.jsx";
import UserProvider from './context/userContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const App = () => {
  return (
    <ErrorBoundary>
      <UserProvider>
        <div>
          <Router>
            <Routes>
              <Route path="/" element={<Landingpage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interviewprep" element={<InterviewPrep />} />
              <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
            </Routes>
          </Router>
          <Toaster
            toastOptions={{
              className: "",
              style: {
                fontSize: "13px",
              },
            }}
          />
        </div>
      </UserProvider>
    </ErrorBoundary>
  );
};

export default App;
