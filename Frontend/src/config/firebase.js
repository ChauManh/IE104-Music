import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGDYSWJyr5TYrnqEwfp4ghnkRgxpbTKhM",
  authDomain: "soundtify-c16d2.firebaseapp.com",
  projectId: "soundtify-c16d2",
  storageBucket: "soundtify-c16d2.firebasestorage.app",
  messagingSenderId: "1013021365699",
  appId: "1:1013021365699:web:6832e8fc3d6ed8332f9976"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };