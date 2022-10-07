onload = start;

function start() {
	var map = L.map('map', {
		minZoom: 0,
		maxZoom: 20
	});

	var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

	//maps: http://bl.ocks.org/Xatpy/raw/854297419bd7eb3421d0/
	// var layer = L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png', { attribution: cartodbAttribution }).addTo(map);
	// var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { attribution: cartodbAttribution }).addTo(map);
	var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { attribution: cartodbAttribution }).addTo(map);
	//var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', { attribution: cartodbAttribution }).addTo(map);
	//var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', { attribution: cartodbAttribution }).addTo(map);
	//var layer = L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png', { attribution: cartodbAttribution }).addTo(map);
	//var layer = L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png', { attribution: cartodbAttribution }).addTo(map);

	map.setView([0, 0], 0);

	return;


	//test1();
}

function test1(map) {

	var baseballIcon = L.icon({
		iconUrl: '../leaf94/baseball-marker.png',
		iconSize: [32, 37],
		iconAnchor: [16, 37],
		popupAnchor: [0, -28]
	});

	function onEachFeature(feature, layer) {
		var popupContent = '<p>I started out as a GeoJSON ' +
			feature.geometry.type + ', but now I\'m a Leaflet vector!</p>';

		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}

		layer.bindPopup(popupContent);
	}

	/* global campus, bicycleRental, freeBus, coorsField */
	var bicycleRentalLayer = L.geoJSON([bicycleRental, campus], {

		style: function (feature) {
			return feature.properties && feature.properties.style;
		},

		onEachFeature: onEachFeature,

		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: '#ff7800',
				color: '#000',
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			});
		}
	}).addTo(map);

	var freeBusLayer = L.geoJSON(freeBus, {

		filter: function (feature, layer) {
			if (feature.properties) {
				// If the property "underConstruction" exists and is true, return false (don't render features under construction)
				return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
			}
			return false;
		},

		onEachFeature: onEachFeature
	}).addTo(map);

	var coorsLayer = L.geoJSON(coorsField, {

		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, { icon: baseballIcon });
		},

		onEachFeature: onEachFeature
	}).addTo(map);
}
function test0(loc, map) {
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




}
