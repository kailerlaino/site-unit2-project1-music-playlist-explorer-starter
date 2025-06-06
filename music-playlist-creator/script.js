let lastReviewId = 0;

const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];

function openModal(playlist) {
  document.getElementById("modal-name").innerHTML = `${playlist.playlist_name}`;
  document.getElementById(
    "modal-author"
  ).innerHTML = `${playlist.playlist_author}`;
  document.getElementById(
    "modal-playlist-art"
  ).src = `${playlist.playlist_art}`;
  const songContainer = document.getElementById("modal-songs");
  songContainer.innerHTML = "";
  playlist.songs.forEach((song) => {
    const songElement = createSongElement(song);
    songContainer.appendChild(songElement);
  });
  const songs = Array.from(songContainer);
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
let playlistState = [];

document.addEventListener("DOMContentLoaded", async (event) => {
  await renderPlaylists();
  renderLikes();
  document
    .getElementById("playlist-form")
    .addEventListener("submit", handleReviewSubmit);
  console.log(playlistState);
});

async function renderPlaylists() {
  await fetch("data/data.json")
    .then((response) => response.json())
    .then((playlists) => {
      playlistState = playlists;
      lastReviewId = playlists.length;
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
      <button onclick="deleteData(this)">Delete</button>
      <button onclick="editData(this)">Edit</button>
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
      <p class="duration">${song.duration} seconds</p>
    `;
  return div;
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

function handleReviewSubmit(event) {
  event.preventDefault();
  const playlist_name = document.getElementById("playlist-name").value;
  const playlist_author = document.getElementById("playlist-author").value;
  const playlist_art = document.getElementById("playlist-art").value;

  lastReviewId += 1;

  const newPlaylist = {
    playlistID: "pl_" + lastReviewId,
    playlist_name,
    playlist_author,
    playlist_art,
    playlist_likes: 0,
  };

  playlistState[lastReviewId] = newPlaylist;
  console.log(playlistState);

  const playlistContainer = document.getElementById("playlist-cards");
  playlistContainer.insertBefore(
    createPlaylistElement(newPlaylist),
    playlistContainer.firstChild
  );
  event.target.reset();
  renderLikes();
}

function deleteData(button) {
  let playlistContainer = button.parentNode.parentNode;
  let playlist = button.parentNode;
  playlistContainer.removeChild(playlist);
}

function editData(button) {
  // Get the parent row of the clicked button
  let playlist = button.parentNode;

  let children = playlist.children;

  let imgCell = children[0];
  let artistCell = children[1];
  let nameCell = children[2];

  let imgInput = prompt("Enter the updated img link:", imgCell.innerHTML);
  let nameInput = prompt(
    "Enter the updated playlist name:",
    artistCell.innerHTML
  );
  let artistInput = prompt("Enter the updated artist:", nameCell.innerHTML);

  imgCell.innerHTML = imgInput;
  nameCell.innerHTML = nameInput;
  artistCell.innerHTML = artistInput;
}
