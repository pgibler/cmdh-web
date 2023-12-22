import * as admin from 'firebase-admin';
import { NextResponse } from "next/server";
import { createCompletion } from "./openai_api";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    // ... other configurations if needed ...
  });
}

export async function POST(request: Request) {
  try {
    // Extract the API key from request headers
    const apiKey = request.headers.get('CMDH_API_KEY');
    if (!apiKey) throw new Error('No API key provided');

    // Verify the API key
    // Assume we have a function to validate API key against Firestore
    const isValidApiKey = await validateApiKey(apiKey);
    if (!isValidApiKey) throw new Error('Invalid API key');

    const { prompt, system } = await request.json();
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
  const usersRef = admin.firestore().collection('users');
  const snapshot = await usersRef.where('apiKey', '==', apiKey).limit(1).get();

  if (snapshot.empty) {
    return false; // API key not found
  }

  // Additional checks can be added here (e.g., checking if the user's account is active)

  return true; // API key is valid
}


