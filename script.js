// ====== FLOATCHAT CHATBOX ======
const btn = document.getElementById("floatchat-btn");
const chatbox = document.getElementById("chatbox");
const closeBtn = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chatbox-messages");

btn.addEventListener("click", () => {
  chatbox.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  chatbox.style.display = "none";
});

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

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

// ====== MAP SETUP WITH FLOATS ======
const map = L.map("mapid").setView([15, 80], 5);
let searchMarker;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

const oceanFloats = [
  { name: "Gujarat Coast Float", coords: [21.0, 67.5] },
  { name: "Konkan Coast Float", coords: [16.5, 71.5] },
  { name: "Malabar Coast Float", coords: [9.0, 74.5] },
  { name: "Coromandel Coast Float", coords: [15.0, 83.5] },
  { name: "Andaman Sea Float", coords: [12.0, 94.0] },
];

oceanFloats.forEach((float) => {
  L.circle(float.coords, {
    radius: 200000,
    color: "#3498db",
    fillColor: "#3498db",
    fillOpacity: 0.15,
    weight: 1,
  }).addTo(map);

  const innerPoint = L.circleMarker(float.coords, {
    radius: 10,
    color: "#ffffff",
    weight: 2,
    fillColor: "#2980b9",
    fillOpacity: 1,
  }).addTo(map);

  innerPoint.bindPopup(`<b>${float.name}</b>`);

  innerPoint.on("click", () => {
    map.flyTo(float.coords, 7);
  });
});

// ====== SEARCH AUTOCOMPLETE ======
const searchInput = document.getElementById("location-search");
const suggestionsList = document.getElementById("suggestions");

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  suggestionsList.innerHTML = "";

  if (!value) {
    suggestionsList.style.display = "none";
    return;
  }

  const filtered = oceanFloats.filter((ocean) =>
    ocean.name.toLowerCase().includes(value)
  );

  filtered.forEach((ocean) => {
    const li = document.createElement("li");
    li.textContent = ocean.name;

    li.addEventListener("click", () => {
      map.flyTo(ocean.coords, 7);

      if (searchMarker) {
        map.removeLayer(searchMarker);
      }

      searchMarker = L.marker(ocean.coords).addTo(map)
        .bindPopup(ocean.name)
        .openPopup();

      suggestionsList.style.display = "none";
      searchInput.value = ocean.name;
    });

    suggestionsList.appendChild(li);
  });

  suggestionsList.style.display = filtered.length ? "block" : "none";
});

document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
    suggestionsList.style.display = "none";
  }
});
