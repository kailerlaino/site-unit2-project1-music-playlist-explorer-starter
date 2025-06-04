// JavaScript for Opening and Closing the Modal
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

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

fetch("data/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error fetching data");
    }
    return response.json(); // Assuming the server sends JSON
  })
  .then(data => {
    renderPlaylists(data)
  })
  .catch(error => {
    console.error('There was a problem rendering playlists:', error);
  });

function renderPlaylists(playlists) {
  const container = document.getElementById("playlist-cards");


  playlists.forEach(playlist => {
    const playlistDiv = document.createElement("div");
    playlistDiv.className = "playlist-item";

    playlistDiv.innerHTML = `
      <img src=${playlist.playlist_art}
            alt="image of playlist"
            height="100"
            width="100">
      <h3>${playlist.playlist_name}</h3>
      <p>${playlist.playlist_author}</p>
      <p>♡${playlist.playlist_likes}</p>
    `
    console.log(playlist.playlist_name);
    container.appendChild(playlistDiv);
  })
}

