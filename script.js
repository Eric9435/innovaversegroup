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

<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://cdn.jsdelivr.net/npm/topojson-client@3"></script>

<script>
(async function () {
  const svg = d3.select("#worldMap");
  if (svg.empty()) return;

  const width = 1100, height = 560;

  // Countries to highlight (names from country-names.tsv)
  const active = new Set([
    "United States of America",
    "United Kingdom",
    "Ireland",
    "Myanmar",
    "Singapore",
    "Thailand",
    "Vietnam",
    "China"
  ]);

  // Load topojson + names table (IMPORTANT)
  const world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
  const names = await d3.tsv("https://cdn.jsdelivr.net/npm/world-atlas@2/country-names.tsv");

  const nameById = new Map(names.map(d => [d.id, d.name]));

  const countries = topojson.feature(world, world.objects.countries).features;
  countries.forEach(d => d.properties = { name: nameById.get(String(d.id)) });

  const projection = d3.geoNaturalEarth1()
    .fitSize([width, height], { type: "FeatureCollection", features: countries });

  const path = d3.geoPath(projection);

  svg.selectAll("*").remove(); // clear if reloaded

  svg.append("g")
    .selectAll("path")
    .data(countries)
    .join("path")
    .attr("class", d => active.has(d.properties.name) ? "country country--active" : "country")
    .attr("d", path);
})();
</script>
