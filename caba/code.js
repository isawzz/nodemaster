
//#region maphelpers
function add_agent_at(map, p1) {
	//let p1 = [e.latlng.lat, e.latlng.lng];
	if (M.state != 'a') { console.log('wrong state!', M.state); return; }
	let a = new Agent(map, .0001, false, null, p1);
	lookupAddToList(M, ['agents'], a);
	console.log("adding agent at", p1);


}
function add_click_set_agent() { M.state = 'a'; M.map.on('click', e => { add_agent_at(M.map, [e.latlng.lat, e.latlng.lng]) }); }
function calc_map_dims(){
	//achtung lat lng ist vertauschte coords: h,w
	let d = M.dims = {
		pixels: get_map_dims_in_pixel(),
		meters: get_map_dims_in_meters(),
		latlng: get_map_dims_in_lat_lng(),
		zoom: M.map.getZoom(),
	};
	let ppm = M.dims.pixels_per_meter = [d.pixels[0]/d.meters[0],d.pixels[1]/d.meters[1]];
	M.dims.meters_per_pixel = [1/ppm[0],1/ppm[1]];

	let ppll = M.dims.pixels_per_ll = [d.pixels[0]/d.latlng[1],d.pixels[1]/d.latlng[0]];
	M.dims.ll_per_pixel = [1/ppll[0],1/ppll[1]];

	let mpll = M.dims.meters_per_ll = [d.meters[0]/d.latlng[1],d.meters[1]/d.latlng[0]];
	M.dims.ll_per_meters = [1/mpll[1],1/mpll[0]]; //das erste soll lat per meters sein!!!!!

}
function clear_agents() {
	for (const a of M.agents) {
		let marker = a.ui;
		M.map.removeLayer(marker);
	}
	M.agents = [];
}
function clear_router() { M.map.removeControl(M.router); }
function create_agent(where, o = {}) {
	let res;
	if (is_map(where)) {
		res = L.marker(where.options.center).addTo(where);
	} else {
		res = mDiv(where, o);
	}
	return res;
}
function create_map(o = {}) {
	addKeys({ maxBounds: [[-89.98155760646617, -180], [89.99346179538875, 180]], key: 'osm', center: Geo.places.tuerkenschanzpark, zoom: 17, id: 'map' }, o);
	let info = Geo.layerInfo[o.key];
	o.layers = [isdef(info) ? L.tileLayer(info.url, info.options) : L.tileLayer('')];
	let map = L.map(o.id, o);
	return map;
}
function create_toolbar(map) {
	let d = map._controlContainer; //document.getElementsByClassName('leaflet-control-container')[0];
	console.log('control container', d);

	dMap = mDiv(d, { position: 'absolute', top: 0, left: 50, w: '100%', h: '100%' });
	dMap.style.zIndex = 12000;

	let toolbar = mDiv(dMap, { hmargin: 10, padding: 10, cursor: 'pointer' }, null, null, 'top'); mFlexWrap(toolbar);

	return toolbar;

}
function dummy_reaction(ev) { console.log('clicked', ev.target) }
function fit_points(map, pts, padding = true) {
	let latlngs = to_lat_lng(pts); //pts.map(marker => point_to_marker.getLatLng())
	let o = L.latLngBounds(latlngs);
	map.fitBounds(o, { padding: padding ? [25, 25] : [0, 0] });

}
function from_lat_lng(p) { return [p.lat, p.lng]; }
function from_lat_long(p) { return from_lat_lng(p); }
async function get_cities_and_capitals() {
	let cities = await route_path_yaml_dict('../base/mapdata/cities.yaml');

	//console.log('cities',cities)
	let cont_by_country = {};
	for (const continent in Geo.continents) {
		for (const country of Geo.continents[continent]) {
			cont_by_country[country] = continent;
		}
	}

	let res = {}; let capitals = []; 
	for (const c in cities) {
		let s = cities[c];
		let ws = s.split(',').map(x => x.trim());
		let o = { name: c, lon: Number(ws[0]), lat: Number(ws[1]), country: ws[2], type: ws[3], pop: Number(ws[4]) };
		o.center = [o.lat, o.lon];
		if (o.type == 'capital') capitals.push(c);
		o.continent=cont_by_country[o.country];
		if (nundef(o.continent)) {console.log('no continent for',o.country); break; }
		res[c] = o;
	}
	Geo.cities = res;
	Geo.capitals = capitals;
}
function get_distance(from, to) {
	var fromLatLng = L.latLng(from);
	var toLatLng = L.latLng(to);

	var dis = fromLatLng.distanceTo(toLatLng);
	console.log('distance in meters', dis);
	return dis;
}
function get_map_dims_in_lat_lng() { return get_map_dims_in_lat_long(); }
function get_map_dims_in_lat_long() {
	let map = M.map;
	const se = map.getBounds().getSouthEast();
	const ne = map.getBounds().getNorthEast();
	const nw = map.getBounds().getNorthWest();
	//console.log('se',se);
	return [Math.abs(se.lat-ne.lat),Math.abs(ne.lng-nw.lng)];
}
function get_map_dims_in_meters() {
	let map = M.map;
	const southEastPoint = map.getBounds().getSouthEast();
	const northEastPoint = map.getBounds().getNorthEast();
	const northWestPoint = map.getBounds().getNorthWest();
	const h = southEastPoint.distanceTo(northEastPoint);
	const w = northWestPoint.distanceTo(northEastPoint);
	return [w, h];
}
function get_map_dims_in_pixel(){ 
	let container = M.map.getContainer();
	let rect = getRect(container);
	return [rect.w,rect.h];
	//console.log('container',container)
}
function get_meters_per_pixel() {
	let map = M.map;
	const southEastPoint = map.getBounds().getSouthEast();
	const northEastPoint = map.getBounds().getNorthEast();
	const mapHeightInMetres = southEastPoint.distanceTo(northEastPoint);
	const mapHeightInPixels = map.getSize().y;

	return mapHeightInMetres / mapHeightInPixels;
} 
function get_middle_point(p1, p2) { return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]; }
function is_lat_lng(p) { return isdef(p.lat); }
function is_lat_long(p) { return is_lat_lng(p); }
function is_map(o) { return isdef(o.map) || isdef(o._panes); }
function map_moveby(pin, fx, fy) {
	let pos = pin.getLatLng();
	let lat = fx(pos.lat);
	let lng = fy(pos.lng);
	pin.setLatLng([lat, lng]);
}
function map_moveto(pin, center) { pin.setLatLng(center); }
function points_to_waypoints(pts = []) { return pts.map(x => L.latLng(x[0], x[1])); }
function show_map_dims(){
	let map=M.map;
	console.log('________ at zoom',map.getZoom());
	console.log('meters per pixel',get_meters_per_pixel());
	console.log('map dims in meters',get_map_dims_in_meters());
	console.log('map dims in lat lon',get_map_dims_in_lat_long());
	console.log('map dims in pixel',get_map_dims_in_pixel());

}
function show_route(map, pts, color, callback) {
	let control = L.Routing.control({
		waypoints: points_to_waypoints(pts),
		lineOptions: { styles: [{ color: color, opacity: 1, weight: 3 }], },
		draggableWaypoints: false,
		createMarker: function () { return false; },
		show: false,
	}).addTo(map);
	control.on('routesfound', callback); //e => { fit_points(map,pts); });
	return control;
}
function to_lat_lng(pts = []) { return points_to_waypoints(pts); }
function to_lat_long(pts = []) { return points_to_waypoints(pts); }


