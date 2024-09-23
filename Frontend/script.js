const showFriendsButton = document.querySelector('.show-friends');
const friendList = document.querySelector('.friend_list');

showFriendsButton.addEventListener('focus', () => {
  friendList.classList.remove('hidden');
});

showFriendsButton.addEventListener('blur', () => {
  friendList.classList.add('hidden');
});


document.getElementById('playlist-items').addEventListener('click', function() {
    // Lấy danh sách các thẻ li bổ sung
    const extraList = document.getElementById('extra-list');
    
    // Toggle class 'hidden' để hiện/ẩn danh sách
    if (extraList.classList.contains('hidden')) {
      extraList.classList.remove('hidden'); // Hiển thị các thẻ li
    } else {
      extraList.classList.add('hidden'); // Ẩn các thẻ li
    }
});
