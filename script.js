// ====== FLOATCHAT CHATBOX ======
const btn = document.getElementById("floatchat-btn");
const glassSurfaceContainer = document.getElementById("glass-surface-container");
const closeBtn = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chatbox-messages");

btn.addEventListener("click", () => {
    glassSurfaceContainer.style.display = "flex";
    setTimeout(() => {
        glassSurfaceContainer.classList.add('active');
        updateDisplacementMap();
    }, 10);
});

closeBtn.addEventListener("click", () => {
    glassSurfaceContainer.classList.remove('active');
    setTimeout(() => {
        glassSurfaceContainer.style.display = "none";
    }, 500); // Match this to the CSS transition duration
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

    const botMsg = document.createElement("div");
    botMsg.classList.add("bot-message");
    botMsg.textContent = `I received: "${text}"`;
    messages.appendChild(botMsg);

    input.value = "";
    messages.scrollTop = messages.scrollHeight;
}

// ====== MAP SETUP WITH FLOATS ======
const map = L.map("mapid").setView([15, 80], 5);
let searchMarker;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
    L.circle(float.coords, { radius: 200000, color: "#3498db", fillColor: "#3498db", fillOpacity: 0.15, weight: 1 }).addTo(map);
    const innerPoint = L.circleMarker(float.coords, { radius: 10, color: "#ffffff", weight: 2, fillColor: "#2980b9", fillOpacity: 1 }).addTo(map);
    innerPoint.bindPopup(`<b>${float.name}</b>`);
    innerPoint.on("click", () => map.flyTo(float.coords, 7));
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
    const filtered = oceanFloats.filter((ocean) => ocean.name.toLowerCase().includes(value));
    filtered.forEach((ocean) => {
        const li = document.createElement("li");
        li.textContent = ocean.name;
        li.addEventListener("click", () => {
            map.flyTo(ocean.coords, 7);
            if (searchMarker) map.removeLayer(searchMarker);
            searchMarker = L.marker(ocean.coords).addTo(map).bindPopup(ocean.name).openPopup();
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

// ====== GLASS SURFACE EFFECT LOGIC ======
const glassEffectSettings = {
    borderRadius: 20, borderWidth: 0.07, brightness: 50, opacity: 0.93, blur: 11, displace: 15,
    distortionScale: -150, redOffset: 5, greenOffset: 15, blueOffset: 25, mixBlendMode: 'screen',
};

const feImage = document.getElementById('feImage');
const redChannel = document.getElementById('redChannel');
const greenChannel = document.getElementById('greenChannel');
const blueChannel = document.getElementById('blueChannel');
const gaussianBlur = document.getElementById('gaussianBlur');
const container = document.getElementById('glass-surface-container');

function generateDisplacementMap() {
    const rect = container.getBoundingClientRect();
    const actualWidth = rect.width, actualHeight = rect.height;
    const edgeSize = Math.min(actualWidth, actualHeight) * (glassEffectSettings.borderWidth * 0.5);
    const svgContent = `<svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="red-grad-dynamic" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="blue-grad-dynamic" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect><rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${glassEffectSettings.borderRadius}" fill="url(#red-grad-dynamic)" /><rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${glassEffectSettings.borderRadius}" fill="url(#blue-grad-dynamic)" style="mix-blend-mode: ${glassEffectSettings.mixBlendMode}" /><rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${glassEffectSettings.borderRadius}" fill="hsl(0 0% ${glassEffectSettings.brightness}% / ${glassEffectSettings.opacity})" style="filter:blur(${glassEffectSettings.blur}px)" /></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

function updateDisplacementMap() {
    if (feImage) feImage.setAttribute('href', generateDisplacementMap());
}

function applyFilterSettings() {
    if (!redChannel || !greenChannel || !blueChannel || !gaussianBlur) return;
    [{ ref: redChannel, offset: glassEffectSettings.redOffset }, { ref: greenChannel, offset: glassEffectSettings.greenOffset }, { ref: blueChannel, offset: glassEffectSettings.blueOffset }].forEach(({ ref, offset }) => {
        ref.setAttribute('scale', (glassEffectSettings.distortionScale + offset).toString());
        ref.setAttribute('xChannelSelector', 'R'); ref.setAttribute('yChannelSelector', 'G');
    });
    gaussianBlur.setAttribute('stdDeviation', glassEffectSettings.displace.toString());
}

document.addEventListener('DOMContentLoaded', () => {
    applyFilterSettings();
    const supportsSVGFilters = () => {
        const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        if (isWebkit || /Firefox/.test(navigator.userAgent)) return false;
        const div = document.createElement('div');
        div.style.backdropFilter = 'url(#glass-filter)';
        return div.style.backdropFilter !== '';
    };

    if (supportsSVGFilters()) {
        container.classList.add('glass-surface--svg');
    } else {
        container.classList.add('glass-surface--fallback');
    }
    const resizeObserver = new ResizeObserver(() => setTimeout(updateDisplacementMap, 0));
    resizeObserver.observe(container);
});