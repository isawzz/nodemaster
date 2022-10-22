onload = start;

function start() {
	let map = just_map();
	let [p1, p2] = just_points(map);
	map.setView(get_middle_point(p1, p2), 16);

	test6(map,p1,p2); //test5(map, p1, p2);//test3_mapbounds();	//test2_waypointfallback();	//test0_orig();	//test1_basic();	




}
function test6(map, p1, p2) {
	let control = M.control = L.Routing.control({
		waypoints: points_to_waypoints(p1, p2),
		lineOptions: { styles: [{ color: '#006a4e', opacity: 1, weight: 5 }], },
		draggableWaypoints: false,
		createMarker: function () { return false; },
		show: false,
	}).addTo(map);

	M.coords = [];
	control.on('routesfound', function (e) {
		//console.log('routesfound event: ',e);
		M.routes = e.routes;
		M.num_requests = e.target._requestCount;
		M.coords = arrExtend(M.coords, e.routes[0].coordinates);
		console.log('M', M)
	});


	//control.addTo(map);
	//console.log('control',control);
	//let routes = control._routes;
	//console.log('routes',_routes);
}
function test5(map, p1, p2) {
	let control = M.control = test4_get_waypoints(map, p1, p2);

	// hallo(control,map);
	M.coords = [];
	control.on('routeselected', function (e) {
		//console.log('routeselected event: ',e.route);
		arrExtend(M.coords, e.route.coordinates);
		console.log('M', M)
	});

}
function test4_get_waypoints(mymap, p1, p2) {
	// Draw route
	var routeData = L.Routing.control({
		// router: L.Routing.mapbox(L.mapbox.accessToken, {
		// 	profile: 'mapbox/driving',
		// 	language: 'en',
		// }),
		waypoints: points_to_waypoints(p1, p2),
		lineOptions: { styles: [{ color: '#006a4e', opacity: 1, weight: 5 }], },
		draggableWaypoints: false,
		createMarker: function () { return false; },
		show: false,
	}).addTo(mymap);

	var routeArray = new Array();
	//let x=routeData.g
	routeArray = routeData.getWaypoints();

	console.log(routeArray);

	return routeData;
	// Draw animation
	L.motion.polyline([[52.501737, -2.119792], [52.501267, -2.114707], [52.500313, -2.110361], [52.499243, -2.108751], [52.498596, -2.105886], [52.498812, -2.104953], [52.498798, -2.102591]], {
		color: "transparent"
	}, {
		auto: true,
		duration: 30000,
		easing: L.Motion.Ease.easeInOutQuart
	}, {
		removeOnEnd: false,
		showMarker: true,
		icon: L.icon({ iconUrl: 'marker.png', iconSize: [32, 37] })
	}).addTo(mymap);
}

function test3_mapbounds() {
	var map = L.map('map');
	map.setView(Geo.places.vegagasse, 16)

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);

	//leaflet how do I get the top left and bottom right points LatLng of map?
	let b = map.getBounds();
	console.log('b', b._southWest, b._northEast);
	let [p1, p2] = [[b._southWest.lat, b._southWest.lng], [b._northEast.lat, b._northEast.lng]];

	M = get_route_control(map, p1, p2);
}

function get_route_control(map, p1, p2) {
	return L.Routing.control({
		waypoints: [
			// L.latLng(57.74, 11.94),
			// L.latLng(57.6792, 11.949)
			L.latLng(p1[0], p1[1]),
			L.latLng(p2[0], p2[1])
		],
		waypointNameFallback: function (latLng) {
			function zeroPad(n) {
				n = Math.round(n);
				return n < 10 ? '0' + n : n;
			}
			function sexagesimal(p, pos, neg) {
				var n = Math.abs(p),
					degs = Math.floor(n),
					mins = (n - degs) * 60,
					secs = (mins - Math.floor(mins)) * 60,
					frac = Math.round((secs - Math.floor(secs)) * 100);
				return (n >= 0 ? pos : neg) + degs + '°' +
					zeroPad(mins) + '\'' +
					zeroPad(secs) + '.' + zeroPad(frac) + '"';
			}

			return sexagesimal(latLng.lat, 'N', 'S') + ' ' + sexagesimal(latLng.lng, 'E', 'W');
		},
		routeWhileDragging: true
	}).addTo(map);

}

