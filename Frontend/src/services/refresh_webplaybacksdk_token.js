import { useEffect } from 'react';

const useTokenRefresh = () => {
  useEffect(() => {
    const refreshAccessToken = async () => {
      const refresh_token = localStorage.getItem('refresh_token');
      if (!refresh_token) return;

      try {
        const tokenData = await refreshToken(refresh_token);
        localStorage.setItem('access_token', tokenData.access_token);
        console.log('Access token refreshed:', tokenData.access_token);

        // Lên lịch làm mới token trước khi hết hạn (ví dụ: 5 phút trước khi hết hạn)
        setTimeout(refreshAccessToken, (tokenData.expires_in - 300) * 1000);
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    };

    // Bắt đầu làm mới token ngay lần đầu
    refreshAccessToken();
  }, []);
};

export default useTokenRefresh;
