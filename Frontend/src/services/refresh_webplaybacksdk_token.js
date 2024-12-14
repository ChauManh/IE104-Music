import { useEffect } from "react";
import { getRefreshToken } from "../util/authApi";

const useTokenRefresh = (onTokenRefreshSuccess) => {
  useEffect(() => {
    let timeoutId;

    const refreshAccessToken = async () => {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) {
        console.log("No refresh token found");
        return;
      }

      try {
        console.log("Refreshing access token...");
        const tokenData = await getRefreshToken(refresh_token);
        localStorage.setItem("web_playback_token", tokenData.access_token);
        console.log("Access token refreshed:", tokenData.access_token);

        // Gọi callback khi làm mới thành công
        if (onTokenRefreshSuccess) {
          onTokenRefreshSuccess(tokenData.access_token);
        }

        // Lên lịch làm mới token trước khi hết hạn (ví dụ: 5 phút trước khi hết hạn)
        timeoutId = setTimeout(refreshAccessToken, 60 * 1000);
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    };

    // Lần đầu gọi hàm refresh sau 55 phút để tránh lỗi
    timeoutId = setTimeout(refreshAccessToken, 60 * 1000);

    // Dọn dẹp timeout khi component unmount
    return () => clearTimeout(timeoutId);
  }, [onTokenRefreshSuccess]);
};

export default useTokenRefresh;
