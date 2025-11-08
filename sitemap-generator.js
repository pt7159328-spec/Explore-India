// sitemap-generator.js
const fs = require("fs");
const path = require("path");

// Base URL of your website
const BASE_URL = "https://yourusername.github.io/explore-india/";

// Folder containing your HTML files
const PAGES_DIR = "./"; // agar root me saare HTML hain

// Function to get all HTML files
function getHtmlFiles(dir) {
  return fs.readdirSync(dir).filter(file => file.endsWith(".html"));
}

// Generate sitemap XML
function generateSitemap() {
  const files = getHtmlFiles(PAGES_DIR);
  const urls = files.map(file => {
    return `
  <url>
    <loc>${BASE_URL}${file}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(path.join(PAGES_DIR, "sitemap.xml"), sitemap);
  console.log("✅ sitemap.xml generated successfully!");
}

// Run the generator
generateSitemap();
