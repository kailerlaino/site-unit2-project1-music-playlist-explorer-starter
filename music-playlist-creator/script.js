// JavaScript for Opening and Closing the Modal
const modal = document.getElementById("playstModal");
const span = document.getElementsByClassName("close")[0];

function openModal(festival) {
   document.getElementById('festivalName').innerText = festival.name;
   document.getElementById('festivalImage').src = festival.imageUrl;
   document.getElementById('festivalDates').innerText = `Dates: ${festival.dates}`;
   document.getElementById('festivalLocation').innerText = `Location: ${festival.location}`;
   document.getElementById('artistLineup').innerHTML = `<strong>Lineup:</strong> ${festival.lineup.join(', ')}`;
   modal.style.display = "block";
}

span.onclick = function() {
   modal.style.display = "none";
}
window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}