import axios from "axios";

const searchContent = async (query) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No access token found");

    const response = await axios.get("http://localhost:3000/search", {
      params: { q: query, type: "track,artist,album" },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching content:", error);
    throw error;
  }
};

export { searchContent };
