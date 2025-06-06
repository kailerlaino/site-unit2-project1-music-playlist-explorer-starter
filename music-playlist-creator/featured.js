
document.addEventListener("DOMContentLoaded", async (event) => {
    await fetch("data/data.json")
    .then((response) => response.json())
    .then((playlists) => {
      if (Array.isArray(playlists)) {
        const randomIndex = Math.floor(Math.random() * playlists.length);
        const randomPlaylist = playlists[randomIndex];
        renderFeatured(randomPlaylist);
      }
    })
});




function renderFeatured(playlist) {
  const container = document.getElementById("featured-section");
  console.log(container);
  const div = document.createElement("article");
  div.innerHTML = `
      <h2>${playlist.playlist_name}</h2>
      <h3>${playlist.playlist_author}</h3>
      <img src=${playlist.playlist_art} height="500" width="500" />
    `;
  container.appendChild(div);
songSection = document.createElement("article");
  playlist.songs.forEach((song) => {
    const songElement = createSongElement(song);
    songSection.appendChild(songElement);
  });
  container.append(songSection);
}

function createSongElement(song) {
  const div = document.createElement("div");
  div.className = "song-element";
  div.innerHTML = `
      <div><img src="assets/img/song.png" height="200" width="200" /></div>
      <div>
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
        <br>
      </div>
      <p class="duration">${song.duration} seconds</p>
    `;
  return div;
}