import { NextResponse } from "next/server";
import { createCompletion } from "./openai_api";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

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
if (process.env.NODE_ENV === 'development') {
  firestore.useEmulator('localhost', 8080); // Replace with your Firestore emulator port
}

export async function POST(request: Request) {
  try {
    const { prompt, system, apiKey } = await request.json();
    if (!apiKey) throw new Error('No API key provided');

    // Verify the API key
    // Assume we have a function to validate API key against Firestore
    const isValidApiKey = await validateApiKey(apiKey);
    if (!isValidApiKey) throw new Error('Invalid API key');
    const text = await createCompletion(prompt, system);

    return new NextResponse(JSON.stringify({ text }));
  } catch (error) {
    let errorMessage = 'Unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 401,
    });
  }
}

async function validateApiKey(apiKey: string) {
  const usersRef = firestore.collection('users');
  const snapshot = await usersRef.where('apiKey', '==', apiKey).limit(1).get();

  if (snapshot.empty) {
    return false; // API key not found
  }

  // Additional checks can be added here (e.g., checking if the user's account is active)

  return true; // API key is valid
}


