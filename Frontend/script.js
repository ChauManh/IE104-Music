const showFriendsButton = document.querySelector('.show-friends');
const friendList = document.querySelector('.friend_list');

showFriendsButton.addEventListener('focus', () => {
  friendList.classList.remove('hidden');
});

showFriendsButton.addEventListener('blur', () => {
  friendList.classList.add('hidden');
});


document.getElementById('playlist-items').addEventListener('click', function() {
    const extraList = document.getElementById('extra-list');
    if (extraList.classList.contains('hidden')) {
      extraList.classList.remove('hidden');
    } else {
      extraList.classList.add('hidden');
    }
});

const playButton = document.getElementById('playBtn');

playButton.addEventListener('click', function() {
    if (playButton.src.includes('play.png')) {
        playButton.src = '/Frontend/src/assets/pause.png'; // Hình ảnh khi đang phát
    } else {
        playButton.src = '/Frontend/src/assets/play.png'; // Hình ảnh khi dừng phát
    }
});


const volumeIcon = document.getElementById('volumeIcon');
const volumeControl = document.getElementById('volumeControl');

let previousVolume = volumeControl.value;

volumeIcon.addEventListener('click', function() {
    if (volumeControl.value === '0') {
        volumeControl.value = previousVolume; 
    } else {
        previousVolume = volumeControl.value;
        volumeControl.value = 0; 
    }
});
