let lastReviewId = 0;


let playlistState = [];

document.addEventListener("DOMContentLoaded", async (event) => {
  await renderPlaylists();
  renderLikes();
  document
    .getElementById("playlist-form")
    .addEventListener("submit", handleReviewSubmit);
  console.log(playlistState);
});

/* Display Playlists */
async function renderPlaylists() {
  await fetch("data/data.json")
    .then((response) => response.json())
    .then((playlists) => {
      // playlistState = playlists;
      lastReviewId = playlists.length;
      const playlistContainer = document.getElementById("playlist-cards");
      playlistState = playlists.map((playlist) => {
        const playlistElement = createPlaylistElement(playlist);
        playlistContainer.appendChild(playlistElement);
        return {
          id: playlist.playlistID,
          name: playlist.playlist_name,
          artist: playlist.playlist_author,
          element: playlistElement,
        };
      });
    })
    .catch((error) => console.error("Error loading playlists:", error));
}

/* Playlist Tile Components */
function createPlaylistElement(playlist) {
  const div = document.createElement("div");
  div.className = "playlist";
  div.setAttribute("data-date", new Date());
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
      <button onclick="deletePlaylist(this)">Delete</button>
      <button onclick="editPlaylist(this)">Edit</button>
    `;
  return div;
}

/* Playlist Details */
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

const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];

function openModal(playlist) {
  document.getElementById("modal-name").innerHTML = `${playlist.playlist_name}`;
  document.getElementById("modal-author").innerHTML = `${playlist.playlist_author}`;
  document.getElementById("modal-playlist-art").src = `${playlist.playlist_art}`;
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

/* Like Playlists */
// TODO: issue with rendering likes each time DOM resets.
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

/* Shuffle Songs */
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

/* Add New Playlists */
// Allow users to add songs
function handleReviewSubmit(event) {
  event.preventDefault();
  const playlist_name = document.getElementById("playlist-name").value;
  const playlist_author = document.getElementById("playlist-author").value;
  const playlist_art = document.getElementById("playlist-art").value;

  lastReviewId += 1;
  newID = "pl_" + lastReviewId;

  const newPlaylist = {
    playlistID: newID,
    playlist_name,
    playlist_author,
    playlist_art,
    playlist_likes: 0,
  };

  playlistElement = createPlaylistElement(newPlaylist);

  playlistState[lastReviewId] = {
    id: newID + lastReviewId,
    name: playlist_name,
    artist: playlist_author,
    element: playlistElement,
  };

  const playlistContainer = document.getElementById("playlist-cards");
  playlistContainer.insertBefore(playlistElement, playlistContainer.firstChild);
  event.target.reset();
  renderLikes();
}


/* Edit Existing Playlists */
// TODO: Allow users to edit songs
function editPlaylist(button) {
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

/* Delete Playlists */
function deletePlaylist(button) {
  let playlistContainer = button.parentNode.parentNode;
  let playlist = button.parentNode;
  playlistContainer.removeChild(playlist);
}

/* Search Functionality */
const searchInput = document.querySelector("[data-search]");

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    search(e);
  }
});

function search() {
  const value = searchInput.value.toLowerCase();
  playlistState.forEach((playlist) => {
    const isVisible =
      playlist.name.toLowerCase().includes(value) ||
      playlist.artist.toLowerCase().includes(value);
    playlist.element.classList.toggle("hide", !isVisible);
  });
  renderLikes();
}

function clearSearch() {
  searchInput.value = "";
  playlistState.forEach((playlist) => {
    playlist.element.classList.toggle("hide", false);
  });
  renderLikes();
}

/* Sorting Options */
function sortPlaylistByName() {
  const container = document.getElementById("playlist-cards");
  const divs = Array.from(container.children);
  divs.sort((a, b) => {
    const aText = a.querySelector("h3").textContent;
    const bText = b.querySelector("h3").textContent;
    return aText.localeCompare(bText);
  });
  divs.forEach((div) => container.appendChild(div));
}

function sortPlaylistByLikes() {
  const container = document.getElementById("playlist-cards");
  const divs = Array.from(container.children);
  divs.sort((a, b) => {
    const aNum = parseInt(a.querySelector(".like-count").textContent);
    const bNum = parseInt(b.querySelector(".like-count").textContent);
    return bNum - aNum;
  });
  divs.forEach((div) => container.appendChild(div));
}

function sortPlaylistByDate() {
  const container = document.getElementById("playlist-cards");
  const divs = Array.from(container.children);
  divs.sort((a, b) => {
    const aDate = a.dataset.date;
    const bDate = b.dataset.date;
    if (aDate < bDate) {
      return -1;
    } else if (aDate > bDate) {
      return 1;
    } else {
      return 0;
    }
  });
  divs.forEach((div) => container.appendChild(div));
}