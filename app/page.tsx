'use client'

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration (replace with your actual configuration)
const firebaseConfig = {
  apiKey: "AIzaSyC5f0QRTbWybRoa3Pr5ooXUECzea4toRGQ",
  authDomain: "cmdh-ai.firebaseapp.com",
  // other config properties
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

if (window.location.hostname === 'localhost') {
  auth.useEmulator('http://localhost:9099/');
}

const LandingPage: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsSignedIn(true);
        console.log('Signed in with Google:', result);
      }).catch((error) => {
        console.error('Error signing in with Google:', error);
      });
  };

  const signInWithGitHub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsSignedIn(true);
        console.log('Signed in with GitHub:', result);
      }).catch((error) => {
        console.error('Error signing in with GitHub:', error);
      });
  };

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
          {!isSignedIn ? (
            <>
              <button onClick={signInWithGoogle} className="mx-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                Sign In with Google
              </button>
              <button onClick={signInWithGitHub} className="mx-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700">
                Sign In with GitHub
              </button>
            </>
          ) : (
            <p className="mt-4 text-xl text-gray-600">Signed in</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
