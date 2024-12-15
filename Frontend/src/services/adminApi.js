import axios from "axios";

const getAlluser = async () => {
  const token = localStorage.getItem("access_token");
  try {
    return await axios.get("http://localhost:3000/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert(error.message);
  }
};

const getAllPlaylist = async () => {
  const token = localStorage.getItem("access_token");
  try {
    return await axios.get("http://localhost:3000/admin/playlists", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    alert(error.message);
  }
};

const getAllStat = async () => {
  const token = localStorage.getItem("access_token");
  try {
    return await axios.get("http://localhost:3000/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    alert(error.message);
  }
};

const deleteUser = async (userId) => {
  const token = localStorage.getItem("access_token");
  try {
    await axios.delete(`http://localhost:3000/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    alert(error.message);
  }
};

const updateUser = async (userId, userForm) => {
  const token = localStorage.getItem("access_token");
  try {
    await axios.put(`http://localhost:3000/admin/users/${userId}`, userForm, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    alert(error.message);
  }
};

const createUser = async (userForm) => {
  const token = localStorage.getItem("access_token");
  try {
    await axios.post("http://localhost:3000/admin/users", userForm, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    alert(error.message);
  }
};

export {
  getAlluser,
  getAllPlaylist,
  getAllStat,
  deleteUser,
  updateUser,
  createUser,
};
