onload = start;
var map;
function start() {
	map = Mapping.create_map();
	make_favicon();
}
function onclick_geo() { map = Mapping.create_map('geo'); }
function onclick_OSM() { map = Mapping.create_map('OSM'); }
function onclick_clear() { Mapping.clear_source(); }


var Emicons = {
	maus: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/319/mouse-face_1f42d.png",
};

function make_favicon(key) {
	let url = valf(Emicons[key], Emicons.maus);
	var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	link.type = 'image/png';
	link.rel = 'shortcut icon';
	link.href = url; //'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico';
	document.getElementsByTagName('head')[0].appendChild(link);
}













