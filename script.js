// =====================================================
// Explore Our India – Master Script (Updated for Home Page System)
// =====================================================

// -----------------------------
// Detect environment (Local VS GitHub Pages)
// -----------------------------
const basePath = window.location.hostname.includes("github.io")
  ? "https://raw.githubusercontent.com/pt7159328-spec/Explore-India/main/data/"
  : "./data/";

// -----------------------------
// Highlight the current active link in navigation
// -----------------------------
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll("nav a").forEach(link => {
  link.classList.toggle("active", link.getAttribute("href") === currentPage);
});

// -----------------------------
// Smooth fade-in animation for page content
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  // Run the Explore India system only on index.html
  if (currentPage === "index.html" || currentPage === "") {
    initExploreIndia();
  }
});

// =====================================================
// 🌏 MAIN FUNCTION: Explore India Home Page System
// =====================================================
function initExploreIndia() {
  const statesContainer = document.getElementById("statesContainer");
  const districtsContainer = document.getElementById("districtsContainer");
  const districtInfo = document.getElementById("districtInfo");
  const searchInput = document.getElementById("searchInput");

  if (!statesContainer) return;

  // 1️⃣ Load all States
  fetch(`${basePath}states.json`)
    .then(res => res.json())
    .then(data => {
      if (!data.states) throw new Error("Invalid states.json structure");
      renderStates(data.states);
    })
    .catch(err => {
      statesContainer.innerHTML = `<p class="error">Error loading states: ${err.message}</p>`;
      console.error(err);
    });

  // -----------------------------
  // Render States as Cards
  // -----------------------------
  function renderStates(states) {
    statesContainer.innerHTML = "";
    districtsContainer.classList.add("hidden");
    districtInfo.classList.add("hidden");

    states.forEach(state => {
      const card = document.createElement("div");
      card.className = "state-card";
      card.innerHTML = `
        <h3>${state}</h3>
        <button class="btn explore-btn">Explore</button>
      `;
      card.querySelector(".explore-btn").addEventListener("click", () => loadDistricts(state));
      statesContainer.appendChild(card);
    });
  }

  // -----------------------------
  // Load Districts for Selected State
  // -----------------------------
  function loadDistricts(stateName) {
    districtsContainer.innerHTML = "<p>Loading districts...</p>";
    districtsContainer.classList.remove("hidden");
    districtInfo.classList.add("hidden");

    fetch(`${basePath}${stateName.toLowerCase()}.json`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Invalid district data");
        renderDistricts(data, stateName);
      })
      .catch(err => {
        districtsContainer.innerHTML = `<p class="error">Error loading ${stateName} districts: ${err.message}</p>`;
        console.error(err);
      });
  }

  // -----------------------------
  // Render Districts Grid
  // -----------------------------
  function renderDistricts(districts, stateName) {
    statesContainer.classList.add("hidden");
    districtsContainer.innerHTML = "";
    districtInfo.classList.add("hidden");

    const backBtn = document.createElement("button");
    backBtn.textContent = "← Back to States";
    backBtn.className = "btn back-btn";
    backBtn.addEventListener("click", () => {
      statesContainer.classList.remove("hidden");
      districtsContainer.classList.add("hidden");
    });
    districtsContainer.appendChild(backBtn);

    districts.forEach(d => {
      const card = document.createElement("div");
      card.className = "district-card";
      card.innerHTML = `
        <img src="${d.image || 'images/placeholder.jpg'}" alt="${d.name}">
        <h3>${d.name}</h3>
        <button class="btn info-btn">View Info</button>
      `;
      card.querySelector(".info-btn").addEventListener("click", () => showDistrictInfo(d, stateName));
      districtsContainer.appendChild(card);
    });
  }

  // -----------------------------
  // Show District Info
  // -----------------------------
  function showDistrictInfo(district, stateName) {
    districtsContainer.classList.add("hidden");
    districtInfo.classList.remove("hidden");

    districtInfo.innerHTML = `
      <button class="btn back-btn">← Back to ${stateName} Districts</button>
      <h2>${district.name}</h2>
      <img src="${district.image || 'images/placeholder.jpg'}" alt="${district.name}">
      <p>${district.info || "No detailed information available."}</p>
    `;

    districtInfo.querySelector(".back-btn").addEventListener("click", () => {
      districtsContainer.classList.remove("hidden");
      districtInfo.classList.add("hidden");
    });
  }

  // -----------------------------
  // Search Functionality (Live Filter)
  // -----------------------------
  searchInput?.addEventListener("input", e => {
    const term = e.target.value.toLowerCase().trim();
    const allCards = document.querySelectorAll(".state-card, .district-card");

    allCards.forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = name.includes(term) ? "block" : "none";
    });
  });
}