function test2_waypointfallback() {
	var map = L.map('map');

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);

	console.log('geo', Geo)
	let [p1, p2] = [Geo.places.tuerkenschanzpark, Geo.places.vegagasse];
	map.setView(p1, 16)

	M = L.Routing.control({
		waypoints: [
			// L.latLng(57.74, 11.94),
			// L.latLng(57.6792, 11.949)
			L.latLng(p1[0], p1[1]),
			L.latLng(p2[0], p2[1])
		],
		waypointNameFallback: function (latLng) {
			function zeroPad(n) {
				n = Math.round(n);
				return n < 10 ? '0' + n : n;
			}
			function sexagesimal(p, pos, neg) {
				var n = Math.abs(p),
					degs = Math.floor(n),
					mins = (n - degs) * 60,
					secs = (mins - Math.floor(mins)) * 60,
					frac = Math.round((secs - Math.floor(secs)) * 100);
				return (n >= 0 ? pos : neg) + degs + '°' +
					zeroPad(mins) + '\'' +
					zeroPad(secs) + '.' + zeroPad(frac) + '"';
			}

			return sexagesimal(latLng.lat, 'N', 'S') + ' ' + sexagesimal(latLng.lng, 'E', 'W');
		},
		routeWhileDragging: true
	}).addTo(map);
}

function test2_waypointfallback() {
	var map = L.map('map');

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);

	console.log('geo', Geo)
	let [p1, p2] = [Geo.places.tuerkenschanzpark, Geo.places.vegagasse];
	map.setView(p1, 16)

	M = L.Routing.control({
		waypoints: [
			// L.latLng(57.74, 11.94),
			// L.latLng(57.6792, 11.949)
			L.latLng(p1[0], p1[1]),
			L.latLng(p2[0], p2[1])
		],
		waypointNameFallback: function (latLng) {
			function zeroPad(n) {
				n = Math.round(n);
				return n < 10 ? '0' + n : n;
			}
			function sexagesimal(p, pos, neg) {
				var n = Math.abs(p),
					degs = Math.floor(n),
					mins = (n - degs) * 60,
					secs = (mins - Math.floor(mins)) * 60,
					frac = Math.round((secs - Math.floor(secs)) * 100);
				return (n >= 0 ? pos : neg) + degs + '°' +
					zeroPad(mins) + '\'' +
					zeroPad(secs) + '.' + zeroPad(frac) + '"';
			}

			return sexagesimal(latLng.lat, 'N', 'S') + ' ' + sexagesimal(latLng.lng, 'E', 'W');
		},
		routeWhileDragging: true
	}).addTo(map);
}
function test1_basic() {
	var map = L.map('map');

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);

	console.log('geo', Geo)
	let [p1, p2] = [Geo.places.tuerkenschanzpark, Geo.places.vegagasse];
	map.setView(p1, 16)

	M = L.Routing.control({
		waypoints: [
			// L.latLng(57.74, 11.94),
			// L.latLng(57.6792, 11.949)
			L.latLng(p1[0], p1[1]),
			L.latLng(p2[0], p2[1])
		],
		routeWhileDragging: true
	}).addTo(map);
}

function test0_orig() {
	var map = L.map('map');

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '© OpenStreetMap contributors'
	}).addTo(map);


	L.Routing.control({
		waypoints: [
			L.latLng(57.74, 11.94),
			L.latLng(57.6792, 11.949)
		],
		routeWhileDragging: true
	}).addTo(map);
}









