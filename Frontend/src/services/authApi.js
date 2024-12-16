import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";

const createUser = async (name, email, password) => {
  try {
    const result = await axios.post("http://localhost:3000/auth/signup", {
      name: name,
      email: email,
      password: password,
      role: "user",
    });
    return result;
  } catch (error) {
    alert(error);
    return null;
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("API login error:", error);
    throw error;
  }
};

const forgotPassword = async (email) => {
  try {
    await axios.post("http://localhost:3000/auth/forgot-password", { email });
  } catch (error) {
    console.error("API forgot-password error:", error);
    throw error;
  }
};

const verifyOtp = async (email, otpString) => {
  try {
    await axios.post('http://localhost:3000/auth/verify-otp', {
      email,
      otp: otpString
  });
  } catch (error) {
    console.error("API verifyOtp error:", error);
    throw error;
  }
};

const resetPassword = async (email, otpString, newPassword) => {
  try {
    return await axios.post('http://localhost:3000/auth/reset-password', {
      email,
      otp: otpString,
      newPassword
  });
  } catch (error) {
    console.error("API verifyOtp error:", error);
    throw error;
  }
};


const signInWithGoogle = async () => {
  try {
    if (!auth) {
      throw new Error("Firebase authentication not initialized");
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Call backend to create/login user with Google credentials
    const response = await axios.post("http://localhost:3000/auth/google", {
      email: result.user.email,
      name: result.user.displayName,
      googleId: result.user.uid,
    });

    return response.data;
  } catch (error) {
    console.error("Google auth error:", error);
    if (error.code === "auth/configuration-not-found") {
      throw new Error("Firebase configuration error. Please check your setup.");
    }
    throw error;
  }
};

const getWebPlayBackSDKToken = async () => {
  try {
    const res = await axios.get("http://localhost:3000/spotify_auth/token");
    console.log("res", res);
    return res.data;
  } catch (error) {
    alert(error.message);
  }
};

const getRefreshToken = async (refreshToken) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/spotify_auth/refresh_token`,
      {
        params: { refresh_token: refreshToken }, // Truyền refresh_token qua query
      },
    );
    return response.data;
  } catch (error) {
    alert(error.message);
  }
};

const getSpotifyToken = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/spotify_auth/token",
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Spotify token:", error);
    throw error;
  }
};

export {
  createUser,
  getWebPlayBackSDKToken,
  getRefreshToken,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  signInWithGoogle,
  getSpotifyToken,
};
