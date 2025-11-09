// =====================================================
// Explore Our India – Master Script (Ready for GitHub + Local)
// =====================================================

// -----------------------------
// Detect environment (Local VS GitHub Pages)
// -----------------------------
const basePath = window.location.hostname.includes("github.io")
  ? "https://raw.githubusercontent.com/pt7159328-spec/Explore-India/main/"
  : "./";

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
});

// -----------------------------
// Load states dynamically (if stateSelect exists)
// -----------------------------
const stateSelect = document.getElementById("stateSelect");
if (stateSelect) {
  fetch(`${basePath}states.json`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.states || !Array.isArray(data.states)) {
        throw new Error("Invalid states.json format");
      }

      data.states.forEach(state => {
        const opt = document.createElement("option");
        opt.value = state;
        opt.textContent = state;
        stateSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error("❌ Error loading states:", err);
    });
}

// -----------------------------
// Load districts dynamically (if districtSelect exists)
// -----------------------------
const districtSelect = document.getElementById("districtSelect");
const districtContainer = document.getElementById("districtContainer");

if (stateSelect && districtSelect && districtContainer) {
  stateSelect.addEventListener("change", () => {
    const selectedState = stateSelect.value.trim();
    if (!selectedState) return;

    districtSelect.innerHTML = "<option value=''>Select District</option>";
    districtContainer.innerHTML = "<p>Loading districts...</p>";

    fetch(`${basePath}${encodeURIComponent
