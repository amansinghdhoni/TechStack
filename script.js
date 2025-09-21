// ========== FLOATCHAT ==========
const btn = document.getElementById("floatchat-btn");
const chatbox = document.getElementById("chatbox");
const closeBtn = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chatbox-messages");

btn.addEventListener("click", () => { chatbox.style.display = "flex"; });
closeBtn.addEventListener("click", () => { chatbox.style.display = "none"; });
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => { if(e.key==="Enter") sendMessage(); });

function sendMessage(){
  const text = input.value.trim();
  if(!text) return;

  const userMsg = document.createElement("div");
  userMsg.classList.add("user-message");
  userMsg.textContent = text;
  messages.appendChild(userMsg);
  messages.scrollTop = messages.scrollHeight;
  input.value = "";

  const botMsg = document.createElement("div");
  botMsg.classList.add("bot-message");
  botMsg.textContent = `I received: "${text}"`;
  messages.appendChild(botMsg);
  messages.scrollTop = messages.scrollHeight;
}

// ========== MAP ==========
var map = L.map('mapid', { zoomControl: false }).setView([20.5937, 78.9629], 3);
var marker;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '',
  maxZoom: 19
}).addTo(map);

// Add zoom buttons at bottom-left
L.control.zoom({
  position: 'bottomleft'
}).addTo(map);


// ========== OCEAN POINTS ==========
const oceanPoints = [
  { name: "Pacific Ocean", coords: [0, -160] },
  { name: "Atlantic Ocean", coords: [0, -30] },
  { name: "Indian Ocean", coords: [-20, 80] },
  { name: "Southern Ocean", coords: [-60, 0] },
  { name: "Arctic Ocean", coords: [80, 0] },
  { name: "Red Sea", coords: [20, 38] },
  { name: "Caribbean Sea", coords: [15, -75] },
  { name: "Baltic Sea", coords: [56, 20] },
  { name: "Coral Sea", coords: [-18, 152] },
  { name: "Sea of Japan", coords: [38, 138] }
];

// ========== SEARCH AUTOCOMPLETE ==========
const searchInput = document.getElementById("location-search");
const suggestionsList = document.getElementById("suggestions");

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  suggestionsList.innerHTML = "";
  if(!value){
    suggestionsList.style.display = "none";
    return;
  }

  const filtered = oceanPoints.filter(ocean => ocean.name.toLowerCase().includes(value));
  filtered.forEach(ocean => {
    const li = document.createElement("li");
    li.textContent = ocean.name;
    li.addEventListener("click", () => {
      map.setView(ocean.coords, 5);
      if(marker) map.removeLayer(marker);
      marker = L.marker(ocean.coords).addTo(map)
        .bindPopup(ocean.name)
        .openPopup();
      suggestionsList.style.display = "none";
      searchInput.value = ocean.name;
    });
    suggestionsList.appendChild(li);
  });

  suggestionsList.style.display = filtered.length ? "block" : "none";
});

// Close suggestions if clicked outside
document.addEventListener("click", e => {
  if(!e.target.closest(".search-wrapper")){
    suggestionsList.style.display = "none";
  }
});
