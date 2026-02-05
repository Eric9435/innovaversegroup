const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!isOpen));
    mobileNav.hidden = isOpen;
  });

  // Auto-close when clicking a link
  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      menuBtn.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    });
  });
}

(async function () {

  // Get SVG
  const svg = d3.select("#worldMap");
  if (svg.empty()) return;

  const width = 1100;
  const height = 560;

  // Countries to highlight
  const activeCountries = new Set([
    "United States of America",
    "United Kingdom",
    "Ireland",
    "Myanmar",
    "Singapore",
    "Thailand",
    "Vietnam",
    "China"
  ]);

  // Load world geometry
  const world = await d3.json(
    "https://unpkg.com/world-atlas@2/countries-110m.json"
  );

  // Load country names
  const names = await d3.tsv(
    "https://unpkg.com/world-atlas@2/countries-110m.tsv"
  );

  // Map id → country name
  const nameById = new Map();
  names.forEach(d => nameById.set(d.id, d.name));

  // Convert topojson to geojson
  const countries = topojson.feature(
    world,
    world.objects.countries
  ).features;

  // Attach country names
  countries.forEach(c => {
    c.properties = c.properties || {};
    c.properties.name = nameById.get(c.id) || "";
  });

  // Projection
  const projection = d3.geoNaturalEarth1()
    .fitSize([width, height], {
      type: "FeatureCollection",
      features: countries
    });

  const path = d3.geoPath(projection);

  // Clear SVG
  svg.selectAll("*").remove();

  // Draw map
  svg.append("g")
    .selectAll("path")
    .data(countries)
    .join("path")
    .attr("d", path)
    .attr("class", d =>
      activeCountries.has(d.properties.name)
        ? "country country--active"
        : "country"
    );

})();

