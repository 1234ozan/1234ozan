import Map from "https://esm.sh/ol@10.6.1/Map.js";
import View from "https://esm.sh/ol@10.6.1/View.js";
import TileLayer from "https://esm.sh/ol@10.6.1/layer/Tile.js";
import VectorLayer from "https://esm.sh/ol@10.6.1/layer/Vector.js";
import OSM from "https://esm.sh/ol@10.6.1/source/OSM.js";
import VectorSource from "https://esm.sh/ol@10.6.1/source/Vector.js";
import Feature from "https://esm.sh/ol@10.6.1/Feature.js";
import Point from "https://esm.sh/ol@10.6.1/geom/Point.js";
import { fromLonLat } from "https://esm.sh/ol@10.6.1/proj.js";
import Style from "https://esm.sh/ol@10.6.1/style/Style.js";
import Icon from "https://esm.sh/ol@10.6.1/style/Icon.js";
import Fill from "https://esm.sh/ol@10.6.1/style/Fill.js";
import Stroke from "https://esm.sh/ol@10.6.1/style/Stroke.js";
import Text from "https://esm.sh/ol@10.6.1/style/Text.js";
const cities = [
  {
    name: "SYDNEY",
    lat: -33.8688,
    lon: 151.2093,
    timeZone: "Australia/Sydney"
  },
  {
    name: "TOKYO",
    lat: 35.6762,
    lon: 139.6503,
    timeZone: "Asia/Tokyo"
  },
  {
    name: "DUBAI",
    lat: 25.2048,
    lon: 55.2708,
    timeZone: "Asia/Dubai"
  },
  {
    name: "ISTANBUL",
    lat: 41.0082,
    lon: 28.9784,
    timeZone: "Europe/Istanbul"
  },
  {
    name: "CAPE TOWN",
    lat: -33.9249,
    lon: 18.4241,
    timeZone: "Africa/Johannesburg"
  },
  {
    name: "PARIS",
    lat: 48.8566,
    lon: 2.3522,
    timeZone: "Europe/Paris"
  },
  {
    name: "LONDON",
    lat: 51.5072,
    lon: -0.1276,
    timeZone: "Europe/London"
  },
  {
    name: "NEW YORK CITY",
    lat: 40.7128,
    lon: -74.0060,
    timeZone: "America/New_York"
  },
  {
    name: "CHICAGO",
    lat: 41.8781,
    lon: -87.6298,
    timeZone: "America/Chicago"
  },
  {
    name: "LOS ANGELES",
    lat: 34.0522,
    lon: -118.2437,
    timeZone: "America/Los_Angeles"
  }
];
const mapElement = document.getElementById("openlayers-map");
const pinSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
  <path
    d="M18 44 C14 36 3 25 3 17 A15 15 0 1 1 33 17 C33 25 22 36 18 44 Z"
    fill="#e53935"
    stroke="#ffffff"
    stroke-width="2"
  />
  <circle cx="18" cy="17" r="5" fill="#ffffff"/>
</svg>`;
const pinUrl =
  "data:image/svg+xml;charset=utf-8," + encodeURIComponent(pinSvg);
const features = cities.map((city) =>
  new Feature({
    geometry: new Point(fromLonLat([city.lon, city.lat])),
    name: city.name
  })
);
const markerLayer = new VectorLayer({
  source: new VectorSource({
    features,
    wrapX: false
  }),
  visible: false,
  style: (feature) => new Style({
    image: new Icon({
      src: pinUrl,
      anchor: [0.5, 1],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      scale: 0.5
    }),
    text: new Text({
      text: feature.get("name"),
      font: "10px Arial, sans-serif",
      offsetY: -30,
      textAlign: "center",
      fill: new Fill({
        color: "#555"
      }),
      stroke: new Stroke({
        color: "#ffffff",
        width: 1
      })
    })
  })
});
const worldExtent = [
  -20037508.34,
  -19971868.88,
  20037508.34,
  19971868.88
];
const map = new Map({
  target: mapElement,
  layers: [
    new TileLayer({
      source: new OSM({
        wrapX: false
      })
    }),
    markerLayer
  ],
  view: new View({
    center: fromLonLat([0, 20]),
    zoom: 2,
    minZoom: 2,
    maxZoom: 18,
    multiWorld: false,
    extent: worldExtent,
    constrainOnlyCenter: false,
    smoothExtentConstraint: false
  })
});
function updateMarkers() {
  const zoom = map.getView().getZoom() ?? 0;
  markerLayer.setVisible(zoom >= 2);
}
map.getView().on("change:resolution", updateMarkers);
updateMarkers();
map.getView().on("change:resolution", () => {
  userHasZoomed = true;
  updateMarkers();
});
updateMarkers();
const resizeObserver = new ResizeObserver(() => {
  map.updateSize();
});
resizeObserver.observe(mapElement);
window.addEventListener("load", () => {
  map.updateSize();
});
const cityTimes = document.getElementById("city-times");
if (cityTimes) {
  cityTimes.innerHTML = cities.map((city, index) => `
    <tr>
      <td>${city.name}</td>
      <td class="city-time" id="time-${index}">--:--:--</td>
      <td id="date-${index}">--/--/----</td>
    </tr>
  `).join("");
  function updateCityTimes() {
    const now = new Date();
    cities.forEach((city, index) => {
      const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: city.timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
      }).format(now);
      const date = new Intl.DateTimeFormat("en-GB", {
        timeZone: city.timeZone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(now);
      document.getElementById(`time-${index}`).textContent = time;
      document.getElementById(`date-${index}`).textContent = date;
    });
  }
  updateCityTimes();
  setInterval(updateCityTimes, 1000);
}
const pageDate = document.getElementById("page-date");
if (pageDate) {
  const today = new Date();
  pageDate.dateTime = today.toISOString().slice(0, 10);
  pageDate.textContent = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(today);
}