const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];

function openModal(festival) {
  //    document.getElementById('festivalName').innerText = festival.name;
  //    document.getElementById('festivalImage').src = festival.imageUrl;
  //    document.getElementById('festivalDates').innerText = `Dates: ${festival.dates}`;
  //    document.getElementById('festivalLocation').innerText = `Location: ${festival.location}`;
  //    document.getElementById('artistLineup').innerHTML = `<strong>Lineup:</strong> ${festival.lineup.join(', ')}`;
  modal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", (event) => {
  renderPlaylists();
});

function renderPlaylists(playlists) {
  fetch("data/data.json")
    .then((response) => response.json())
    .then((playlists) => {
      const playlistList = document.getElementById("playlist-cards");
      playlists.forEach((playlist) => {
        const playlistElement = createPlaylist(playlist);
        playlistList.appendChild(playlistElement);
      });
    })
    .catch((error) => console.error("Error loading playlists:", error));
}

function createPlaylist(playlist) {
  const div = document.createElement("div");
  div.className = "playlist";
  div.innerHTML = `
      <img onclick="openModal()" src=${playlist.playlist_art}
        alt="image of playlist"
        height="100"
        width="100">
      <h3>${playlist.playlist_name}</h3>
      <p>${playlist.playlist_author}</p>
      <span class="like-button">♡</span>
      <span class="like-count" >${playlist.playlist_likes}</span> Likes
    `;
  return div;
}

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function toggleLike() {
  document
    .getElementById("playlist-cards")
    .addEventListener("click", function (event) {
      const button = event.target.closest(".like-button");
      if (!button) return;

      const itemId = button.getAttribute("data-item-id");
      const countSpan = button.parentNode.querySelector(".like-count");

      const liked = button.classList.toggle("liked");
      let count = parseInt(countSpan.textContent, 10);
      count = liked ? count + 1 : count - 1;
      countSpan.textContent = count;
      button.textContent = liked ? "♥" : "♡";
    });
}