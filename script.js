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
window.addEventListener("load", () => {
  document.querySelectorAll(".card, .gallery div, .dev-card, .contact-section form").forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    setTimeout(() => {
      el.style.transition = "all 0.6s ease-out";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, i * 150);
  });
});

// -----------------------------
// Smooth scroll for internal links
// -----------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if(target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// -----------------------------
// Explore Our India: Search + Load JSON
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search-box");
  const locationList = document.getElementById("location-list");

  // ---------- INDEX.HTML: Search States ----------
  if(searchBox && locationList){
    // List of all 36 states
    const states = [
      "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
      "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
      "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
      "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
      "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry","Chandigarh","Daman and Diu",
      "Dadra and Nagar Haveli","Delhi"
    ];

    // Show all states initially
    states.forEach(state => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="state.html?state=${encodeURIComponent(state)}">${state}</a>`;
      locationList.appendChild(li);
    });

    // Filter on input
    searchBox.addEventListener("input", () => {
      const query = searchBox.value.toLowerCase();
      locationList.innerHTML = "";
      states
        .filter(state => state.toLowerCase().includes(query))
        .forEach(state => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="state.html?state=${encodeURIComponent(state)}">${state}</a>`;
          locationList.appendChild(li);
        });

      if(locationList.innerHTML === "") locationList.innerHTML = "<li>No results found</li>";
    });
  }

  // ---------- STATE.HTML: Load Districts ----------
  const stateNameElement = document.getElementById("stateName");
  const districtsGrid = document.getElementById("districtsGrid");
  const districtSearch = document.getElementById("districtSearch");

  if(stateNameElement && districtsGrid && districtSearch){
    const params = new URLSearchParams(window.location.search);
    const stateName = params.get("state");
    if(!stateName) return;

    stateNameElement.textContent = stateName;

    // Fetch the specific state JSON
    fetch(`data/${stateName}.json`)
      .then(res => res.json())
      .then(data => {
        data.districts.forEach(d => {
          const card = document.createElement("div");
          card.className = "district-card";
          card.innerHTML = `
            <img src="${d.image}" alt="${d.name}">
            <h3>${d.name}</h3>
            <p>${d.description}</p>
          `;
          districtsGrid.appendChild(card);
        });

        // District search
        districtSearch.addEventListener("input", () => {
          const q = districtSearch.value.toLowerCase();
          document.querySelectorAll(".district-card").forEach(card => {
            const name = card.querySelector("h3").innerText.toLowerCase();
            card.style.display = name.includes(q) ? "block" : "none";
          });
        });
      })
      .catch(err => {
        districtsGrid.innerHTML = "<p>Data not available for this state.</p>";
        console.error(err);
      });
  }
});
