if (typeof (L) !== 'undefined') {

	L.Mixin.TileLoader = {

		_initTileLoader: function () {
			this._tiles = {}
			this._tilesLoading = {};
			this._tilesToLoad = 0;
			this._map.on({
				'moveend': this._updateTiles
			}, this);
			this._updateTiles();
		},

		_removeTileLoader: function () {
			this._map.off({
				'moveend': this._updateTiles
			}, this);
			this._removeTiles();
		},

		_updateTiles: function () {

			if (!this._map) { return; }

			var bounds = this._map.getPixelBounds(),
				zoom = this._map.getZoom(),
				tileSize = this.options.tileSize;

			if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
				return;
			}

			var nwTilePoint = new L.Point(
				Math.floor(bounds.min.x / tileSize),
				Math.floor(bounds.min.y / tileSize)),

				seTilePoint = new L.Point(
					Math.floor(bounds.max.x / tileSize),
					Math.floor(bounds.max.y / tileSize)),

				tileBounds = new L.Bounds(nwTilePoint, seTilePoint);

			this._addTilesFromCenterOut(tileBounds);
			this._removeOtherTiles(tileBounds);
		},

		_removeTiles: function (bounds) {
			for (var key in this._tiles) {
				this._removeTile(key);
			}
		},

		_reloadTiles: function () {
			this._removeTiles();
			this._updateTiles();
		},

		_removeOtherTiles: function (bounds) {
			var kArr, x, y, z, key;
			var zoom = this._map.getZoom();

			for (key in this._tiles) {
				if (this._tiles.hasOwnProperty(key)) {
					kArr = key.split(':');
					x = parseInt(kArr[0], 10);
					y = parseInt(kArr[1], 10);
					z = parseInt(kArr[2], 10);

					// remove tile if it's out of bounds
					if (zoom !== z || x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {
						this._removeTile(key);
					}
				}
			}
		},

		_removeTile: function (key) {
			this.fire('tileRemoved', this._tiles[key]);
			delete this._tiles[key];
			delete this._tilesLoading[key];
		},

		_tileKey: function (tilePoint) {
			return tilePoint.x + ':' + tilePoint.y + ':' + tilePoint.zoom;
		},

		_tileShouldBeLoaded: function (tilePoint) {
			var k = this._tileKey(tilePoint);
			return !(k in this._tiles) && !(k in this._tilesLoading);
		},

		_tileLoaded: function (tilePoint, tileData) {
			this._tilesToLoad--;
			var k = tilePoint.x + ':' + tilePoint.y + ':' + tilePoint.zoom
			this._tiles[k] = tileData;
			delete this._tilesLoading[k];
			if (this._tilesToLoad === 0) {
				this.fire("tilesLoaded");
			}
		},

		getTilePos: function (tilePoint) {
			tilePoint = new L.Point(tilePoint.x, tilePoint.y);
			var origin = this._map._getNewTopLeftPoint(this._map.getCenter()),
				tileSize = this.options.tileSize;

			return tilePoint.multiplyBy(tileSize).subtract(origin);
		},

		_addTilesFromCenterOut: function (bounds) {
			var queue = [],
				center = bounds.getCenter(),
				zoom = this._map.getZoom();

			var j, i, point;

			for (j = bounds.min.y; j <= bounds.max.y; j++) {
				for (i = bounds.min.x; i <= bounds.max.x; i++) {
					point = new L.Point(i, j);
					point.zoom = zoom;

					if (this._tileShouldBeLoaded(point)) {
						queue.push(point);
					}
				}
			}

			var tilesToLoad = queue.length;

			if (tilesToLoad === 0) { return; }

			// load tiles in order of their distance to center
			queue.sort(function (a, b) {
				return a.distanceTo(center) - b.distanceTo(center);
			});

			this._tilesToLoad += tilesToLoad;

			for (i = 0; i < tilesToLoad; i++) {
				var t = queue[i];
				var k = this._tileKey(t);
				this._tilesLoading[k] = t;
				this.fire('tileAdded', t);
			}
			this.fire("tilesLoading");

		}
	}

}
if (typeof (L) !== 'undefined') {
	L.CanvasLayer = L.Class.extend({

		// includes: [L.Mixin.Events, L.Mixin.TileLoader], 
		includes: [L.Evented, L.Mixin.TileLoader],

		options: {
			minZoom: 0,
			maxZoom: 28,
			tileSize: 256,
			subdomains: 'abc',
			errorTileUrl: '',
			attribution: '',
			zoomOffset: 0,
			opacity: 1,
			unloadInvisibleTiles: L.Browser.mobile,
			updateWhenIdle: L.Browser.mobile,
			tileLoader: false // installs tile loading events
		},

		initialize: function (options) {
			var self = this;
			options = options || {};
			//this.project = this._project.bind(this);
			this.render = this.render.bind(this);
			L.Util.setOptions(this, options);
			this._canvas = this._createCanvas();
			// backCanvas for zoom animation
			this._backCanvas = this._createCanvas();
			this._ctx = this._canvas.getContext('2d');
			this.currentAnimationFrame = -1;
			this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
				window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
					return window.setTimeout(callback, 1000 / 60);
				};
			this.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
				window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function (id) { clearTimeout(id); };
		},

		_createCanvas: function () {
			var canvas;
			canvas = document.createElement('canvas');
			canvas.style.position = 'absolute';
			canvas.style.top = 0;
			canvas.style.left = 0;
			canvas.style.pointerEvents = "none";
			canvas.style.zIndex = this.options.zIndex || 0;
			var className = 'leaflet-tile-container leaflet-zoom-animated';
			canvas.setAttribute('class', className);
			return canvas;
		},

		onAdd: function (map) {
			this._map = map;

			// add container with the canvas to the tile pane
			// the container is moved in the oposite direction of the 
			// map pane to keep the canvas always in (0, 0)
			var tilePane = this._map._panes.tilePane;
			var _container = L.DomUtil.create('div', 'leaflet-layer');
			_container.appendChild(this._canvas);
			_container.appendChild(this._backCanvas);
			this._backCanvas.style.display = 'none';
			tilePane.appendChild(_container);

			this._container = _container;

			// hack: listen to predrag event launched by dragging to
			// set container in position (0, 0) in screen coordinates
			if (map.dragging.enabled()) {
				map.dragging._draggable.on('predrag', function () {
					var d = map.dragging._draggable;
					L.DomUtil.setPosition(this._canvas, { x: -d._newPos.x, y: -d._newPos.y });
				}, this);
			}

			map.on({ 'viewreset': this._reset }, this);
			map.on('move', this.redraw, this);
			map.on('resize', this._reset, this);
			map.on({
				'zoomanim': this._animateZoom,
				'zoomend': this._endZoomAnim
			}, this);

			if (this.options.tileLoader) {
				this._initTileLoader();
			}

			this._reset();
		},

		_animateZoom: function (e) {
			if (!this._animating) {
				this._animating = true;
			}
			var back = this._backCanvas;

			back.width = this._canvas.width;
			back.height = this._canvas.height;

			// paint current canvas in back canvas with trasnformation
			var pos = this._canvas._leaflet_pos || { x: 0, y: 0 };
			back.getContext('2d').drawImage(this._canvas, 0, 0);

			// hide original
			this._canvas.style.display = 'none';
			back.style.display = 'block';
			var map = this._map;
			var scale = map.getZoomScale(e.zoom);
			var newCenter = map._latLngToNewLayerPoint(map.getCenter(), e.zoom, e.center);
			var oldCenter = map._latLngToNewLayerPoint(e.center, e.zoom, e.center);

			var origin = {
				x: newCenter.x - oldCenter.x,
				y: newCenter.y - oldCenter.y
			};

			var bg = back;
			var transform = L.DomUtil.TRANSFORM;
			bg.style[transform] = L.DomUtil.getTranslateString(origin) + ' scale(' + e.scale + ') ';
		},

		_endZoomAnim: function () {
			this._animating = false;
			this._canvas.style.display = 'block';
			this._backCanvas.style.display = 'none';
		},

		getCanvas: function () {
			return this._canvas;
		},

		getAttribution: function () {
			return this.options.attribution;
		},

		draw: function () {
			return this._reset();
		},

		onRemove: function (map) {
			this._container.parentNode.removeChild(this._container);
			map.off({
				'viewreset': this._reset,
				'move': this._render,
				'resize': this._reset,
				'zoomanim': this._animateZoom,
				'zoomend': this._endZoomAnim
			}, this);
		},

		addTo: function (map) {
			map.addLayer(this);
			return this;
		},

		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			this._updateOpacity();
			return this;
		},

		setZIndex: function (zIndex) {
			this._canvas.style.zIndex = zIndex;
		},

		bringToFront: function () {
			return this;
		},

		bringToBack: function () {
			return this;
		},

		_reset: function () {
			var size = this._map.getSize();
			this._canvas.width = size.x;
			this._canvas.height = size.y;

			// fix position
			var pos = L.DomUtil.getPosition(this._map.getPanes().mapPane);
			if (pos) {
				L.DomUtil.setPosition(this._canvas, { x: -pos.x, y: -pos.y });
			}
			this.onResize();
			this._render();
		},

		/*
		_project: function(x) {
			var point = this._map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
			return [point.x, point.y];
		},
		*/

		_updateOpacity: function () { },

		_render: function () {
			if (this.currentAnimationFrame >= 0) {
				this.cancelAnimationFrame.call(window, this.currentAnimationFrame);
			}
			this.currentAnimationFrame = this.requestAnimationFrame.call(window, this.render);
		},

		// use direct: true if you are inside an animation frame call
		redraw: function (direct) {
			var domPosition = L.DomUtil.getPosition(this._map.getPanes().mapPane);
			if (domPosition) {
				L.DomUtil.setPosition(this._canvas, { x: -domPosition.x, y: -domPosition.y });
			}
			if (direct) {
				this.render();
			} else {
				this._render();
			}
		},

		onResize: function () {
		},

		render: function () {
			throw new Error('render function should be implemented');
		}

	});

}


