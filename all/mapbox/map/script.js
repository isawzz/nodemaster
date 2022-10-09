mapboxgl.accessToken = "pk.eyJ1IjoidGF3enoiLCJhIjoiY2w4Z25iYmJpMGdmODNvbWw5c2d3enJ5ZSJ9.GcwAMxqmxDwVE665KFCMtQ";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
	enableHighAccuracy: true
})

function successLocation(position) {
	setupMap([position.coords.longitude, position.coords.latitude])
}

function errorLocation() {
	setupMap([-2.24, 53.48])
}

function setupMap(center) {
	const map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/streets-v11",
		center: center,
		zoom: 12
	})

	const nav = new mapboxgl.NavigationControl()
	map.addControl(nav)

	// var directions = new MapboxDirections({ accessToken: mapboxgl.accessToken })
	// map.addControl(directions, "top-left")
}
