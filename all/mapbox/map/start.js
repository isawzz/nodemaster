onload = start;
var map,nav;
function start() {
	mapboxgl.accessToken = "pk.eyJ1IjoidGF3enoiLCJhIjoiY2w4Z25iYmJpMGdmODNvbWw5c2d3enJ5ZSJ9.GcwAMxqmxDwVE665KFCMtQ";
	map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/streets-v11",
		zoom: 16,
		center: [-2.24, 53.48],
	});

	nav = new mapboxgl.NavigationControl();	map.addControl(nav);

}

