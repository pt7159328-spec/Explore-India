// -----------------------------
// Highlight the current active link
// -----------------------------
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
  const href = link.getAttribute("href");
  if (href === currentPage) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

// -----------------------------
// Smooth fade-in animation for cards and gallery items
// -----------------------------
window.addEventListener("load", () => {
  const elements = document.querySelectorAll(".card, .gallery div, .dev-card, .contact-section form");
  
  elements.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    setTimeout(() => {
      el.style.transition = "all 0.6s ease-out";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, i * 150); // Slightly faster stagger
  });
});

// Optional: Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if(target){
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
