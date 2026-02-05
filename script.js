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

  const svg = d3.select("#worldMap");
  if (svg.empty()) return;

  const width = 1100;
  const height = 560;

  // Countries you want highlighted
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

  // Load world map (JSON only)
  const world = await d3.json(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  );

  const countries = topojson.feature(
    world,
    world.objects.countries
  ).features;

  // Projection
  const projection = d3.geoNaturalEarth1()
    .fitSize([width, height], {
      type: "FeatureCollection",
      features: countries
    });

  const path = d3.geoPath(projection);

  svg.selectAll("*").remove();

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
