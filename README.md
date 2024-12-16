SOUNDTIFY
-
Xin chào tất cả mọi người, đây là đồ án môn học IE106 của nhóm chúng mình. Nhóm sinh viên trường ĐHCNTT TP.HCM (UIT)
-
| HỌ VÀ TÊN                |  MSSV        | 
|------------              |--------------|
| Châu Đức Mạnh            | 22520846     |
| Dương Anh Vũ             | 22521688     |
| Nguyễn Công Nam Triều    | 22521533     |
| Trần Quốc Trung          | 22521569     |

Soundtify là một ứng dụng web nghe nhạc, kết hợp các tính năng nổi bật từ SoundCloud và Spotify, mang đến trải nghiệm âm nhạc đa dạng và phong phú.

Soundtify là nền tảng âm nhạc trực tuyến giúp người dùng khám phá, nghe nhạc và quản lý playlist cá nhân. Ứng dụng hướng đến giao diện thân thiện và hiệu năng cao.

Tính năng:
-
Phát nhạc trực tuyến: Hỗ trợ phát nhạc chất lượng cao thông qua Spotify Web Playback SDK.
Quản lý playlist: Tạo và chỉnh sửa playlist cá nhân.

Tìm kiếm bài hát: Tìm kiếm nhanh chóng bài hát, album hoặc nghệ sĩ.

Công nghệ sử dụng:
-
Frontend: ReactJS, TailwindCSS

Backend: Node.js, Express.js

Cơ sở dữ liệu: MongoDB

API: Spotify API

Cách cài đặt:
-
Bước 1: Clone repository:

Bước 2: Cài đặt dependencies:

`cd Backend`

`npm install`

Tạo 1 cửa sổ terminal mới:

`cd Frontend`

`npm install`

Cấu hình môi trường:
-
Tạo file .env trong thư mục gốc và thêm các biến môi trường cần thiết:

+ tạo 1 file giống .env giống với .env.example vào trong Frontend/src
+ Firebase Configuration : tìm hiểu firebase để có các key dưới đây
```
VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=
```
+ tạo 1 file giống .env giống với .env.example vào trong Backend/src
+ Để có các key dưới đây, vui lòng tìm hiểu Web Playback SDK (Lưu ý để phát được nhạc cần có tài khoản Spotify Premium). Riêng JWT_SECRET: tạo 1 chuỗi bất kỳ để làm key cho ứng dụng của bạn
```
SPOTIFY_CLIENT_ID=your_spotify_client_id 

SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

SPOTIFY_REDIRECT_URI=http://localhost:3000/callback (use can change this on Web PlayBack SDK)

JWT_SECRET=your_jwt_secret
```
Chạy ứng dụng:
-
`cd Backend`

`npm run dev`

+ Tạo 1 cửa sổ terminal mới:

`cd Frontend`

`npm run dev`

Tận hưởng web Soundtify
-
Mọi thắc mắc liên hệ email: 22520846@gm.uit.edu.vn
