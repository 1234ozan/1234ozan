import Globe from 'https://esm.sh/globe.gl@2.46.2';
import * as THREE from 'https://esm.sh/three@0.180.0';

const container = document.getElementById('globe');

if (!container) {
  throw new Error('HTML içinde #globe alanı bulunamadı.');
}

const world = Globe()(container);

world
  .backgroundColor('rgba(0,0,0,0)')
  .showAtmosphere(false)
  .showGraticules(false)
  .globeMaterial(
    new THREE.MeshBasicMaterial({
      color: '#87CEFA'
    })
  );

world
  .polygonsData([])
  .polygonCapColor(() => '#ffffff')
  .polygonSideColor(() => '#ffffff')
  .polygonStrokeColor(() => '#ffffff')
  .polygonAltitude(0.002)
  .polygonCapCurvatureResolution(0.25)
  .polygonsTransitionDuration(0);

world.pointOfView({
  lat: 20,
  lng: 0,
  altitude: 1.6
});

const controls = world.controls();

controls.autoRotate = true;
controls.autoRotateSpeed = 0.35;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enableZoom = false;

function resizeGlobe() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  if (width > 0 && height > 0) {
    world.width(width);
    world.height(height);
  }
}

const observer = new ResizeObserver(resizeGlobe);
observer.observe(container);
resizeGlobe();

async function loadCountries() {
  const url =
    'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Ülke verisi yüklenemedi: HTTP ${response.status}`);
    }

    const geojson = await response.json();

    world.polygonsData(geojson.features);

    console.log('Açık mavi kara parçaları yüklendi.');
  } catch (error) {
    console.error('Harita yüklenemedi:', error);
  }
}

loadCountries();