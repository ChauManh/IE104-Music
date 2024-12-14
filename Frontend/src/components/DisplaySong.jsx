// import React, { useContext, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { PlayerContext } from '../context/PlayerContext'; // Đảm bảo đường dẫn chính xác
// import { getTrack } from '../util/api';
// const DisplaySong = () => {
//   const { id } = useParams(); // Lấy id từ URL
//   const { setTrack, playWithUri } = useContext(PlayerContext);

//   useEffect(() => {
//     const fetchTrackData = async () => {
//       try {
//         const data = await getTrack(id); // Gọi API với id lấy từ URL

//         setTrack({
//           name: data.name,
//           image: data.image,
//           singer: data.singer,
//           id: data.id,
//           uri: data.uri,
//           duration: data.duration,
//         });

//         playWithUri(data.uri); // Phát bài hát sau khi lấy dữ liệu
//       } catch (error) {
//         alert('Error fetching track:', error.message);
//       }
//     };

//     fetchTrackData();
//   }, []);
  
//   return (
//     <>
//     </>
//   )
// }

// export default DisplaySong