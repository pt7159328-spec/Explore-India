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

  initDistrictPage();
});

// -----------------------------
// Function to initialize District page
// -----------------------------
function initDistrictPage() {
  const stateSelect = document.getElementById("stateSelect");
  const districtSelect = document.getElementById("districtSelect");
  const districtContainer = document.getElementById("districtContainer");

  if (!stateSelect || !districtSelect || !districtContainer) return;

  // Load states from states.json
  fetch("states.json")
    .then(res => res.json())
    .then(data => {
      data.states.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      });

      // If URL has state parameter, select that state
      const urlParams = new URLSearchParams(window.location.search);
      const stateFromURL = urlParams.get("state");
      if (stateFromURL) {
        stateSelect.value = stateFromURL;
        loadDistricts(stateFromURL);
      }
    })
    .catch(err => console.error("Error loading states:", err));

  // Load districts when a state is selected
  stateSelect.addEventListener("change", function() {
    const selectedState = this.value;
    if (!selectedState) {
      districtSelect.innerHTML = "<option value=''>Select District</option>";
      districtContainer.innerHTML = "";
      return;
    }
    loadDistricts(selectedState);
  });

  // -----------------------------
  // Search functionality
  // -----------------------------
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (searchInput && searchResults) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      searchResults.innerHTML = "";

      if (query.length < 2) return;

      fetch("states.json")
        .then(res => res.json())
        .then(data => {
          data.states.forEach(state => {
            fetch(`${state}.json`)
              .then(res => res.json())
              .then(stateData => {
                const districts = stateData[state];
                districts.forEach(d => {
                  if (d.name.toLowerCase().includes(query)) {
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

  // -----------------------------
  // Function to load districts for a state
  // -----------------------------
  function loadDistricts(state) {
    fetch(`states_data/${state}.json`)
      .then(res => res.json())
      .then(data => {
        const districts = data[state];
        districtSelect.innerHTML = "<option value=''>Select District</option>";
        districtContainer.innerHTML = "";

        districts.forEach(d => {
          // Dropdown
          const option = document.createElement("option");
          option.value = d.name;
          option.textContent = d.name;
          districtSelect.appendChild(option);

          // Cards
          const card = document.createElement("div");
          card.className = "district-card";
          card.innerHTML = `<h3>${d.name}</h3><p>${d.description}</p>`;
          districtContainer.appendChild(card);
        });
      })
      .catch(err => console.error("Error loading districts:", err));
  }
}
