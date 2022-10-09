function arrAdd(arr1, arr2) {
	let i = 0; return arr1.map(x => x + arr2[i++]);
}

let loc = [48.2, 16.35];
var map = L.map('map').setView(loc, 11);

var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker(loc).addTo(map);

var circle = L.circle(
	loc.map(x => x + 0.05),
	{ color: 'yellow', fillColor: '#f03', fillOpacity: 0.5, radius: 500, }
).addTo(map);

var polygon = L.polygon([
	arrAdd(loc, [-.05, -.01]),
	arrAdd(loc, [0, -.03]),
	arrAdd(loc, [.05, .05]),
]).addTo(map);

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

var popup = L.popup()
	.setLatLng(loc)
	.setContent("I am a standalone popup.")
	.openOn(map);

var popup = L.popup();

function onMapClick(e) {
	popup
		.setLatLng(e.latlng)
		.setContent("You clicked the map at " + e.latlng.toString())
		.openOn(map);
}

map.on('click', onMapClick);


