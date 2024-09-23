const showFriendsButton = document.querySelector('.show-friends');
const friendList = document.querySelector('.friend_list');

showFriendsButton.addEventListener('focus', () => {
  friendList.classList.remove('hidden');
});

showFriendsButton.addEventListener('blur', () => {
  friendList.classList.add('hidden');
});
