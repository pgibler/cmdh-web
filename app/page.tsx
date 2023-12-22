'use client'

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid'; // UUID for API key generation

// Firebase configuration (replace with your actual configuration)
const firebaseConfig = {
  apiKey: "AIzaSyC5f0QRTbWybRoa3Pr5ooXUECzea4toRGQ",
  authDomain: "cmdh-ai.firebaseapp.com",
  projectId: "cmdh-ai",
  // other config properties
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// After initializing Firebase
const firestore = firebase.firestore();

// Optional: If using Firestore emulator
if (window.location.hostname === 'localhost') {
  firestore.useEmulator('localhost', 8080); // Replace with your Firestore emulator port
}

const auth = firebase.auth();

if (window.location.hostname === 'localhost') {
  auth.useEmulator('http://localhost:9099/');
}

const LandingPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [idToken, setIdToken] = useState<string>('');

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      setUser(result.user);
    }).catch((error) => {
      console.error('Error signing in with Google:', error);
    });
  };

  const signInWithGitHub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      setUser(result.user);
    }).catch((error) => {
      console.error('Error signing in with GitHub:', error);
    });
  };

  const generateAndStoreApiKey = () => {
    if (user) {
      const newApiKey = uuidv4();
      const userRef = firebase.firestore().collection('users').doc(user.uid);
      userRef.set({ apiKey: newApiKey }, { merge: true }).then(() => {
        setApiKey(newApiKey);
        alert('API Key generated and stored!');
      }).catch((error) => {
        console.error('Error storing API key:', error);
      });
    }
  };

  useEffect(() => {
    const retrieveApiKey = () => {
      if (user) {
        const userRef = firebase.firestore().collection('users').doc(user.uid);
        userRef.get().then((doc) => {
          if (doc.exists) {
            setApiKey(doc.data()?.apiKey);
          } else {
            alert('No API Key found. Please generate one.');
          }
        }).catch((error) => {
          console.error('Error retrieving API key:', error);
        });
      }
    };

    if (user) {
      retrieveApiKey();
    }
  }, [user]);


  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => {
        setIdToken(token);
      }).catch((error) => {
        console.error('Error getting user ID token:', error);
      });
    }
  }, [user]);

  const copyToClipboard = () => {
    if (user) {
      navigator.clipboard.writeText(apiKey);
    }
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
        <div className="mt-4">
          {user ? (
            <>
              <div className="mt-4 text-xl text-gray-600">Signed in</div>
              <div>
                <button onClick={generateAndStoreApiKey} className="my-2 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700">
                  Generate API Key
                </button>
                <div className="mt-4 text-xl text-gray-600">{apiKey && <div>Your API Key: {apiKey}</div>}</div>
                <button onClick={copyToClipboard} className="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
                  Copy API Key
                </button>
              </div>
            </>
          ) : (
            <>
              <button onClick={signInWithGoogle} className="mx-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                Sign In with Google
              </button>
              <button onClick={signInWithGitHub} className="mx-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700">
                Sign In with GitHub
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
