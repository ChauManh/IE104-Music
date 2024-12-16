import { getRefreshToken } from "../services/authApi";

export const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  const expires_in = localStorage.getItem("expires_in"); // Thời gian hết hạn (timestamp)
  
  if (!refresh_token || !expires_in) {
    // alert("Đăng nhập để nghe nhạc")
    // localStorage.clear();
    // window.location.href = "http://localhost:5173/signin";
    return;
  }

  // Kiểm tra nếu gần hết hạn (trước 5 phút)
  const currentTime = Date.now();
  const bufferTime = 5 * 60 * 1000; // 5 phút dưới dạng milliseconds
  const expired_at = Number(expires_in);

  if (currentTime < expired_at - bufferTime) {
    console.log("Token vẫn còn hiệu lực, không cần làm mới.");
    return; // Token vẫn còn hiệu lực
  }

  try {
    console.log("Refreshing access token...");
    const tokenData = await getRefreshToken(refresh_token);

    // Lưu token mới và thời gian hết hạn mới
    const newExpiredAt = Date.now() + tokenData.expires_in * 1000; // `expires_in` là giây
    localStorage.setItem("web_playback_token", tokenData.access_token);
    localStorage.setItem("expired_at", newExpiredAt.toString());

    return tokenData.access_token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    localStorage.clear();
    window.location.href = "http://localhost:5173/signin";
    return null;
  }
};

