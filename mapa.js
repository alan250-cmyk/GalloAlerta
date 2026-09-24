//Inicialización del mapa de Leaftlet en Morón
var map = L.map('map').setView([-34.6534, -58.6198], 14);

//Usar la capa de mosaicos de OpenStreetMap, con atribución
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Definir límites de Morón y zoom mínimo
map.setMaxBounds([
    [-34.7010, -58.6400], // Suroeste
    [-34.6364, -58.5930]  // Noreste
]);
map.options.maxBoundsViscosity = 1;
map.setMinZoom(14);