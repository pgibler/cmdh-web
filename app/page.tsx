import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800">cmdh</h1>
        <p className="mt-4 text-xl text-gray-600">
          Create Linux commands from natural language
        </p>
        <div className="mt-4 flex justify-center">
          <a href="https://github.com/pgibler/cmdh" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} className="w-6 h-6 text-gray-800 hover:text-black" />
          </a>
        </div>
        <div className="mt-8">
          <button className="mx-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            Sign Up
          </button>
          <button className="mx-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
