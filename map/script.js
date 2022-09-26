mapboxgl.accessToken =
	"pk.eyJ1IjoidGF3enoiLCJhIjoiY2w4Z25iYmJpMGdmODNvbWw5c2d3enJ5ZSJ9.GcwAMxqmxDwVE665KFCMtQ";

const successLocation = (position) => {
	console.log(position); //9.05738,48.53502
	setupMap([9.05761,48.53495]);
	//setupMap([position.coords.longitude, position.coords.latitude]);
};

const errorLocation = () => {
	setupMap([-2.24, 53.48]);
};

const setupMap = (center) => {
	const map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/streets-v11",
		zoom: 16,
		center,
	});

	const nav = new mapboxgl.NavigationControl();
	map.addControl(nav);

	var directions = new MapboxDirections({
		accessToken: mapboxgl.accessToken,
	});

	map.addControl(directions, "top-left");
};

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
	enableHighAccuracy: true,
});
