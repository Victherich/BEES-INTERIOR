// src/firebaseConfig.js
"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🚀 Export services
export const auth = getAuth(app);
export const db = getFirestore(app);





// ==============================
// 🔴 PAYMENT APP (SECOND PROJECT)
// ==============================


const paymentConfig = {
  apiKey: process.env.NEXT_PUBLIC_PAYMENT_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_PAYMENT_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PAYMENT_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_PAYMENT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_PAYMENT_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_PAYMENT_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_PAYMENT_FIREBASE_MEASUREMENT_ID,
};

// 👇 IMPORTANT: give it a name!
const paymentApp = initializeApp(paymentConfig, "paymentApp");

// Firestore for PAYMENT project
export const paymentDb = getFirestore(paymentApp);