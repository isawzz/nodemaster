onload = start;
var map;
function start() {
	map = Mapping.create_map();
}
function onclick_geo() { map = Mapping.create_map('geo'); }
function onclick_OSM() { map = Mapping.create_map('OSM'); }
function onclick_clear() { Mapping.clear_source(); }














