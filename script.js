document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Highlight nav links
  document.querySelectorAll("nav a").forEach(link => {
    const linkHref = link.getAttribute("href").split("/").pop();
    link.classList.toggle("active", linkHref === currentPage);
  });

  const basePath = window.location.hostname.includes("github.io")
    ? "https://raw.githubusercontent.com/pt7159328-spec/Explore-India/main/data/"
    : "./data/";

  if (currentPage === "index.html") {
    initExploreIndia(basePath);
  }

  if (currentPage === "district.html") {
    initDistricts(basePath);
  }
});

// ======================
// Home Page Function
// ======================
function initExploreIndia(basePath) {
  const statesContainer = document.getElementById("statesContainer");
  const districtsContainer = document.getElementById("districtsContainer");
  const districtInfo = document.getElementById("districtInfo");
  const searchInput = document.getElementById("searchInput");

  fetch(`${basePath}states.json`)
    .then(res => res.json())
    .then(data => {
      renderStates(data.states || []);
    })
    .catch(err => {
      statesContainer.innerHTML = `<p class="error">Error loading states: ${err.message}</p>`;
      console.error(err);
    });

  function renderStates(states) {
    statesContainer.innerHTML = "";

    states.forEach(state => {
      const card = document.createElement("div");
      card.className = "state-card";
      card.innerHTML = `<h3>${state}</h3>
                        <button class="btn explore-btn">Explore</button>`;

      // Redirect to district page
      card.querySelector(".explore-btn").addEventListener("click", () => {
        window.location.href = `district.html?state=${encodeURIComponent(state)}`;
      });

      statesContainer.appendChild(card);
    });
  }

  // Live search
  searchInput?.addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll(".state-card, .district-card").forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = name.includes(term) ? "block" : "none";
    });
  });
}

// ======================
// District Page Function
// ======================
function initDistricts(basePath) {
  const stateSelect = document.getElementById("stateSelect");
  const districtSelect = document.getElementById("districtSelect");
  const districtContainer = document.getElementById("districtContainer");

  fetch(`${basePath}states.json`)
    .then(res => res.json())
    .then(data => {
      const states = data.states || [];
      states.forEach(state => {
        const opt = document.createElement("option");
        opt.value = state;
        opt.textContent = state;
        stateSelect.appendChild(opt);
      });

      // Load state from query string
      const urlParams = new URLSearchParams(window.location.search);
      const selectedState = urlParams.get("state");
      if (selectedState) {
        stateSelect.value = selectedState;
        loadDistricts(selectedState);
      }
    });

  stateSelect.addEventListener("change", () => {
    const selectedState = stateSelect.value.trim();
    if (selectedState) loadDistricts(selectedState);
  });

  function loadDistricts(state) {
    districtSelect.innerHTML = "<option value=''>Select District</option>";
    districtContainer.innerHTML = "<p>Loading districts...</p>";

    fetch(`${basePath}${state.toLowerCase()}.json`)
      .then(res => res.json())
      .then(data => {
        districtContainer.innerHTML = "";
        const districts = data[state] || data;
        districts.forEach(d => {
          const opt = document.createElement("option");
          opt.value = d.name;
          opt.textContent = d.name;
          districtSelect.appendChild(opt);

          const card = document.createElement("div");
          card.className = "district-card";
          card.innerHTML = `<h3>${d.name}</h3>
                            <p>${d.info || d.description || "No info available."}</p>`;
          districtContainer.appendChild(card);
        });
      })
      .catch(err => {
        districtContainer.innerHTML = `<p style="color:red;">Error loading districts</p>`;
      });
  }
}
