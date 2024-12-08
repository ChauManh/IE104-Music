import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup  } from "firebase/auth";
import { auth } from '../config/firebase';

const createUser = async (name, email, password) => {
    try {
        const result = await axios.post("http://localhost:3000/auth/signup", {
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

const fetchAlbum = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3000/album/${id}`);
        return response.data;
    } catch (error) {
        alert(error.message);
    }
}

const getWebPlayBackSDKToken = async () => {
    try {
        const response = await axios.get("/auth/login");
        console.log("token", response)
        const res = await axios.get("http://localhost:3000/spotify_auth/token");
        return res.data;
    } catch (error) {
        alert(error.message);
    }
};

const getRefreshToken = async (refreshToken) => {
    try {
        const response = await axios.get("http://localhost:3000/spotify_auth/refresh_token");
        console.log("refresh token", response.data.token)
        return response.data.token;
    } catch (error) {
        alert(error.message);
    }
};

const login = async (email, password) => {
    try {
        const response = await axios.post("http://localhost:3000/auth/login", {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error("API login error:", error);
        throw error;
    }
};

const createPlaylist = async (name) => {
    try {
        const token = localStorage.getItem('access_token'); // Get token from localStorage
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.post("http://localhost:3000/user/create_playlist", { name }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.playlist; // Return the playlist object
    }
    catch (error) { 
        console.error("API createPlaylist error:", error);
        throw error;
    }   
};

const addSongToPlaylist = async (playlistId, trackId) => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.post("http://localhost:3000/user/add_song_to_playlist", { playlistId, trackId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("API addSongToPlaylist error:", error);
        throw error;
    }
};

const getArtist = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3000/artist/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getArtistAlbums = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3000/artist/${id}/albums`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getArtistTopTracks = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3000/artist/${id}/top-tracks`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getRelatedArtists = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3000/artist/${id}/related-artists`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add track to favorites
const addLikedSong = async (trackId) => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.post('http://localhost:3000/user/favorites/add', 
            { trackId },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        console.error('API addLikedSong error:', error);
        throw error;
    }
};

// Remove track from favorites
const removeLikedSong = async (trackId) => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.delete('http://localhost:3000/user/favorites/remove', 
            {
                headers: { Authorization: `Bearer ${token}` },
                data: { trackId }
            }
        );
        return response.data;
    } catch (error) {
        console.error('API removeLikedSong error:', error);
        throw error;
    }
};

// Follow artist
const followArtist = async (artistId) => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.post('http://localhost:3000/user/artists/follow',
            { artistId },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        console.error('API followArtist error:', error);
        throw error;
    }
};

// Unfollow artist
const unfollowArtist = async (artistId) => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.delete('http://localhost:3000/user/artists/unfollow',
            {
                headers: { Authorization: `Bearer ${token}` },
                data: { artistId }
            }
        );
        return response.data;
    } catch (error) {
        console.error('API unfollowArtist error:', error);
        throw error;
    }
};

const addLikedAbum = async (albumId) => { 
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.post('http://localhost:3000/user/albums/add',
            { albumId },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        console.error('API addLikedAlbum error:', error);
        throw error;
    }
}

const removeLikedAlbum = async (albumId) => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No access token found');
        }

        const response = await axios.delete('http://localhost:3000/user/albums/remove',
            {
                headers: { Authorization: `Bearer ${token}` },
                data: { albumId }
            }
        );
        return response.data;
    } catch (error) {
        console.error('API removeLikedAlbum error:', error);
        throw error;
    }
}

const signInWithGoogle = async () => {
    try {
        if (!auth) {
            throw new Error('Firebase authentication not initialized');
        }
        
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // Call backend to create/login user with Google credentials
        const response = await axios.post("http://localhost:3000/auth/google", {
            email: result.user.email,
            name: result.user.displayName,
            googleId: result.user.uid
        });
        
        return response.data;
    } catch (error) {
        console.error("Google auth error:", error);
        if (error.code === 'auth/configuration-not-found') {
            throw new Error('Firebase configuration error. Please check your setup.');
        }
        throw error;
    }
};

export { 
    createUser, 
    fetchPopularTracks, 
    fetchNewAlbums, 
    fetchAlbum, 
    getTrack, 
    getWebPlayBackSDKToken, 
    getRefreshToken, 
    login, 
    createPlaylist, 
    addSongToPlaylist,
    getArtist, 
    getArtistAlbums, 
    getArtistTopTracks, 
    getRelatedArtists, 
    addLikedSong, 
    removeLikedSong, 
    followArtist, 
    unfollowArtist,
    addLikedAbum,
    removeLikedAlbum,
    signInWithGoogle };
