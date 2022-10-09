var app = angular.module('prettymapapp', ['leaflet-directive']);

app.controller("MapController", ["$scope", "$http", function ($scope, $http) {


	var AddCurrentLocationToMap = function (p) {
		$scope.mapCenter.lat = p.coords.latitude;
		$scope.mapCenter.lon = p.coords.longitude;
		$scope.mapCenter.zoom = 14;
	}
	navigator.geolocation.getCurrentPosition(AddCurrentLocationToMap);


	$scope.setNewCentre = function (res) {
		console.log(res);
		$scope.mapCenter.lat = parseFloat(res.lat);
		$scope.mapCenter.lng = parseFloat(res.lon);
		$scope.searchResults = [];
		$scope.showInfoBox = false;
	}

	angular.extend($scope, {
		defaults: {
			maxZoom: 16
		},
		mapCenter: {
			lat: 54,
			lng: -2.5,
			zoom: 5
		},
		layers: {
			baselayers: {
				stamen_watercolor: {
					name: 'watercolor',
					url: "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
					layerOptions: {
						attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
						"showOnSelector": false,
						updateWhenIdle: false,
						reuseTiles: true
					},
					type: 'xyz'
				}

			},
			overlays: {
				stamen_toner: {
					name: 'Show Street Names',
					url: "http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
					layerOptions: {
						attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
						opacity: 0.4,
						"showOnSelector": false,
						detectRetina: true,
						updateWhenIdle: true,
						reuseTiles: true
					},
					type: 'xyz',
					visible: true
				}
			}
		}

	});


	$scope.toggleStreets = function () {
		$scope.layers.overlays.stamen_toner.visible = !$scope.layers.overlays.stamen_toner.visible;
	}



	$scope.showInfoBox = false;


	$scope.autoSearch = function () {
		if ($scope.queryText.length > 2) {
			$scope.doSearch();
		}
	}

	$scope.queryText = '';

	$scope.searchResults = '';

	$scope.doSearch = function () {
		if ($scope.queryText && $scope.queryText.length > 0) {
			console.log('Searching for ' + $scope.queryText);

			var url = "http://nominatim.openstreetmap.org/search?format=json&q=" + $scope.queryText;

			$http.get(url).
				success(function (data, status, headers, config) {

					console.log(data);
					$scope.searchResults = data;

				}).
				error(function (data, status, headers, config) {
					// log error
				});
		}
	}
}]);
