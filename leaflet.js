const element = document.getElementById("leaflet-map");

if (element && !element._leaflet_id) {
  const campus = [39.8712, 32.7334];

  const map = L.map(element, {
    center: campus,
    zoom: 14,
    minZoom: 5,
    maxZoom: 19,
    scrollWheelZoom: false,
    worldCopyJump: false
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    noWrap: true,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const redPin = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.marker(campus, { icon: redPin })
  .addTo(map)
  .bindPopup(
    "<b>HACETTEPE CAMPUS</b><br>"
  )
  .openPopup();

  requestAnimationFrame(() => map.invalidateSize());

  window.addEventListener("resize", () => {
    map.invalidateSize();
  });
}