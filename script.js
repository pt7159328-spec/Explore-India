// -----------------------------
// Detect environment (Local or GitHub Pages)
// -----------------------------
let basePath;
if (window.location.hostname.includes("github.io")) {
  // ✅ GitHub Pages par hosted JSON files ka path
  basePath = "https://raw.githubusercontent.com/pt7159328-spec/Explore-India/main/data/";
} else {
  // ✅ Local VS Code ke liye normal data folder
  basePath = "data/";
}

// -----------------------------
// DOM elements
// -----------------------------
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const districtContainer = document.getElementById("districtContainer");

// -----------------------------
// Load all states from states.json
// -----------------------------
if (stateSelect) {
  fetch(`${basePath}states.json`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      data.states.forEach(state => {
        const opt = document.createElement("option");
        opt.value = state;
        opt.textContent = state;
        stateSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error("❌ Error loading states:", err);
      alert("States load nahi ho paayi. JSON file ka path check karein.");
    });
}

// -----------------------------
// Load districts of selected state
// -----------------------------
if (stateSelect && districtSelect && districtContainer) {
  stateSelect.addEventListener("change", () => {
    const selectedState = stateSelect.value;
    if (!selectedState) return;

    districtSelect.innerHTML = "<option value=''>Select District</option>";
    districtContainer.innerHTML = "<p>Loading districts...</p>";

    fetch(`${basePath}${selectedState}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        districtContainer.innerHTML = "";
        const districts = data[selectedState];
        if (!districts) {
          districtContainer.innerHTML = `<p style="color:red;">No districts found for ${selectedState}</p>`;
          return;
        }

        districts.forEach(d => {
          // Add to dropdown
          const opt = document.createElement("option");
          opt.value = d.name;
          opt.textContent = d.name;
          districtSelect.appendChild(opt);

          // Add district card
          const card = document.createElement("div");
          card.className = "district-card";
          card.innerHTML = `<h3>${d.name}</h3><p>${d.description}</p>`;
          districtContainer.appendChild(card);
        });
      })
      .catch(err => {
        console.error("❌ Error loading districts:", err);
        districtContainer.innerHTML = `<p style="color:red;">Error loading districts for ${selectedState}</p>`;
      });
  });
}
