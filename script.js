// -----------------------------
// Navigation: Highlight current page
// -----------------------------
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll("nav a").forEach(link => {
  link.classList.toggle("active", link.getAttribute("href") === currentPage);
});

// -----------------------------
// Smooth fade-in animation for page load
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.transition = "opacity 1s";
    document.body.style.opacity = 1;
  }, 100);
});

// -----------------------------
// Dynamic States and Districts
// -----------------------------
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const districtContainer = document.getElementById("districtContainer");

// Fetch states from states.json in /data folder
fetch("data/states.json")
  .then(response => response.json())
  .then(data => {
    data.states.forEach(state => {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      stateSelect.appendChild(option);
    });
  })
  .catch(err => console.error("Error loading states:", err));

// Load districts when a state is selected
stateSelect.addEventListener("change", function() {
  const selectedState = this.value;
  if (!selectedState) return;

  // Clear previous districts
  districtSelect.innerHTML = "<option value=''>Select District</option>";
  districtContainer.innerHTML = "";

  fetch(`data/${selectedState}.json`)
    .then(response => response.json())
    .then(data => {
      const districts = data[selectedState];
      districts.forEach(d => {
        // Add district to dropdown
        const option = document.createElement("option");
        option.value = d.name;
        option.textContent = d.name;
        districtSelect.appendChild(option);

        // Add district card
        const card = document.createElement("div");
        card.className = "district-card";
        card.innerHTML = `<h3>${d.name}</h3><p>${d.description}</p>`;
        districtContainer.appendChild(card);
      });
    })
    .catch(err => console.error("Error loading districts:", err));
});

// -----------------------------
// Simple Search Functionality
// -----------------------------
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

if(searchInput){
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    searchResults.innerHTML = "";

    if(query.length < 2) return; // Minimum 2 characters to search

    fetch("data/states.json")
      .then(res => res.json())
      .then(data => {
        data.states.forEach(state => {
          fetch(`data/${state}.json`)
            .then(res => res.json())
            .then(stateData => {
              const districts = stateData[state];
              districts.forEach(d => {
                if(d.name.toLowerCase().includes(query)){
                  const div = document.createElement("div");
                  div.className = "search-item";
                  div.textContent = `${d.name} (${state})`;
                  searchResults.appendChild(div);
                }
              });
            });
        });
      });
  });
}
