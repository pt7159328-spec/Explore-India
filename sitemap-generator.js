// -----------------------------
// Dynamic Sitemap Generator
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const sitemapContainer = document.getElementById("sitemapContainer");
  if (!sitemapContainer) return;

  // Static pages
  const staticPages = [
    { name: "Home", link: "index.html" },
    { name: "About", link: "about.html" },
    { name: "Destinations", link: "destinations.html" },
    { name: "Districts", link: "district.html" },
    { name: "Contact", link: "contact.html" },
    { name: "Login", link: "login.html" },
    { name: "Register", link: "register.html" }
  ];

  // Add static pages to sitemap
  staticPages.forEach(page => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${page.link}">${page.name}</a>`;
    sitemapContainer.appendChild(li);
  });

  // Dynamic pages: States & Districts
  fetch("states.json")
    .then(res => res.json())
    .then(data => {
      data.states.forEach(state => {
        const liState = document.createElement("li");
        liState.textContent = state;

        const ulDistricts = document.createElement("ul");

        fetch(`${state}.json`)
          .then(res => res.json())
          .then(stateData => {
            const districts = stateData[state];
            districts.forEach(d => {
              const liDistrict = document.createElement("li");
              liDistrict.innerHTML = `<a href="district.html?state=${encodeURIComponent(state)}&district=${encodeURIComponent(d.name)}">${d.name}</a>`;
              ulDistricts.appendChild(liDistrict);
            });
          })
          .catch(err => console.error(`Error loading districts for ${state}:`, err));

        liState.appendChild(ulDistricts);
        sitemapContainer.appendChild(liState);
      });
    })
    .catch(err => console.error("Error loading states:", err));
});
