import React from 'react';

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated
}) => {
  return (
    <div className='relative z-0 overflow-hidden bg-white'>
      {/* Gradient Background Right Side */}
      <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-tr from-white to-[#d7f4ff] z-0'></div>

      {/* Blobs */}
      <div className='absolute top-0 right-0 z-0 w-[300px] h-[250px]'>
        <div className='w-24 h-24 bg-lime-400 blur-[60px] animate-blob1 absolute top-4 left-8'></div>
        <div className='w-20 h-20 bg-teal-400 blur-[60px] animate-blob2 absolute top-16 right-6'></div>
        <div className='w-20 h-20 bg-cyan-300 blur-[50px] animate-blob3 absolute bottom-4 left-10'></div>
        <div className='w-20 h-20 bg-fuchsia-300 blur-[50px] animate-blob3 absolute bottom-6 right-12'></div>
      </div>

      {/* Foreground Content */}
      <div className='container mx-auto px-6 md:px-10 py-6 md:py-10 relative z-10'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6'>
          {/* Role Info */}
          <div>
            <h2 className='text-2xl font-semibold text-black'>{role || "Role"}</h2>
            <p className='text-sm text-gray-500 mt-1'>
              {topicsToFocus || "No topics specified"}
            </p>
          </div>

          {/* Info Tags */}
          <div className='flex flex-wrap items-center gap-3'>
            <span className='text-[11px] font-medium text-white bg-black px-3 py-1 rounded-full'>
              Experience: {experience || 0} {experience == 1 ? 'year' : 'years'}
            </span>
            <span className='text-[11px] font-medium text-white bg-black px-3 py-1 rounded-full'>
              {questions || 0} Q&A
            </span>
            <span className='text-[11px] font-medium text-white bg-black px-3 py-1 rounded-full'>
              Last Updated: {lastUpdated || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;
