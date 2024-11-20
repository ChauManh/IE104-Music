import axios from 'axios';

const createUser = async (name, email, password) => {
    try {
        const result = await axios.post("http://localhost:3000/v1/api/register", {
            name: name,
            email: email,
            password: password,
            role: "user"
        });
        return result;
    } catch (error) {
        alert(error);
        return null;
    }
};

const getTrack = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3000/track/${id}`);
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

const fetchPopularTracks = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/track/popular`);
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

const fetchNewAlbums = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/album/new`);
        return response.data;
    } catch (error) {
        alert(error.message);
    }
};

const getWebPlayBackSDKToken = async () => {
    try {
        const response = await axios.get("/auth/login");
        console.log("token", response)
        const res = await axios.get("http://localhost:3000/auth/token");
        return res.data;
    } catch (error) {
        alert(error.message);
    }
};

const getRefreshToken = async (refreshToken) => {
    try {
        const response = await axios.get("http://localhost:3000/auth/refresh_token");
        console.log("refresh token", response.data.token)
        return response.data.token;
    } catch (error) {
        alert(error.message);
    }
};

const login = async (email, password) => {
    try {
        const response = await axios.post("http://localhost:3000/v1/api/login", {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error("API login error:", error);
        throw error;
    }
};

export { createUser, fetchPopularTracks, fetchNewAlbums, getTrack, getWebPlayBackSDKToken, getRefreshToken, login };
