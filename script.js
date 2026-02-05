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
(async function(){
  const svg = d3.select("#worldMap");
  const width = 1100, height = 560;

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

  const world = await d3.json(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  );

  const countries = topojson.feature(
    world,
    world.objects.countries
  ).features;

  const projection = d3.geoNaturalEarth1()
    .fitSize([width, height], {
      type: "FeatureCollection",
      features: countries
    });

  const path = d3.geoPath(projection);

  svg.append("g")
    .selectAll("path")
    .data(countries)
    .join("path")
    .attr("class", d =>
      activeCountries.has(d.properties.name)
        ? "country country--active"
        : "country"
    )
    .attr("d", path);
})();
</script>
