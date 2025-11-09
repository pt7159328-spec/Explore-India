// -----------------------------
// Common Elements
// -----------------------------
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const districtContainer = document.getElementById("districtContainer");

// Detect base path (GitHub Pages or local)
const basePath = window.location.hostname.includes("github.io") ? "./data/" : "data/";

// -----------------------------
// Highlight the current active link
// -----------------------------
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll("nav a").forEach(link => {
  link.classList.toggle("active", link.getAttribute("href") === currentPage);
});

// -----------------------------
// Smooth fade-in animation
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = 1;
  }, 50);
});

// -----------------------------
// Load States from states.json
// -----------------------------
if (stateSelect) {
  fetch(`${basePath}states.json`)
    .then(res => {
      if (!res.ok) throw new Error(`Error loading states.json (${res.status})`);
      return res.json();
    })
    .then(data => {
      if (!data.states || data.states.length === 0) throw new Error("No states found in states.json");

      // Add states to dropdown
      data.states.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error("❌ Error loading states:", err);
      alert("Unable to load states list. Please check your data folder.");
    });
}

// -----------------------------
// Load Districts when State selected
// -----------------------------
if (stateSelect && districtSelect && districtContainer) {
  stateSelect.addEventListener("change", function () {
    const selectedState = this.value.trim();
    if (!selectedState) {
      districtSelect.innerHTML = "<option value=''>Select District</option>";
      districtContainer.innerHTML = "";
      return;
    }

    // Clear previous data
    districtSelect.innerHTML = "<option value=''>Select District</option>";
    districtContainer.innerHTML = "<p class='loading-text'>Loading districts...</p>";

    // Fetch district data from JSON file
    fetch(`${basePath}${selectedState}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`File not found: ${selectedState}.json`);
        return res.json();
      })
      .then(data => {
        const districts = data[selectedState];
        if (!districts || districts.length === 0)
          throw new Error(`No districts found for ${selectedState}`);

        // Clear loading text
        districtContainer.innerHTML = "";

        districts.forEach(d => {
          // Add to dropdown
          const option = document.createElement("option");
          option.value = d.name;
          option.textContent = d.name;
          districtSelect.appendChild(option);

          // Add district card
          const card = document.createElement("div");
          card.className = "district-card";
          card.innerHTML = `
            <h3>${d.name}</h3>
            <p>${d.description}</p>
          `;
          districtContainer.appendChild(card);
        });
      })
      .catch(err => {
        console.error("❌ Error loading districts:", err);
        districtContainer.innerHTML = `<p class="error-text">Unable to load districts for <strong>${selectedState}</strong>. Please check the JSON file.</p>`;
      });
  });
}

// -----------------------------
// Optional: When a District is Selected
// (You can extend this later to show district info, map, etc.)
// -----------------------------
if (districtSelect) {
  districtSelect.addEventListener("change", function () {
    const selectedDistrict = this.value;
    if (selectedDistrict) {
      console.log(`You selected district: ${selectedDistrict}`);
    }
  });
}
