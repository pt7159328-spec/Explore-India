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

// Fetch states from states.json
fetch("states.json")
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

  fetch(`${selectedState}.json`)
    .then(response => response.json())
    .then(data => {
      const districts = data[selectedState];
      districtSelect.innerHTML = "<option value=''>Select District</option>";
      districts.forEach(d => {
        const option = document.createElement("option");
        option.value = d.name;
        option.textContent = d.name;
        districtSelect.appendChild(option);
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

    fetch("states.json")
      .then(res => res.json())
      .then(data => {
        data.states.forEach(state => {
          fetch(`${state}.json`)
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
