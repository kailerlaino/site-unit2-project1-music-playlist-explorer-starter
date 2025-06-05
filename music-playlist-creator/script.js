let playlistState = [];

const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];

function openModal(playlist) {
  //    document.getElementById('festivalName').innerText = festival.name;
  //    document.getElementById('festivalImage').src = festival.imageUrl;
  //    document.getElementById('festivalDates').innerText = `Dates: ${festival.dates}`;
  //    document.getElementById('festivalLocation').innerText = `Location: ${festival.location}`;
  //    document.getElementById('artistLineup').innerHTML = `<strong>Lineup:</strong> ${festival.lineup.join(', ')}`;
  // const container = document.getElementById("modal-content");
  console.log(playlist);
  const container = document.getElementById("modal-content");
  document.getElementById("modal-name").innerHTML = `${playlist.playlist_name}`;
  document.getElementById(
    "modal-author"
  ).innerHTML = `${playlist.playlist_author}`;
  playlist.songs.forEach((song) => {
        const songElement = createSongElement(song);
        container.appendChild(songElement);
      });
  // playlist.forEach((song) => {

  // })

  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", (event) => {
  renderPlaylists();
});

function renderPlaylists(playlists) {
  fetch("data/data.json")
    .then((response) => response.json())
    .then((playlists) => {
      playlistState = playlists;
      const playlistList = document.getElementById("playlist-cards");
      playlists.forEach((playlist) => {
        const playlistElement = createPlaylistElement(playlist);
        playlistList.appendChild(playlistElement);
      });
    })
    .catch((error) => console.error("Error loading playlists:", error));
}

function createPlaylistElement(playlist) {
  const div = document.createElement("div");
  div.className = "playlist";
  div.innerHTML = `
      <img 
        onclick='openModal(${JSON.stringify(playlist)})'
        src=${playlist.playlist_art}
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

function createSongElement(song) {
  const div = document.createElement("div");
  div.className = "modal-song";
  div.innerHTML = `
      <img
        src="assets/img/song.png"
        alt="song picture"            
        height="100"
        width="100">
      <div>
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
        <br>
      </div>
      <p>${song.duration} seconds</p>

    `;
  return div;
}

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
