function getInstrGeoJson(instr, coord) {
	console.log('instr', instr, 'coord', coord);
	var formatter = new L.Routing.Formatter();
	var instrPts = {
		type: "FeatureCollection",
		features: []
	};
	for (var i = 0; i < instr.length; ++i) {
		var g = {
			"type": "Point",
			"coordinates": [coord[instr[i].index].lng, coord[instr[i].index].lat]
		};
		var p = {
			"instruction": formatter.formatInstruction(instr[i])
		};
		instrPts.features.push({
			"geometry": g,
			"type": "Feature",
			"properties": p
		});
	}
	return instrPts;
}
function get_middle_point(p1, p2) {
	return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
}
function hallo(control, map) {
	control.on('routeselected', function (e) {
		var coord = e.route.coordinates;
		var instr = e.route.instructions;
		L.geoJson(getInstrGeoJson(instr, coord)).addTo(map);
	});
}
function just_points(map) {
	console.log('geo', Geo)
	let [p1, p2] = [Geo.places.tuerkenschanzpark, Geo.places.vegagasse];
	return [p1, p2];
}
function just_map() {
	var map = L.map('map');

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);

	return map;
}
function points_to_waypoints(p1, p2) {
	return [
		L.latLng(p1[0], p1[1]),
		L.latLng(p2[0], p2[1])
	];
}
