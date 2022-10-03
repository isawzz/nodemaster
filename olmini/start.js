onload = start;
var map;
function start() {
	map = Mapping.create_map();
	//Mapping.set_style();
	Mapping.add_color_layer();
}
function onclick_geo() { map = Mapping.create_map('geo'); }
function onclick_OSM() { map = Mapping.create_map('OSM'); }
function onclick_clear() { Mapping.clear_source(); }















