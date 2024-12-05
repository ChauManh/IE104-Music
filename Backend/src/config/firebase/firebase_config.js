// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGDYSWJyr5TYrnqEwfp4ghnkRgxpbTKhM",
  authDomain: "soundtify-c16d2.firebaseapp.com",
  projectId: "soundtify-c16d2",
  storageBucket: "soundtify-c16d2.firebasestorage.app",
  messagingSenderId: "1013021365699",
  appId: "1:1013021365699:web:6832e8fc3d6ed8332f9976"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);