function canvas_overlay() {
	let map = create_map({ center: [51.505, -0.09], zoom: 7, preferCanvas: true, baselayer: 'osm' });

	// custom canvas layer (only added)
	var customlayer = L.Layer.extend({
		initialize: function (options) {
			this._map = map;
			this._canvas = null;
			this._frame = null;
			this._delegate = null;
			L.setOptions(this, options);
			this.onAdd();
		},
		onAdd: function () {
			this._canvas = L.DomUtil.create('canvas', 'leaflet-layer custom');

			var size = this._map.getSize();
			this._canvas.width = size.x;
			this._canvas.height = size.y;

			this._map._panes.overlayPane.appendChild(this._canvas);
		}
	});
	new customlayer();

	// markerpin example
	L.Canvas.include({
		_updateMarkerPin0: function (layer) {
			if (!this._drawing || layer._empty()) {
				return;
			}

			var p = layer._point,
				ctx = this._ctx,
				r = layer._radius;

			//console.log('layer', layer, this)
			//this._drawnLayers[layer._leaflet_id] = layer;

			//cEllipse(0, 0, 2*r, 2*r, {}, 0, ctx);
			ctx.beginPath();
			ctx.fillStyle = 'blue';
			ctx.moveTo(p.x, p.y);
			ctx.ellipse(p.x, p.y, r, r, 0, 0, 2 * Math.PI);
			// ctx.lineTo(p.x - 0.58 * r, p.y - r);
			//ctx.arc(p.x, p.y - 2 * r, r, -Math.PI * 1.161, Math.PI * 0.161);
			ctx.closePath();
			ctx.fill();
			// this._fill(ctx, layer);
			//this._fillStroke(ctx, layer);
		},
		_updateMarkerPin_orig: function (layer) {
			if (!this._drawing || layer._empty()) {
				return;
			}

			var p = layer._point,
				ctx = this._ctx,
				r = layer._radius;

			//console.log('layer', layer, this)
			//this._drawnLayers[layer._leaflet_id] = layer;

			//cEllipse(0, 0, 2*r, 2*r, {}, 0, ctx);
			ctx.beginPath();
			ctx.moveTo(p.x, p.y);
			ctx.lineTo(p.x - 0.58 * r, p.y - r);
			ctx.arc(p.x, p.y - 2 * r, r, -Math.PI * 1.161, Math.PI * 0.161);
			ctx.closePath();
			this._fillStroke(ctx, layer);
		},
		_updateMarkerPin: function (layer) {
			if (!this._drawing || layer._empty()) { return; }
			var p = layer._point, ctx = this._ctx, r = layer._radius;
			cEllipse(p.x, p.y, 2 * r, 2 * r, { bg: 'orange' }, 0, ctx);
			// ctx.beginPath();
			// ctx.moveTo(p.x, p.y);
			// ctx.lineTo(p.x - 0.58 * r, p.y - r);
			// ctx.arc(p.x, p.y - 2 * r, r, -Math.PI * 1.161, Math.PI * 0.161);
			// ctx.closePath();
			// this._fillStroke(ctx, layer);
		}

	});


	L.MarkerPin = L.CircleMarker.extend({
		_updatePath: function () {
			this._renderer._updateMarkerPin(this);
		},
		_containsPoint: function (p) {
			var r = this._radius;

			var insideCircle =
				p.add([0, r * 2]).distanceTo(this._point) <= r + this._clickTolerance();

			var a = this._point,
				b = a.subtract([0.58 * r, r]),
				c = a.subtract([-0.58 * r, r]);

			var insideTriangle = true;

			var ap_x = p.x - a.x;
			var ap_y = p.y - a.y;
			var p_ab = (b.x - a.x) * ap_y - (b.y - a.y) * ap_x > 0;
			var p_ac = (c.x - a.x) * ap_y - (c.y - a.y) * ap_x > 0;
			var p_bc = (c.x - b.x) * (p.y - b.y) - (c.y - b.y) * (p.x - b.x) > 0;

			if (p_ac === p_ab) insideTriangle = false;
			if (p_bc !== p_ab) insideTriangle = false;
			return insideTriangle || insideCircle;
		}
	});


	map.createPane("customPane");
	var canvasRenderer = L.canvas({ pane: 'customPane' });
	let pin = new L.MarkerPin([51.505, -0.09], {
		weight: 2,
		fillColor: "red",
		fillOpacity: 0.5,
		color: '#333',
		radius: 5,
		renderer: canvasRenderer
	}).bindPopup('hello').addTo(map);

	return pin;
}



