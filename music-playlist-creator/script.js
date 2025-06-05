let playlistState = [];

const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];

function openModal(playlist) {
  document.getElementById("modal-name").innerHTML = `${playlist.playlist_name}`;
  document.getElementById(
    "modal-author"
  ).innerHTML = `${playlist.playlist_author}`;
  const songContainer = document.getElementById("modal-songs");
  console.log("container in openModal" + songContainer.innerHTML);
  songContainer.innerHTML = "";
  playlist.songs.forEach((song) => {
    const songElement = createSongElement(song);
    songContainer.appendChild(songElement);
  });
  const songs = Array.from(songContainer);
  console.log("songs after append:" + songContainer.innerHTML);
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

document.addEventListener("DOMContentLoaded", async (event) => {
  await renderPlaylists();
  renderLikes();
});

async function renderPlaylists() {
  await fetch("data/data.json")
    .then((response) => response.json())
    .then((playlists) => {
      playlistState = playlists;
      const playlistContainer = document.getElementById("playlist-cards");
      playlists.forEach((playlist) => {
        const playlistElement = createPlaylistElement(playlist);
        playlistContainer.appendChild(playlistElement);
      });
    })
    .catch((error) => console.error("Error loading playlists:", error));
}

function renderLikes() {
  const hearts = document.querySelectorAll(".heart");
  hearts.forEach((like) => {
    const likeContainer = like.parentElement;
    const likeCount = likeContainer.querySelector(".like-count");
    like.addEventListener("click", () => {
      let likes = parseInt(likeCount.textContent);
      if (like.classList.contains("liked")) {
        likes--;
        like.classList.remove("liked");
      } else {
        likes++;
        like.classList.add("liked");
      }
      likeCount.textContent = likes;
    });
  });
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
      <div class ="like-container">
        <span class="heart">♡</span>
        <span class="like-count" >${playlist.playlist_likes}</span> 
      </div>
    `;
  return div;
}

function createSongElement(song) {
  const div = document.createElement("div");
  div.className = "song-element";
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

function shuffleSongs() {
  const songContainer = document.getElementById("modal-songs");
  const songs = Array.from(document.querySelectorAll(".song-element"));
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  songContainer.innerHTML = "";
  songs.forEach((song) => {
    songContainer.appendChild(song);
  });
}
